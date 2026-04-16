Read and execute below with ultrathink

## Goal Tracker Setup (REQUIRED FIRST STEP)

Before starting implementation, you MUST initialize the Goal Tracker:

1. Read @/app/workspaces/7408367a-2b20-40f2-b970-7bc1d4e49730/.humanize/rlcr/2026-04-16_18-25-11/goal-tracker.md
2. If the "Ultimate Goal" section says "[To be extracted...]", extract a clear goal statement from the plan
3. If the "Acceptance Criteria" section says "[To be defined...]", define 3-7 specific, testable criteria
4. Populate the "Active Tasks" table with tasks from the plan, mapping each to an AC and filling Tag/Owner
5. Write the updated goal-tracker.md

**IMPORTANT**: The IMMUTABLE SECTION can only be modified in Round 0. After this round, it becomes read-only.

---

## Implementation Plan

For all tasks that need to be completed, please use the Task system (TaskCreate, TaskUpdate, TaskList) to track each item in order of importance.
You are strictly prohibited from only addressing the most important issues - you MUST create Tasks for ALL discovered issues and attempt to resolve each one.

## Task Tag Routing (MUST FOLLOW)

Each task must have one routing tag from the plan: `coding` or `analyze`.

- Tag `coding`: Claude executes the task directly.
- Tag `analyze`: Claude must execute via `/humanize:ask-codex`, then integrate Codex output.
- Keep Goal Tracker "Active Tasks" columns **Tag** and **Owner** aligned with execution (`coding -> claude`, `analyze -> codex`).
- If a task has no explicit tag, default to `coding` (Claude executes directly).

# React Cyberpunk Snake Game

## Goal Description

Create a high-end, visually striking Snake game using React (frontend-only) with the following features:
- 30x30 grid-based gameplay with cyberpunk/neon aesthetic
- Player snake that can eat smaller enemy snakes to grow and gain points
- Enemy snakes (3-8) that move randomly and can kill the player if larger
- Local score persistence using browser storage with Top 10 leaderboard and full match history
- Snake type selection on the left panel
- Pause/Start/Restart controls
- Dynamic visual effects (glow, particles, animated backgrounds)
- Simple, maintainable code structure

## Acceptance Criteria

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

## Path Boundaries

Path boundaries define the acceptable range of implementation quality and choices.

### Upper Bound (Maximum Acceptable Scope)

The implementation includes:
- React + Vite project setup with complete development environment
- 30x30 grid game board with CSS-based cyberpunk styling (neon glow, dark theme, animated backgrounds)
- Player snake with 3+ selectable types (different visual appearances)
- 3-8 enemy snakes with random movement AI
- Full combat system (eat smaller = grow/score, hit larger = die)
- Pause/Start/Restart controls
- Local storage persistence for scores with Top 10 leaderboard AND full match history view
- Dynamic visual effects (glow, particles, smooth animations)
- Complete README.md with all required sections
- All code committed with `feat:` prefix

### Lower Bound (Minimum Acceptable Scope)

The implementation includes at minimum:
- React + Vite project that builds and runs
- 30x30 grid game board with basic cyberpunk styling
- Player snake with at least 2 selectable types
- 3 enemy snakes with simple random movement
- Basic combat (eat smaller, die to larger)
- Working pause/start controls
- Local storage for scores (at least Top 10)
- Basic visual effects
- README.md with required sections

### Allowed Choices

- Can use: React 18+, Vite, CSS Modules or styled-components for styling, localStorage for persistence
- Cannot use: Backend servers, external databases, real-time multiplayer
- Rendering approach: CSS grid preferred for simplicity; Canvas acceptable if effects need it
- Snake size comparison: By body segment count (most intuitive)

## Feasibility Hints and Suggestions

> **Note**: This section is for reference and understanding only. These are conceptual suggestions, not prescriptive requirements.

### Conceptual Approach

The recommended implementation approach:

1. **Project Setup**: Use React + Vite for fast development and simple build
2. **State Management**: Use React useReducer or useState for game state (player position, enemies, score, game status)
3. **Game Loop**: Use setInterval with configurable tick rate (~100-150ms per tick)
4. **Rendering**: CSS Grid for the 30x30 board; each cell is a div with conditional classes for snake/food
5. **Persistence**: localStorage with structured JSON (version, scores array, history array)
6. **Styling**: CSS with custom properties for cyberpunk theme (neon colors, glow effects)

```
Game State Structure:
{
  player: { position: [x,y][], direction: 'up', type: 'cyber' },
  enemies: [{ id, position, direction, type, length }],
  food: { position: [x,y] },  // optional if combat-only growth
  score: number,
  gameStatus: 'idle' | 'playing' | 'paused' | 'gameover',
  leaderboard: { top10: Score[], history: Score[] }
}
```

### Relevant References

- React useState/useReducer for game state management
- localStorage API for score persistence
- CSS Grid for board rendering
- Keyboard events for player input handling

### Implementation Priority

1. **Phase 1**: Project scaffolding, basic board rendering
2. **Phase 2**: Player movement and controls
3. **Phase 3**: Enemy snakes and basic AI
4. **Phase 4**: Combat system (eat/die logic)
5. **Phase 5**: Score persistence and leaderboard
6. **Phase 6**: Visual polish (cyberpunk effects)
7. **Phase 7**: README and final polish

## Dependencies and Sequence

### Milestones

1. **Project Foundation**: Set up React + Vite project with basic structure and dependencies
   - Phase A: Initialize project, configure build tools
   - Phase B: Create base components (Game, Board, Snake, Controls)

2. **Core Game Engine**: Implement game loop, player movement, and collision detection
   - Phase A: Game state management and tick loop
   - Phase B: Player controls and movement logic

3. **Enemy System**: Add enemy snakes with AI movement
   - Phase A: Enemy spawning and random movement
   - Phase B: Enemy collision and interaction with player

4. **Combat & Scoring**: Implement snake combat rules and score system
   - Phase A: Size comparison logic (eat smaller, die to larger)
   - Phase B: Score calculation and display

5. **Persistence Layer**: Add localStorage for scores and leaderboard
   - Phase A: Score saving and loading
   - Phase B: Top 10 and history display

6. **Visual Polish**: Apply cyberpunk styling and dynamic effects
   - Phase A: CSS theming (neon, glow, dark theme)
   - Phase B: Animations and particle effects

7. **Delivery**: README and commit history
   - Phase A: Write comprehensive README
   - Phase B: Review and commit with proper prefixes

### Dependencies

- Player movement depends on game loop implementation
- Combat system depends on both player and enemy movement
- Leaderboard depends on score system
- Visual effects depend on base game rendering

## Task Breakdown

Each task must include exactly one routing tag:
- `coding`: implemented by Claude
- `analyze`: executed via Codex (`/humanize:ask-codex`)

| Task ID | Description | Target AC | Tag (`coding`/`analyze`) | Depends On |
|---------|-------------|-----------|----------------------------|------------|
| task1 | Set up React + Vite project with dependencies | AC-1 | coding | - |
| task2 | Create game board component (30x30 grid) | AC-2 | coding | task1 |
| task3 | Implement player snake rendering and movement | AC-3 | coding | task2 |
| task4 | Add snake type selection panel | AC-4 | coding | task2 |
| task5 | Implement pause/start/restart controls | AC-5 | coding | task3 |
| task6 | Create enemy snake system with random movement | AC-7 | coding | task2 |
| task7 | Implement combat system (eat smaller, die to larger) | AC-6 | coding | task6 |
| task8 | Add scoring system with point calculation | AC-8 | coding | task7 |
| task9 | Implement localStorage persistence and leaderboard | AC-9 | coding | task8 |
| task10 | Apply cyberpunk visual styling and effects | AC-10 | coding | task9 |
| task11 | Write comprehensive README.md | AC-11 | coding | task10 |
| task12 | Review code quality and verify all ACs | AC-1 to AC-11 | analyze | task11 |

## Claude-Codex Deliberation

### Agreements

- **React-only frontend**: Both agree this should be a React project with no backend
- **30x30 grid**: Confirmed as the game board size from the draft
- **3-8 enemies**: Enemy count range is correct per draft specification
- **Top 10 leaderboard**: Required per draft, plus full history for better UX
- **Cyberpunk aesthetic**: Visual style should include neon/glow effects
- **localStorage persistence**: Correct approach for browser-only score storage
- **Conventional commits**: `feat:` prefix required per draft

### Resolved Disagreements

- **Combat rules**: Codex raised ambiguity about what defines "smaller/larger". Resolved to use body segment count as it's most intuitive for players
- **Food vs combat-only growth**: Codex asked if there should be food pellets. Resolved to combat-only (eat enemies to grow) per the draft's emphasis on snake-vs-snake combat
- **Enemy AI complexity**: Codex noted random movement could look broken. Resolved to simple random movement with basic wall avoidance

### Convergence Status

- Final Status: `partially_converged` (direct mode - no convergence loop, human review pending)

### Notes from Codex Analysis

**CORE_RISKS identified**:
- Enemy AI complexity could exceed "simple code" goal
- Performance on 30x30 with effects and 8 enemies
- Combat rule ambiguity (resolved to body length)

**MISSING_REQUIREMENTS** (addressed in plan):
- Win/lose conditions: endless survival mode
- Scoring formula: points = enemy length consumed
- Snake comparison: by body segment count
- Equal size collision: player dies

**QUESTIONS_FOR_USER** (see Pending User Decisions)

## Pending User Decisions

- DEC-1: Snake size comparison method
  - Claude Position: Use body segment count (most intuitive for players)
  - Codex Position: Suggested hybrid (length + score)
  - Tradeoff Summary: Body length is simpler to understand visually; score changes during game making it confusing
  - Decision Status: `PENDING` - using body length as default

- DEC-2: Equal size collision behavior
  - Claude Position: Player dies when colliding with equal-sized enemy (conservative, clear)
  - Codex Position: Suggested both survive option
  - Tradeoff Summary: Player dying on equal collision is more challenging but clearer rule
  - Decision Status: `PENDING` - using "player dies" as default

- DEC-3: Enemy-to-enemy eating
  - Claude Position: Only player can eat enemies, enemies cannot eat each other
  - Codex Position: Suggested option for all can eat
  - Tradeoff Summary: Simplifies AI and reduces confusion; enemies only kill player
  - Decision Status: `PENDING` - using "player only" as default

- DEC-4: Board boundary behavior
  - Claude Position: Solid walls (snake dies on wall collision)
  - Codex Position: No specific preference
  - Tradeoff Summary: Classic arcade style, easier to understand than wrap-around
  - Decision Status: `PENDING` - using solid walls as default

- DEC-5: Growth mechanism
  - Claude Position: Combat-only (eat enemies to grow)
  - Codex Position: Suggested both food and combat
  - Tradeoff Summary: Aligns with draft emphasis on snake-vs-snake combat
  - Decision Status: `PENDING` - using combat-only as default

- DEC-6: Score history scope
  - Claude Position: Top 10 + full match history
  - Codex Position: Suggested top 10 only as MVP
  - Tradeoff Summary: Full history adds value per draft "可以看到自己的分数记录历史记录"
  - Decision Status: `PENDING` - using both as default

- DEC-7: Mobile support
  - Claude Position: Desktop-only for now (keyboard controls)
  - Codex Position: Suggested mobile support consideration
  - Tradeoff Summary: Snake games work best with keyboard; mobile adds complexity
  - Decision Status: `PENDING` - desktop-only as default

## Implementation Notes

### Code Style Requirements
- Implementation code and comments must NOT contain plan-specific terminology such as "AC-", "Milestone", "Step", "Phase", or similar workflow markers
- These terms are for plan documentation only, not for the resulting codebase
- Use descriptive, domain-appropriate naming in code instead

## Output File Convention

This template is used to produce the main output file (e.g., `plan.md`).

### Translated Language Variant

When `alternative_plan_language` resolves to a supported language name through merged config loading, a translated variant of the output file is also written after the main file. Humanize loads config from merged layers in this order: default config, optional user config, then optional project config; `alternative_plan_language` may be set at any of those layers. The variant filename is constructed by inserting `_<code>` (the ISO 639-1 code from the built-in mapping table) immediately before the file extension:

- `plan.md` becomes `plan_<code>.md` (e.g. `plan_zh.md` for Chinese, `plan_ko.md` for Korean)
- `docs/my-plan.md` becomes `docs/my-plan_<code>.md`
- `output` (no extension) becomes `output_<code>`

The translated variant file contains a full translation of the main plan file's current content in the configured language. All identifiers (`AC-*`, task IDs, file paths, API names, command flags) remain unchanged, as they are language-neutral.

When `alternative_plan_language` is empty, absent, set to `"English"`, or set to an unsupported language, no translated variant is written. Humanize does not auto-create `.humanize/config.json` when no project config file is present.

--- Original Design Draft Start ---

# Requirement

现在我想写一个贪吃蛇的游戏，页面要高端一些，代码尽量简单，支持分数记录（页面本地），下一次打开还能看到自己的分数记录历史记录；需要多一些动态效果，贪吃蛇左侧可以选择蛇的类型；支持暂停，开始，支持吃其他蛇，如果比自己大就死亡，如果比自己小就获得分数；只需要前端即可，没有后端；使用react

现在我想写一个贪吃蛇的游戏，页面要高端一些，代码尽量简单，支持分数记录（页面本地），下一次打开还能看到自己的分数记录历史记录；需要多一些动态效果，贪吃蛇左侧可以选择蛇的类型；支持暂停，开始，支持吃其他蛇，如果比自己大就死亡，如果比自己小就获得分数；只需要前端即可，没有后端；使用react

外观不同，随机游走 数量随机，赛博朋克，固定格

30x30， 3-8 ， Top 10

---

## Standard Deliverables (mandatory for every project)

- **README.md** — must be included at the project root with: project title & description, prerequisites, installation steps, usage examples with code snippets, configuration options, and project structure overview.
- **Git commits** — use conventional commit prefix `feat:` for all commits.

--- Original Design Draft End ---

---

## BitLesson Selection (REQUIRED FOR EACH TASK)

Before executing each task or sub-task, you MUST:

1. Read @/app/workspaces/7408367a-2b20-40f2-b970-7bc1d4e49730/.humanize/bitlesson.md
2. Run `bitlesson-selector` for each task/sub-task to select relevant lesson IDs
3. Follow the selected lesson IDs (or `NONE`) during implementation

Include a `## BitLesson Delta` section in your summary with:
- Action: none|add|update
- Lesson ID(s): NONE or comma-separated IDs
- Notes: what changed and why (required if action is add or update)

Reference: @/app/workspaces/7408367a-2b20-40f2-b970-7bc1d4e49730/.humanize/bitlesson.md

## Agent Teams Mode

You are operating in **Agent Teams mode** as the **Team Leader** within an RLCR (Review-Loop-Correct-Repeat) development cycle.

This is the initial round. Read the implementation plan thoroughly before creating your team. Key RLCR files to be aware of:
- **Plan file** (provided above): The full scope of work and requirements your team must implement
- **Goal tracker** (`goal-tracker.md`): Tracks acceptance criteria, task status, and plan evolution - read it before splitting tasks
- **Work summary**: After all teammates finish, you must write a summary of what was accomplished into the designated summary file

### Your Role

You are the team leader. Your ONLY job is coordination and delegation. You must NEVER write code, edit files, or implement anything yourself.

Your primary responsibilities are:
- **Split tasks** into independent, parallelizable units of work
- **Create agent teams** to execute these tasks using the Task tool with `team_name` parameter
- **Coordinate** team members to prevent overlapping or conflicting changes
- **Monitor progress** and resolve blocking issues between team members
- **Wait for teammates** to finish their work before proceeding - do not implement tasks yourself while waiting

If you feel the urge to implement something directly, STOP and delegate it to a team member instead.

### Guidelines

1. **Task Splitting**: Break work into independent tasks that can be worked on in parallel without file conflicts. Each task should have clear scope and acceptance criteria. Aim for 5-6 tasks per teammate to keep everyone productive and allow reassignment if someone gets stuck.
2. **Cold Start**: Every team member starts with zero prior context (they do NOT inherit your conversation history). However, they DO automatically load project-level CLAUDE.md files and MCP servers. When spawning members, focus on providing: the implementation plan or relevant goals, specific file paths they need to work on, what has been done so far, and what exactly needs to be accomplished. Do not repeat what CLAUDE.md already covers.
3. **File Conflict Prevention**: Two teammates editing the same file causes silent overwrites, not merge conflicts - one teammate's work will be completely lost. Assign strict file ownership boundaries. If two tasks must touch the same file, sequence them with task dependencies (blockedBy) so they never run in parallel.
4. **Coordination**: Track team member progress via TaskList and resolve any discovered dependencies. If a member is blocked or stuck, help unblock them or reassign the work to another member.
5. **Quality**: Review team member output before considering tasks complete. Verify that changes are correct, do not conflict with other members' work, and meet the acceptance criteria.
6. **Commits**: Each team member should commit their own changes. You coordinate the overall commit strategy and ensure all commits are properly sequenced.
7. **Plan Approval**: For high-risk or architecturally significant tasks, consider requiring teammates to plan before implementing (using plan mode). Review and approve their plans before they proceed.
8. **BitLesson Discipline**: Require running `bitlesson-selector` before each sub-task and record selected lesson IDs (or `NONE`) in the work notes.

### Important

- Use the Task tool to spawn agents as team members
- Monitor team members and reassign work if they get stuck
- Merge team work and resolve any conflicts before writing your summary
- Do NOT write code yourself - if you catch yourself about to edit a file or run implementation commands, delegate it instead
- When teammates go idle after sending you a message, this is NORMAL - they are waiting for your response, not done forever

---

## Goal Tracker Rules

Throughout your work, you MUST maintain the Goal Tracker:

1. **Before starting a task**: Mark it as "in_progress" in Active Tasks
   - Confirm Tag/Owner routing is correct before execution
2. **After completing a task**: Move it to "Completed and Verified" with evidence (but mark as "pending verification")
3. **If you discover the plan has errors**:
   - Do NOT silently change direction
   - Add entry to "Plan Evolution Log" with justification
   - Explain how the change still serves the Ultimate Goal
4. **If you need to defer a task**:
   - Move it to "Explicitly Deferred" section
   - Provide strong justification
   - Explain impact on Acceptance Criteria
5. **If you discover new issues**: Add to "Open Issues" table

---

Note: You MUST NOT try to exit `start-rlcr-loop` loop by lying or edit loop state file or try to execute `cancel-rlcr-loop`

After completing the work, please:
0. If you have access to the `code-simplifier` agent, use it to review and optimize the code you just wrote
1. Finalize @/app/workspaces/7408367a-2b20-40f2-b970-7bc1d4e49730/.humanize/rlcr/2026-04-16_18-25-11/goal-tracker.md (this is Round 0, so you are initializing it - see "Goal Tracker Setup" above)
2. Commit your changes with a descriptive commit message
3. Write your work summary into @/app/workspaces/7408367a-2b20-40f2-b970-7bc1d4e49730/.humanize/rlcr/2026-04-16_18-25-11/round-0-summary.md

Note: Since `--push-every-round` is enabled, you must push your commits to remote after each round.
