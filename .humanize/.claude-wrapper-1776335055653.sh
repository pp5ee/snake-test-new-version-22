#!/bin/sh
cd '/app/workspaces/7408367a-2b20-40f2-b970-7bc1d4e49730' || exit 1
exec 'claude' '--dangerously-skip-permissions' '--print' '/humanize:start-rlcr-loop docs/plan.md --max 10 --yolo --codex-model gpt-5.4:high --full-review-round 5 --track-plan-file --agent-teams --push-every-round'
