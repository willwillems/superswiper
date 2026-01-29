#!/usr/bin/env bash
set -euo pipefail

echo "Starting Loop..."
echo ""

iteration=0
while true; do
   iteration=$((iteration + 1))
   echo "=== Iteration $iteration starting ==="
   
   prompt=$(cat prompt.md)
   
   echo "Calling claude..."
   exit_code=0
   claude -p "$prompt" --dangerously-skip-permissions || exit_code=$?
   echo "Claude exited with code: $exit_code"
   
   echo "=== Iteration $iteration complete ==="
   echo ""
   
   sleep 1
done
echo "Loop Ended"