import { useEffect, useRef, useState } from "react";
import { newGame, player, state, useLocalStorage, useTimer } from "./utils";

const SnakeSegment: ({ x, y }: { x: number; y: number }) => JSX.Element = ({
  x,
  y,
}) => <div className="absolute w-2 h-2 bg-white" style={{ left: x, top: y }} />;

const GameOver: () => JSX.Element = () => {
  const { highScore, games } = player;
  const { set } = useLocalStorage();

  useEffect(() => {
    const current_score = state.score;

    if (current_score > highScore) {
      player.highScore = current_score;
    }
    player.games.push({
      score: current_score,
      date: new Date(),
      time: state.time,
    });
  }, [games, highScore]);

  useEffect(() => {
    if (state.gameOver) {
      set(player.name, player);
      console.log(player);
    }
  }, [set]);

  return (
    <div className="text-white text-2xl font-bold absolute text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <span className="text-3xl"> Game Over</span>
      <br /> Score: {state.score} <br /> Time: {state.time}
      <br />
      <button
        className="bg-transparent border-b border-white text-center text-2xl outline-none"
        onClick={newGame}
      >
        Play Again
      </button>
    </div>
  );
};

const Score: ({
  score,
  highScore,
}: {
  score: number;
  highScore: number;
}) => JSX.Element = ({ score, highScore }) => (
  <div className="text-white absolute top-0 right-0 m-4">
    {` Score: ${score}${player.name ? ` | High Score: ${highScore}` : ""}`}
  </div>
);

const PlayerName: () => JSX.Element = () => (
  <>
    {player.name && (
      <div className="text-white absolute top-0 left-0 m-4">
        Player: {player.name}
      </div>
    )}
  </>
);

const Time = () => {
  const { started, paused, gameOver } = state;
  const time = useTimer(started, paused, gameOver);

  return (
    <>
      {started && !gameOver && (
        <div className="text-white absolute top-4 left-0 m-4">
          {` Time: ${time}`}
        </div>
      )}
    </>
  );
};

const Paused: () => JSX.Element = () => (
  <div className="text-white text-2xl z-50 font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    Paused
  </div>
);

const Start: () => JSX.Element = () => {
  const [name, setName] = useState<string>("");
  const { get, set } = useLocalStorage();
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.current) {
      input.current.focus();
    }
  }, []);

  return (
    <div className="text-white text-2xl z-50 font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      {player.name ? `Let's go ${player.name}` : ` Enter your name to Start`}
      {!player.name && (
        <form
          className="flex flex-col items-center justify-center"
          onSubmit={(e) => {
            e.preventDefault();
            console.log(get(name));

            if (get(name).length > 0) {
              const current_player = JSON.parse(get(name));
              console.log("player exists, logging in...", current_player);
              player.name = name;
              player.games = current_player.games;
              player.highScore = current_player.highScore;
            } else {
              console.log("player does not exist, signing up...");
              player.name = name;
              set(name, player);
            }
            player.name = name;
            state.started = true;
          }}
        >
          <input
            ref={input}
            className="bg-transparent border-b border-white text-center text-2xl outline-none"
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="bg-transparent border-b border-white text-center text-2xl outline-none"
            type="submit"
          >
            Start
          </button>
        </form>
      )}
    </div>
  );
};

export { SnakeSegment, GameOver, Score, Paused, Start, PlayerName, Time };
