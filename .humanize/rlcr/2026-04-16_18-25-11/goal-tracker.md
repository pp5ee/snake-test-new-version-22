# Goal Tracker

<!--
This file tracks the ultimate goal, acceptance criteria, and plan evolution.
It prevents goal drift by maintaining a persistent anchor across all rounds.

RULES:
- IMMUTABLE SECTION: Do not modify after initialization
- MUTABLE SECTION: Update each round, but document all changes
- Every task must be in one of: Active, Completed, or Deferred
- Deferred items require explicit justification
-->

## IMMUTABLE SECTION
<!-- Do not modify after initialization -->

### Ultimate Goal

Create a high-end, visually striking Snake game using React (frontend-only) with the following features:
- 30x30 grid-based gameplay with cyberpunk/neon aesthetic
- Player snake that can eat smaller enemy snakes to grow and gain points
- Enemy snakes (3-8) that move randomly and can kill the player if larger
- Local score persistence using browser storage with Top 10 leaderboard and full match history
- Snake type selection on the left panel
- Pause/Start/Restart controls
- Dynamic visual effects (glow, particles, animated backgrounds)
- Simple, maintainable code structure

### Acceptance Criteria
<!-- Each criterion must be independently verifiable -->
<!-- Claude must extract or define these in Round 0 -->


Following TDD philosophy, each criterion includes positive and negative tests for deterministic verification.

- AC-1: Project Setup
  - Positive Tests (expected to PASS):
    - React project builds without errors using Vite
    - Application starts with `npm run dev` and displays in browser
    - README.md exists at project root with all required sections
  - Negative Tests (expected to FAIL):
    - Build fails due to missing dependencies
    - Application crashes on startup due to missing configuration

- AC-2: Game Board Rendering
  - Positive Tests (expected to PASS):
    - 30x30 grid renders correctly on screen
    - Player snake displays with selected snake type appearance
    - 3-8 enemy snakes spawn at game start on valid positions
  - Negative Tests:
    - Grid renders with wrong dimensions (not 30x30)
    - Snakes overlap or spawn outside valid positions

- AC-3: Player Movement and Controls
  - Positive Tests (expected to PASS):
    - Arrow keys move player snake in corresponding direction
    - Snake cannot reverse direction (e.g., cannot go down when moving up)
    - Game responds to keyboard input within 100ms
  - Negative Tests:
    - Snake reverses into itself on quick key presses
    - Movement lags or ignores input

- AC-4: Snake Type Selection
  - Positive Tests (expected to PASS):
    - Left panel displays available snake type options
    - Selecting a different snake type changes player appearance
    - Snake type selection is available before game starts
  - Negative Tests:
    - Selection panel is not visible
    - Changing type during game causes visual glitches

- AC-5: Pause/Start/Restart Functionality
  - Positive Tests (expected to PASS):
    - Pause button freezes all game movement
    - Resume continues game from exact paused state
    - Restart resets game to initial state with new game
  - Negative Tests:
    - Pause does not freeze enemy movement
    - Resume does not restore exact game state

- AC-6: Snake Combat System
  - Positive Tests (expected to PASS):
    - Player eating smaller snake (by body length) increases score and grows
    - Player dies when colliding with larger snake
    - Eating smaller snake removes that enemy from board
  - Negative Tests:
    - Player dies when eating smaller snake
    - Larger snake does not kill player on contact

- AC-7: Enemy Snake Behavior
  - Positive Tests (expected to PASS):
    - Enemy snakes move randomly but avoid immediate death
    - 3-8 enemies present at game start
    - Enemies do not spawn on player or other enemy positions
  - Negative Tests:
    - Enemies move in predictable patterns
    - Enemy count outside 3-8 range

- AC-8: Scoring System
  - Positive Tests (expected to PASS):
    - Score increases when eating smaller enemy
    - Score formula: points equal to enemy length consumed
    - Score displays in real-time during gameplay
  - Negative Tests:
    - Score does not increase after eating enemy
    - Score calculation is incorrect

- AC-9: Persistence and Leaderboard
  - Positive Tests (expected to PASS):
    - Scores persist in localStorage after game over
    - Top 10 scores display correctly on leaderboard
    - Full match history is viewable after page refresh
  - Negative Tests:
    - Scores disappear after closing browser
    - Leaderboard shows incorrect or duplicate entries

- AC-10: Visual Design
  - Positive Tests (expected to PASS):
    - Cyberpunk/neon aesthetic is visible (glow effects, dark theme)
    - Dynamic effects (animations, particles) are present
    - Game is visually "high-end" as specified in draft
  - Negative Tests:
    - Design appears plain or generic
    - Effects cause performance issues (frame drops)

- AC-11: Git Commits
  - Positive Tests (expected to PASS):
    - All commits use conventional prefix `feat:`
    - Commit messages describe the changes made
  - Negative Tests:
    - Commits lack proper prefix
    - No commit history present

---

## MUTABLE SECTION
<!-- Update each round with justification for changes -->

### Plan Version: 1 (Updated: Round 0)

#### Plan Evolution Log
<!-- Document any changes to the plan with justification -->
| Round | Change | Reason | Impact on AC |
|-------|--------|--------|--------------|
| 0 | Initial plan | - | - |

#### Active Tasks
<!-- Map each task to its target Acceptance Criterion and routing tag -->
| Task | Target AC | Status | Tag | Owner | Notes |
|------|-----------|--------|-----|-------|-------|
| task1: Set up React + Vite project with dependencies | AC-1 | pending | coding | claude | - |
| task2: Create game board component (30x30 grid) | AC-2 | pending | coding | claude | - |
| task3: Implement player snake rendering and movement | AC-3 | pending | coding | claude | - |
| task4: Add snake type selection panel | AC-4 | pending | coding | claude | - |
| task5: Implement pause/start/restart controls | AC-5 | pending | coding | claude | - |
| task6: Create enemy snake system with random movement | AC-7 | pending | coding | claude | - |
| task7: Implement combat system (eat smaller, die to larger) | AC-6 | pending | coding | claude | - |
| task8: Add scoring system with point calculation | AC-8 | pending | coding | claude | - |
| task9: Implement localStorage persistence and leaderboard | AC-9 | pending | coding | claude | - |
| task10: Apply cyberpunk visual styling and effects | AC-10 | pending | coding | claude | - |
| task11: Write comprehensive README.md | AC-11 | pending | coding | claude | - |
| task12: Review code quality and verify all ACs | All ACs | pending | analyze | codex | - |

### Completed and Verified
<!-- Only move tasks here after Codex verification -->
| AC | Task | Completed Round | Verified Round | Evidence |
|----|------|-----------------|----------------|----------|

### Explicitly Deferred
<!-- Items here require strong justification -->
| Task | Original AC | Deferred Since | Justification | When to Reconsider |
|------|-------------|----------------|---------------|-------------------|

### Open Issues
<!-- Issues discovered during implementation -->
| Issue | Discovered Round | Blocking AC | Resolution Path |
|-------|-----------------|-------------|-----------------|
| Missing deterministic tests or validation harness for TDD-style acceptance criteria | 1 | AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, AC-8, AC-9 | Extract pure game logic into testable helpers, add automated tests for spawn validity/combat/direction rules, and record passing evidence |
