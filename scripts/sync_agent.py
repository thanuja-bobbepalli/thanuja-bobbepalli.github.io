import os
import json
import requests
from typing import List, Dict, TypedDict, Annotated
from langgraph.graph import StateGraph, END
from langchain_core.messages import SystemMessage, HumanMessage
from dotenv import load_dotenv
from datetime import datetime
from langchain_huggingface import ChatHuggingFace,HuggingFaceEndpoint
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq

load_dotenv()

# --- State Definition ---
class AgentState(TypedDict):
    repos_to_analyze: List[Dict]
    existing_data: List[Dict]
    processed_data: List[Dict]
    current_repo_index: int
    error: str

# --- Nodes ---

def fetch_and_filter_repos(state: AgentState):
    """Fetch repos and determine which ones actually need analysis."""
    print("--- Fetching and Filtering Repositories ---")
    username = "Thanuja-Bobbepalli"
    url = f"https://api.github.com/users/{username}/repos?sort=updated&per_page=100"                                                                                                                                                                                                                                                                                                
    # Load existing data
    data_path = os.path.join(os.path.dirname(__file__), "..", "data", "projects.json")
    existing_projects = []
    if os.path.exists(data_path):
        try:
            with open(data_path, 'r') as f:
                existing_projects = json.load(f)
        except:
            pass

    try:
        response = requests.get(url)
        response.raise_for_status()
        github_repos = response.json()
        
        # Create a lookup for existing projects by their GitHub URL
        existing_lookup = {p['github']: p for p in existing_projects}
        
        repos_to_analyze = []
        unchanged_data = []

        for repo in github_repos:
            # Skip forks and meta-repos
            if repo['fork'] or repo['name'] in ['Thanuja-Bobbepalli', 'Certificates']:
                continue
            
            repo_url = repo['html_url']
            repo_updated_at = repo['updated_at'] # e.g. "2024-03-21T15:00:00Z"
            
            # Check if we already have this repo and if it has changed
            existing = existing_lookup.get(repo_url)
            
            # Robust Date Comparison
            # GitHub uses "Z", my manual sync used "+00:00". We normalize both.
            def normalize_date(d):
                return d.replace('Z', '+00:00') if d else None

            if existing and normalize_date(existing.get('last_updated')) == normalize_date(repo_updated_at):
                unchanged_data.append(existing)
                print(f"Skipping {repo['name']} (Cached)")
            else:
                repo['last_updated'] = repo_updated_at 
                repos_to_analyze.append(repo)
                print(f"Queueing {repo['name']} for AI analysis")

        return {
            "repos_to_analyze": repos_to_analyze, 
            "existing_data": unchanged_data, 
            "processed_data": [], 
            "current_repo_index": 0
        }
    except Exception as e:
        return {"error": str(e)}

def analyze_repo(state: AgentState):
    """Analyze a single repository using LLM."""
    idx = state['current_repo_index']
    if idx >= len(state['repos_to_analyze']):
        return state

    repo = state['repos_to_analyze'][idx]
    print(f"--- Analyzing Repo: {repo['name']} ({idx + 1}/{len(state['repos_to_analyze'])}) ---")

    # Get README snippet
    readme_content = ""
    try:
        readme_url = f"https://api.github.com/repos/{repo['full_name']}/readme"
        r = requests.get(readme_url)
        if r.status_code == 200:
            import base64
            readme_content = base64.b64decode(r.json()['content']).decode('utf-8')[:2000]
    except:
        pass

    def invoke_llm_with_fallback(messages):
        # OPTION A: Try Google Gemini 2.5 Flash
        try:
            print("Attempting Gemini 2.5...")
            llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash", # [1]
                google_api_key=os.getenv("GOOGLE_API_KEY"),
                temperature=0.3
            )
            return llm.invoke(messages)
        
        except Exception as e:
            # OPTION B: Fallback to Groq (Llama 3.3)
            print(f"Gemini Failed ({str(e)}). Switching to Groq...")
            llm_fallback = ChatGroq(
                model="llama-3.3-70b-versatile", # [2]
                api_key=os.getenv("GROQ_API_KEY"),
                temperature=0.3
            )
            return llm_fallback.invoke(messages)  
    
    prompt = f"""
    Analyze this GitHub repository for a professional portfolio.
    Name: {repo['name']}
    Description: {repo['description'] or 'No description'}
    Readme: {readme_content}
    
    Output JSON:
    - title: Professional name
    - description: Impactful summary
    - category: [ai-agents, dl-cv, data-science, web-dev, resources]
    - tech: List of top 4
    - github: {repo['html_url']}
    - featured: true/false
    - last_updated: {repo['last_updated']}
    
    Respond ONLY with JSON.
    """
    
    try:
        response =  invoke_llm_with_fallback([HumanMessage(content=prompt)])
        content = response.content.replace("```json", "").replace("```", "").strip()
        repo_data = json.loads(content)
        # 🔑 CRITICAL FIX: Always overwrite these fields with exact GitHub values.
        # The LLM might alter the date format slightly, breaking cache comparisons.
        repo_data['last_updated'] = repo['last_updated']
        repo_data['github'] = repo['html_url']
        state['processed_data'].append(repo_data)
    except Exception as e:
        print(f"Error: {e}")
        state['processed_data'].append({
            "title": repo['name'],
            "description": repo['description'] or "Project by Thanuja",
            "category": "web-dev",
            "tech": [],
            "github": repo['html_url'],
            "featured": False,
            "last_updated": repo['last_updated']
        })

    return {"current_repo_index": idx + 1}

def save_data(state: AgentState):
    """Combine new and old data into projects.json."""
    print("--- Saving Optimized Data ---")
    data_path = os.path.join(os.path.dirname(__file__), "..", "data", "projects.json")
    
    all_projects = state['existing_data'] + state['processed_data']
    
    # Sort: Featured first, then by last_updated (newest first)
    sorted_data = sorted(
        all_projects, 
        key=lambda x: (not x.get('featured', False), x.get('last_updated', '')), 
        reverse=False # We want (False, newest_date) to come first.
    )
    
    # Actually, to get Featured (True) at top AND Newest date at top:
    # False < True, so 'not featured' (False for featured) comes first.
    # For dates, '2024' > '2023'. So for reverse=False, we need a way to make newer dates 'smaller'.
    # Or just use a more explicit sort:
    all_projects.sort(key=lambda x: x.get('last_updated', ''), reverse=True) # Newest first
    all_projects.sort(key=lambda x: x.get('featured', False), reverse=True) # Then Featured first
    sorted_data = all_projects
    
    with open(data_path, 'w') as f:
        json.dump(sorted_data, f, indent=2)
    
    print(f"Updated {data_path}. Analyzed {len(state['processed_data'])} new/updated repos. Kept {len(state['existing_data'])} from cache.")
    return state

def should_continue(state: AgentState):
    if state.get('error'): return "end"
    if state['current_repo_index'] < len(state['repos_to_analyze']):
        return "analyze"
    return "save"

# --- Graph ---
workflow = StateGraph(AgentState)
workflow.add_node("fetch", fetch_and_filter_repos)
workflow.add_node("analyze", analyze_repo)
workflow.add_node("save", save_data)

workflow.set_entry_point("fetch")
workflow.add_conditional_edges("fetch", should_continue, {"analyze": "analyze", "save": "save", "end": END})
workflow.add_conditional_edges("analyze", should_continue, {"analyze": "analyze", "save": "save"})
workflow.add_edge("save", END)

app = workflow.compile()

if __name__ == "__main__":
    app.invoke({"repos_to_analyze": [], "existing_data": [], "processed_data": [], "current_repo_index": 0, "error": ""})
