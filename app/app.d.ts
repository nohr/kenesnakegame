type DirectionType = "up" | "down" | "left" | "right";

interface Game {
  player: Player;
  snake: { x: number; y: number }[];
  score: number;
  started: boolean;
  paused: boolean;
  direction: DirectionType;
  gameOver: boolean;
  date: Date;
  time: number;
}

interface Player {
  name: string;
  games: Game[];
  highScore: number;
  date?: Date;
}
