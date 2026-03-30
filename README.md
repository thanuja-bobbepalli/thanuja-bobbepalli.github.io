# THANUJA BOBBEPALLI - AI/ML Engineer Portfolio

**Live Demo:** [https://thanuja-bobbepalli.github.io](https://thanuja-bobbepalli.github.io)

A unique, cyberpunk-themed portfolio website with **AI-powered automatic project updates** featuring neural network animations, terminal-style interface, and cutting-edge interactive elements.

---

## Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [How It Works (Auto-Update System)](#-how-it-works-auto-update-system)
4. [Project Structure](#-project-structure)
5. [Tech Stack](#-tech-stack)
6. [Setup & Installation](#-setup--installation)
7. [Implementation Guide for New Users](#-implementation-guide-for-new-users)
8. [Troubleshooting](#-troubleshooting)

---

## Project Overview

This is a **next-generation portfolio** that combines:
- **Static Showcase**: Beautiful cyberpunk-themed frontend (HTML/CSS/JS)
- **AI-Powered Backend**: LangGraph + LLM agents that automatically analyze GitHub repos
- **Smart Caching**: Efficient updates (only re-analyzes changed projects)
- **CI/CD Automation**: GitHub Actions runs sync every 24 hours

**What makes it special?**
- ✓ Portfolio updates **automatically** - no manual editing needed
- ✓ AI analyzes your GitHub repos and writes descriptions
- ✓ Fallback system (Gemini → Groq) ensures reliability
- ✓ Smart caching = faster execution
- ✓ Auto-commits to GitHub (only when changes detected)

---

## Key Features

### Visual Effects
- **Neural Network Background** - Animated particle system with mouse interaction
- **Matrix Rain Effect** - Subtle Japanese character rain in background
- **Custom Cursor** - Dot + ring cursor with hover effects
- **Cursor Glow** - Ambient glow that follows mouse
- **Glitch Effects** - Cyberpunk-inspired text animations
- **Neon Glow Effects** - Pulsing neon borders and shadows

### UI Components
- **Animated Preloader** - Brain/neural network loading animation
- **Terminal-Style Hero** - Command-line aesthetic with typing effect
- **ASCII Art Name** - Your name in cool text art
- **3D Card Hover** - Project cards tilt with perspective
- **Skill Progress Bars** - Animated when scrolled into view
- **Counter Animations** - Stats count up on scroll
- **Scroll Progress Bar** - Shows page scroll progress
- **Back to Top Button** - Smooth scroll to top
- **Theme Toggle** - Dark/Light mode switch

### AI Automation Features
- **Auto-Project Analysis** - AI reads GitHub repos & writes descriptions
- **Smart Caching** - Only analyzes changed repositories
- **Scheduled Sync** - Runs every 24 hours automatically
- **LLM Fallback** - Tries Gemini, falls back to Groq if needed
- **Auto-Commit** - Only commits when changes exist

### Interactive Elements
- **Interactive Terminal** - Press `Ctrl+\`` for hidden command line!
- **Text Scramble** - Hover effect on special text
- **Magnetic Buttons** - Buttons that respond to cursor
- **Tooltip Hints** - Helpful hover tooltips
- **Console Easter Egg** - ASCII art in browser console

### Technical Features
- **Fully Responsive** - Mobile-first design
- **SEO Optimized** - Meta tags, Open Graph, Twitter Cards
- **Fast Loading** - Optimized assets, lazy loading
- **ATS-Friendly** - Clean HTML structure
- **No Frontend Dependencies** - Pure HTML/CSS/JS

---

## How It Works (Auto-Update System)

### Complete Workflow Diagram

#### **Scenario 1: GitHub repos HAVE CHANGES**

```
┌─────────────────────────────────────────────────────────────┐
│  TRIGGER (Every 24h OR push to main OR manual click)        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌─────────────────────────────┐
        │  1. FETCH GitHub Repos      │
        │  (Get all your public repos)│
        └────────────┬────────────────┘
                     │
                     ▼
        ┌─────────────────────────────┐
        │  2. COMPARE WITH CACHE      │
        │  (Check if anything changed)│
        └────────────┬────────────────┘
                     │
              ┌──────┴──────┐
              │             │
          NO CHANGES    HAS CHANGES
              │             │
              ▼             ▼
         ┌────────┐   ┌──────────────────┐
         │  SKIP  │   │ 3. AI ANALYSIS   │
         │  ✅    │   │ (Gemini/Groq LLM)│
         └────────┘   └────────┬─────────┘
              │                │
              │                ▼
              │        ┌─────────────────────┐
              │        │ Get: Title, Skills, │
              │        │ Description, Tech   │
              │        │ Category            │
              │        └────────┬────────────┘
              │                │
              └────────┬───────┘
                       │
                       ▼
        ┌─────────────────────────────┐
        │  4. MERGE DATA              │
        │  (Old cached + New AI data) │
        └────────────┬────────────────┘
                     │
                     ▼
        ┌─────────────────────────────┐
        │  5. SAVE projects.json      │
        │  (Sort: Featured first)     │
        │  (Then: By date, newest)    │
        └────────────┬────────────────┘
                     │
                     ▼
        ┌─────────────────────────────┐
        │  6. AUTO-COMMIT & PUSH      │
        │  (If changes exist)         │
        └────────────┬────────────────┘
                     │
                     ▼
        ┌─────────────────────────────┐
        │  DONE - Portfolio Updated   │
        └─────────────────────────────┘
```

---

#### **Scenario 2: GitHub repos NO CHANGES**

```
┌─────────────────────────────────────────┐
│  GitHub Repos (All UNCHANGED)           │
└────────────────────┬────────────────────┘
                     │
                     ▼
        ┌─────────────────────────────┐
        │  2. COMPARE WITH CACHE      │
        │  (All repos = NO CHANGES)   │
        └────────────┬────────────────┘
                     │
                     ▼
        ┌─────────────────────────────┐
        │  All repos go to CACHE      │
        │  (Skip AI analysis)         │
        │  processed_data = EMPTY     │
        └────────────┬────────────────┘
                     │
                     ▼
        ┌─────────────────────────────┐
        │  4. MERGE DATA              │
        │  Cached data + (nothing new)│
        │  = Same old projects.json   │
        └────────────┬────────────────┘
                     │
                     ▼
        ┌─────────────────────────────┐
        │  5. SAVE projects.json      │
        │  (Identical to before)      │
        └────────────┬────────────────┘
                     │
                     ▼
        ┌─────────────────────────────┐
        │  6. AUTO-COMMIT CHECK       │
        │  git diff = NO CHANGES      │
        │  → NO COMMIT                │
        │  → NO PUSH                  │
        │  (Efficient!)               │
        └─────────────────────────────┘
```

---

### Step-by-Step Process Explained

| Step | What Happens | Details |
|------|-------------|---------|
| **1. FETCH** | Get all GitHub repos | Calls GitHub API, retrieves 100 repos sorted by update date |
| **2. COMPARE** | Check for changes | Compares `updated_at` timestamp with cached `projects.json` data |
| **3. SKIP or ANALYZE** | Smart caching | Unchanged repos = reuse old data; Changed repos = queue for AI |
| **4. AI ANALYSIS** | Process changes | Send repo info to Gemini LLM (with Groq fallback) |
| **5. MERGE** | Combine data | Mix cached repos + newly analyzed repos |
| **6. SORT** | Order results | Featured projects first, then by date (newest first) |
| **7. SAVE** | Write to disk | Save merged data to `data/projects.json` |
| **8. COMMIT** | Push to GitHub | Only if changes detected (no empty commits!) |

---

## � Scenarios & Commit Behavior

### Scenario 1: Repository Updated - Changes Detected ✅

```
Timeline: Day 1, 12:00 AM
GitHub Repos: Repo A updated with new code
↓
Cache System: Detects update (timestamp changed)
↓
AI Analysis: Analyzes Repo A + uses cached data for others
↓
Content Comparison: NEW JSON ≠ OLD JSON
↓
Result: 
  ✓ Write to projects.json
  ✓ Commit created: "chore: auto-update portfolio projects"
  ✓ Portfolio deployed with new content
```

### Scenario 2: No Repository Changes - Nothing New ✅

```
Timeline: Day 2, 12:00 AM (24 hours after Day 1)
GitHub Repos: ALL repos unchanged (same timestamps as Day 1)
↓
Cache System: All repos are cached (no AI analysis needed)
↓
Content Comparison: 
  OLD JSON (from Day 1) = NEW JSON (generated today)
  ✓ IDENTICAL!
↓
Result:
  ✗ Skip write to disk (no file touched)
  ✗ NO commit created
  ✗ NO deployment
  ✓ Print: "✓ No changes detected. Skipping write."
```

### Scenario 3: One Repo Updates After Days of No Change ✅

```
Timeline: Day 4, 12:00 AM
GitHub Repos: Finally, Repo B gets updated
↓
Cache System: Detects change in Repo B only
↓
AI Analysis: Only Repo B analyzed (others from cache)
↓
Content Comparison: NEW JSON ≠ OLD JSON (Repo B data updated)
↓
Result:
  ✓ Write to projects.json
  ✓ Commit created: "chore: auto-update portfolio projects"
  ✓ Portfolio deployed with Repo B updates
```

---

## 📈 Commit Activity Over Time

### Table 1: Commits Without Content Detection (Old Behavior)
| Day | GitHub Updates | AI Analysis | Commits | Portfolio Deploy |
|-----|---|---|---|---|
| Day 1 | Repo A updated | ✓ Yes | 1 | ✓ Yes |
| Day 2 | None | ✗ No | 1 ❌ (Empty) | ❌ Unnecessary |
| Day 3 | None | ✗ No | 1 ❌ (Empty) | ❌ Unnecessary |
| Day 4 | Repo B updated | ✓ Yes | 1 | ✓ Yes |
| **Total** | **2 real changes** | — | **4 commits** | **2 real, 2 wasted** |

### Table 2: Commits With Content Detection (New Behavior)
| Day | GitHub Updates | AI Analysis | Content Changed? | Commits | Portfolio Deploy |
|-----|---|---|---|---|---|
| Day 1 | Repo A updated | ✓ Yes | ✓ Yes | 1 | ✓ Yes |
| Day 2 | None | ✗ No | ✗ No | 0 | ✗ No |
| Day 3 | None | ✗ No | ✗ No | 0 | ✗ No |
| Day 4 | Repo B updated | ✓ Yes | ✓ Yes | 1 | ✓ Yes |
| **Total** | **2 real changes** | — | **2 changes** | **2 commits** | **2 real, 0 wasted** |

### Table 3: Real-World Example (30 Days)
| Period | Scenario | Old System | New System |
|--------|----------|-----------|-----------|
| Days 1-7 | No repo updates | 7 commits | 1 commit (day 1 only) |
| Days 8-14 | 1 repo updated on day 10 | 7+ commits | 2 commits (days 1 & 10) |
| Days 15-30 | 2 repos updated (days 18, 25) | 16+ commits | 3 commits (days 1, 18, & 25) |
| **Month Total** | **3 actual updates** | **~30 commits** | **6 commits** |

---

## Project Structure

```
Auto update portfolio/
├── index.html                    # Main portfolio webpage
├── README.md                     # This file
├── requirements.txt              # Python dependencies
├── run_local.sh                  # Run local web server
├── run_sync.sh                   # Run sync agent locally
│
├── .github/
│   └── workflows/
│       └── ai_sync.yml          # GitHub Actions workflow (daily auto-run)
│
├── assets/
│   ├── resume.tex               # Your LaTeX resume (manual update)
│   └── images/                  # Portfolio images
│
├── css/
│   ├── style.css                # Core styles
│   ├── animations.css           # Cyberpunk animations
│   └── enhanced.css             # Advanced features
│
├── js/
│   ├── main.js                  # All frontend functionality
│   ├── projects.js              # Project card rendering
│   └── particles.js             # Neural network animation
│
├── data/
│   └── projects.json            # AUTO-GENERATED by sync agent
│
└── scripts/
    └── sync_agent.py            # Main LangGraph AI agent
```

### Key Files Explained

**Frontend Files (HTML/CSS/JS)**
- `index.html` - Main page structure
- `css/` - Styling & animations
- `js/main.js` - All interactivity
- `js/particles.js` - Neural network canvas

**Backend Files (Python)**
- `scripts/sync_agent.py` - AI agent that updates portfolio
- `data/projects.json` - Output file (auto-generated)
- `requirements.txt` - Python dependencies

**Automation Files**
- `.github/workflows/ai_sync.yml` - GitHub Actions (runs every 24h)
- `run_sync.sh` - Manual trigger script
- `run_local.sh` - Local development server

---

## Tech Stack

### Frontend
- **Pure HTML5, CSS3, JavaScript (ES6+)**
- No frameworks - lightweight and blazing fast
- Custom animations (no external libraries)
- Works perfectly on GitHub Pages

### Backend (AI Automation)
- **LangGraph** - Stateful workflow orchestration
- **LangChain** - LLM framework
- **Google Gemini 2.5 Flash** - Primary AI model
- **Groq Llama 3.3** - Fallback AI model
- **GitHub API** - Repository data
- **Python 3.10+** - Scripting language

### DevOps & Deployment
- **GitHub Actions** - CI/CD automation
- **GitHub Pages** - Free static hosting
- **Git** - Version control

---

## Setup & Installation

### Prerequisites
- GitHub account
- Python 3.10+
- Git
- API keys: Google Gemini, Groq, GitHub

### Step 1: Clone Repository

```bash
git clone https://github.com/Thanuja-Bobbepalli/Auto-update-portfolio.git
cd Auto\ update\ portfolio
```

### Step 2: Set Up Python Environment

```bash
# Create virtual environment
python -m venv venv

# Activate it
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables

Create `.env` file in root directory:

```env
GEMINI_API_KEY=your_google_gemini_key_here
GROQ_API_KEY=your_groq_api_key_here
GITHUB_TOKEN=your_github_personal_access_token
```

**How to get API keys:**

1. **Gemini API**: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. **Groq API**: [https://console.groq.com](https://console.groq.com)
3. **GitHub Token**: GitHub Settings → Developer Settings → Personal Access Tokens

### Step 4: Test Locally

```bash
# Run sync agent locally
python scripts/sync_agent.py

# Check generated projects.json
cat data/projects.json

# Start local web server
python -m http.server 8000
# Visit: http://localhost:8000
```

### Step 5: Deploy to GitHub Pages

#### 5a. Create GitHub Repository

1. Go to GitHub → **Create a new repository**
2. Name it: `username.github.io` (replace `username` with your GitHub username)
3. Make it **PUBLIC**
4. ✓ Initialize with empty repo (no README yet)

#### 5b. Push Code

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
git add .
git commit -m "Initial portfolio commit"
git push -u origin main
```

#### 5c. Setup GitHub Secrets for Automation

1. Go to Repository Settings → **Secrets and Variables** → **Actions**
2. Add these secrets:
   - `GEMINI_API_KEY` - Your Google Gemini API key
   - `GROQ_API_KEY` - Your Groq API key
   - `GITHUB_TOKEN` - Already available (auto-provided by GitHub)

#### 5d: Enable GitHub Actions

1. Go to Repository → **Actions** tab
2. Click "I understand my workflows, go ahead and enable them"
3. The workflow will now run:
   - ✓ Every 24 hours (midnight UTC)
   - ✓ On every push to main branch
   - ✓ Manually when you click "Run workflow"

---

## Implementation Guide for New Users

### Want to Create Your Own AI-Powered Portfolio?

#### **Option A: Use This Repository (Recommended)**

1. **Fork this repo** → `https://github.com/Thanuja-Bobbepalli/Auto-update-portfolio`
2. **Clone to your machine**
3. **Follow Setup & Installation** section above
4. **Customize**: Edit `index.html`, change colors in CSS, update your info
5. **Deploy** to GitHub Pages

#### **Option B: Build From Scratch**

If you want to understand each part:

**Part 1: Frontend (30 mins)**
```bash
# Create folder structure
mkdir my-portfolio
cd my-portfolio
touch index.html
mkdir css js data
```

Edit `index.html` - copy/paste from this repo and customize

**Part 2: Backend Setup (1 hour)**
```bash
# Install dependencies
python -m venv venv
source venv/bin/activate
pip install langgraph langchain requests python-dotenv
```

**Part 3: Create Sync Agent (2-3 hours)**
Create `scripts/sync_agent.py` with:
- GitHub API integration
- LLM prompting (Gemini/Groq)
- JSON output to `data/projects.json`
- Error handling & fallbacks

**Part 4: GitHub Actions (30 mins)**
Create `.github/workflows/sync.yml` with:
- Cron schedule (every 24h)
- Python environment setup
- Install dependencies
- Run sync agent
- Auto-commit logic

**Part 5: Deploy (15 mins)**
- Push to `username.github.io` repo
- Enable GitHub Pages
- Add API secrets to GitHub
- Test!

---

## Customization

### Change Portfolio Details

**Edit `index.html`:**
```html
<h1>YOUR NAME HERE</h1>
<p>Your job title / tagline</p>
<a href="mailto:your.email@example.com">Contact</a>
```

### Change Colors/Theme

**Edit `css/style.css`:**
```css
:root {
  --primary-color: #00ff41;     /* Change from neon green */
  --secondary-color: #ff0080;   /* Change from pink */
  --background: #0a0a0a;        /* Change from black */
}
```

### Customize LLM Prompt

**Edit `scripts/sync_agent.py` line ~120:**
```python
prompt = f"""
Your custom prompt here...
Analyze this GitHub repository:
{repo_details}

Return JSON with:
- title
- description
- category
- tech
- featured
"""
```

### Change Sync Schedule

**Edit `.github/workflows/ai_sync.yml` line 5:**
```yaml
schedule:
  - cron: '0 0 * * *'    # Daily at midnight
  # - cron: '0 */12 * * *'  # Every 12 hours
  # - cron: '0 0 * * MON'   # Every Monday
```

---

## Monitoring & Troubleshooting

### Check GitHub Actions Status

1. Go to Repository → **Actions** tab
2. Click on the latest workflow run
3. See logs for each step

### Common Issues

#### ✗ "API Key Invalid"
- **Fix**: Make sure secrets are added to GitHub (Settings → Secrets)
- **Verify**: `GEMINI_API_KEY`, `GROQ_API_KEY` are correct

#### ✗ "No changes committed"
- **Expected**: If no GitHub repos changed, workflow runs but doesn't commit
- **Check**: Look at GitHub API response in logs

#### ✗ "Gemini fails, Groq fails"
- **Fix**: Check both API keys are valid
- **Fallback**: Currently uses Groq only; can add more LLMs

#### ✗ "projects.json not updating"
- **Debug**: Run locally: `python scripts/sync_agent.py`
- **Check**: Look for error messages in console
- **Verify**: `.env` file has all required API keys

### Debug Locally

```bash
# Activate environment
source venv/bin/activate  # or: venv\Scripts\activate

# Run with verbose output
python -u scripts/sync_agent.py

# Check projects.json was created
cat data/projects.json

# Verify format is valid JSON
python -m json.tool data/projects.json
```

---

## File Details

### `projects.json` Format

```json
[
  {
    "title": "Project Name",
    "description": "AI-generated description",
    "category": ["ai-agents", "web-dev"],
    "tech": ["Python", "LangGraph", "Streamlit"],
    "github": "https://github.com/user/repo",
    "featured": true,
    "last_updated": "2026-03-26T10:00:00Z"
  }
]
```

### GitHub Actions Workflow

- **Triggers**: Every 24h + manual + on push
- **Runs on**: Ubuntu latest
- **Steps**:
  1. Checkout code
  2. Setup Python 3.10
  3. Install dependencies
  4. Run sync_agent.py
  5. Auto-commit if changes exist

---

## Next Steps

1. ✓ Clone/Fork repository
2. ✓ Get API keys (Gemini, Groq)
3. ✓ Set up locally and test
4. ✓ Deploy to GitHub Pages
5. ✓ Add GitHub Secrets
6. ✓ Watch it auto-update your portfolio!

---

## Support

- **Issues**: Check GitHub Issues
- **Questions**: Create GitHub Discussion
- **Email**: thanuja@example.com

---

## License

This project is open source and available under the MIT License.

---

Made by Thanuja Bobbepalli | Last Updated: March 29, 2026

### Step 3: Enable GitHub Pages

1. Go to repository **Settings**
2. Click **Pages** in the left sidebar
3. Under "Source", select **main** branch
4. Save

Your portfolio will be live at: `https://harish-lvrk.github.io`

## 🎨 Customization

### Colors
Edit CSS variables in `css/style.css`:

```css
:root {
    --primary: #00ff88;      /* Main accent color */
    --secondary: #00d4ff;    /* Secondary accent */
    --accent: #ff006e;       /* Highlight color */
    --bg-primary: #0a0a0f;   /* Background */
}
```

### Content
Update your information directly in `index.html`

### Adding Projects
Copy the project card template and update:

```html
<div class="project-card">
    <div class="project-header">
        <div class="project-icon">
            <i class="fas fa-icon-name"></i>
        </div>
        <div class="project-links">
            <a href="github-url" target="_blank" class="project-link">
                <i class="fab fa-github"></i>
            </a>
        </div>
    </div>
    <h3 class="project-title">Project Name</h3>
    <p class="project-description">Description...</p>
    <div class="project-tech">
        <span class="tech">Tech1</span>
        <span class="tech">Tech2</span>
    </div>
</div>
```

## 🎯 Easter Eggs

1. **Interactive Terminal**: Press `Ctrl+\`` to open a hidden terminal
   - Try commands: `help`, `whoami`, `skills`, `sudo hire`
2. **Console Message**: Open browser DevTools to see ASCII art
3. **Cursor Glow**: Mouse creates a subtle glow effect

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📝 License

MIT License - Feel free to use and modify!

---

**Built with 💚 by THANUJA BOBBEPALLI**

