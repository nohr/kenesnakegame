"use client";

import React, { useEffect } from "react";
import {
  GameOver,
  Paused,
  PlayerName,
  Score,
  SnakeSegment,
  Start,
  Time,
} from "./ui";
import {
  useArrowKeys,
  useTouchControls,
  state,
  player,
  useLocalStorage,
  newGame,
} from "./utils";
import { useSnapshot } from "valtio";

const Snake: () => JSX.Element = () => {
  const { snake, score, paused, started, direction, gameOver } =
    useSnapshot(state);
  const { highScore } = useSnapshot(player);

  useArrowKeys((key: string) => {
    if (key === " " && gameOver) {
      newGame();
    } else if ((key === " " || key === "Escape") && started && !gameOver) {
      state.paused = !paused;
    } else if (!paused && started) {
      switch (key) {
        case "ArrowUp":
          state.direction = "up";
          break;
        case "ArrowDown":
          state.direction = "down";
          break;
        case "ArrowLeft":
          state.direction = "left";
          break;
        case "ArrowRight":
          state.direction = "right";
          break;
      }
    }
  });

  useTouchControls((direction: DirectionType) => (state.direction = direction));

  useEffect(() => {
    if (paused || !started || gameOver) {
      return;
    }

    const moveSnake = () => {
      const newSnake = [...state.snake];
      const head = newSnake[newSnake.length - 1];

      switch (direction) {
        case "up":
          newSnake.push({ x: head.x, y: head.y - 10 });
          break;
        case "down":
          newSnake.push({ x: head.x, y: head.y + 10 });
          break;
        case "left":
          newSnake.push({ x: head.x - 10, y: head.y });
          break;
        case "right":
          newSnake.push({ x: head.x + 10, y: head.y });
          break;
      }

      newSnake.shift();
      state.snake = newSnake;
    };

    const checkCollision = () => {
      const head = snake[snake.length - 1];

      if (
        head.x < 0 ||
        head.x >= window.innerWidth ||
        head.y < 0 ||
        head.y >= window.innerHeight
      ) {
        state.gameOver = true;
      }

      for (let i = 0; i < state.snake.length - 1; i++) {
        if (state.snake[i].x === head.x && state.snake[i].y === head.y) {
          state.gameOver = true;
        }
      }
    };

    // food
    const head = snake[snake.length - 1];
    const food = document.getElementById("food");

    if (food) {
      const foodX = parseInt(food.style.left);
      const foodY = parseInt(food.style.top);

      if (head.x === foodX && head.y === foodY) {
        state.score += 1;
        state.snake.unshift({ x: foodX, y: foodY });
        food.style.left = `${Math.floor(Math.random() * 100) * 10}px`;
        food.style.top = `${Math.floor(Math.random() * 100) * 10}px`;
      }
    }

    // drop food
    const dropFood = () => {
      const food = document.getElementById("food");

      if (food) {
        food.style.left = `${Math.floor(Math.random() * 100) * 10}px`;
        food.style.top = `${Math.floor(Math.random() * 100) * 10}px`;
      }
    };

    const interval = setInterval(() => {
      moveSnake();
      checkCollision();
    }, 100);

    return () => clearInterval(interval);
  }, [snake, direction, paused, started, gameOver]);

  const { get, set } = useLocalStorage();

  return (
    <div className="w-full h-full bg-blue-900">
      {snake.map((segment, i) => (
        <SnakeSegment key={i} x={segment.x} y={segment.y} />
      ))}
      {gameOver && <GameOver />}
      <PlayerName />
      <Time />
      <Score score={score} highScore={highScore} />
      {!started && <Start />}
      {paused && started && <Paused />}
    </div>
  );
};

export default Snake;
