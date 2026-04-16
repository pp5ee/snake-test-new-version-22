# Cyberpunk Snake

A high-end, visually striking Snake game built with React featuring cyberpunk/neon aesthetics, snake combat mechanics, and local score persistence.

## Features

- **30x30 Grid Gameplay**: Classic snake game on an expanded grid
- **Snake Combat System**: Eat smaller snakes to grow and gain points, die when hitting larger snakes
- **Enemy AI**: 3-8 enemy snakes with random movement patterns
- **Multiple Snake Types**: Choose from 4 unique snake designs (Cyber, Neon, Plasma, Quantum)
- **Score Persistence**: Local storage with Top 10 leaderboard and full match history
- **Cyberpunk Aesthetic**: Neon glow effects, dark theme, and dynamic animations
- **Game Controls**: Pause, Resume, and Restart functionality

## Prerequisites

- Node.js 18+ 
- npm 9+

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd cyberpunk-snake

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

### Controls
- **Arrow Keys**: Move the snake
- **Space / P**: Pause/Resume the game

### Gameplay
1. Select your snake type from the left panel
2. Click "START GAME" to begin
3. Use arrow keys to control your snake
4. Eat smaller snakes (green outline) to grow and score points
5. Avoid larger snakes (red outline) or you will die
6. Check the leaderboard to see your top scores

## Project Structure

```
cyberpunk-snake/
├── src/
│   ├── components/
│   │   ├── GameBoard.jsx    # 30x30 grid rendering
│   │   ├── GameBoard.css
│   │   ├── SidePanel.jsx    # Controls and snake selection
│   │   ├── SidePanel.css
│   │   ├── Leaderboard.jsx  # Score display modal
│   │   └── Leaderboard.css
│   ├── App.jsx              # Main game logic
│   ├── App.css
│   ├── index.css            # Global styles
│   └── main.jsx             # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Configuration

The game uses the following constants (configurable in App.jsx):

- **GRID_SIZE**: 30x30 cells
- **TICK_RATE**: 120ms per game tick
- **SNAKE_TYPES**: 4 visual variants with unique color schemes

## Technical Details

- **Framework**: React 18 with Vite
- **State Management**: React useState/useReducer
- **Persistence**: Browser localStorage
- **Styling**: CSS with CSS custom properties for theming

## License

MIT