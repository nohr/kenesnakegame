"use client";

import React, { useEffect, useRef } from "react";
import { GameOver, Paused, SnakeSegment, Start } from "./ui";
import { useArrowKeys, state, player, newGame } from "./utils";
import { useSnapshot } from "valtio";
import Trackpad from "./trackpad";

const Snake: () => JSX.Element = () => {
  const { snake, paused, started, direction, gameOver } = useSnapshot(state);
  const mapRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (
      paused ||
      !started ||
      gameOver ||
      player.name === "" ||
      !mapRef.current
    ) {
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

      if (!mapRef.current) return;

      if (
        head.x < 0 ||
        head.x >= mapRef.current.clientWidth ||
        head.y < 0 ||
        head.y >= mapRef.current.clientHeight
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

  // const { get, set } = useLocalStorage();

  return (
    <>
      {gameOver && <GameOver />}
      {!started && <Start />}
      {paused && started && <Paused />}
      <div className="h-3/4" ref={mapRef}>
        {snake.map((segment, i) => (
          <SnakeSegment key={i} x={segment.x} y={segment.y} />
        ))}
      </div>
      {started && <Trackpad />}
    </>
  );
};

export default Snake;
