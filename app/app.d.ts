type DirectionType = "up" | "down" | "left" | "right";

interface Game {
  score: number;
  date: Date;
  time: number;
}

interface Player {
  name: string;
  games: Game[];
  highScore: number;
  date?: Date;
}
