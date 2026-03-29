#!/bin/bash
# run_sync.sh
echo "Starting portfolio sync..."

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Run the sync agent
python3 scripts/sync_agent.py

echo "Sync complete!"
