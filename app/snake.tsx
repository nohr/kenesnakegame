"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useArrowKeys, state, player, newGame } from "./utils";
import { useSnapshot } from "valtio";
import Trackpad from "./trackpad";

const Snake: () => JSX.Element = () => {
  const { snake, paused, started, direction, gameOver } = useSnapshot(state);
  const mapRef = useRef<HTMLDivElement>(null);
  const trackpadRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  // get header bounds
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    setHeaderHeight(header.clientHeight);
  }, []);

  // drop food
  const dropFood = useCallback(() => {
    const food = document.getElementById("food");
    if (!food || !mapRef.current || !headerHeight) return;
    const x = Math.floor(Math.random() * (mapRef.current.clientWidth - 10));
    // todo - limit from header bottom to trackpad top
    const y = Math.floor(
      Math.random() * (mapRef.current.clientHeight - 10) + headerHeight
    );
    // round to nearest 10
    food.style.left = `${Math.round(x / 10) * 10}px`;
    food.style.top = `${Math.round(y / 10) * 10 + 2}px`;
    console.log(food.style.left, food.style.top);
  }, [mapRef, headerHeight]);

  // start game
  useEffect(() => {
    if (started && !gameOver) {
      dropFood();
    }
  }, [started, dropFood, gameOver]);

  // game logic
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

      // * wall collision
      if (
        head.x < 0 ||
        head.x >= mapRef.current.clientWidth ||
        head.y < headerHeight ||
        head.y >= mapRef.current.clientHeight + mapRef.current.offsetTop
      ) {
        state.gameOver = true;
      }

      // !not working - self collision
      // for (let i = 0; i < state.snake.length - 1; i++) {
      //   if (state.snake[i].x === head.x && state.snake[i].y === head.y) {
      //     console.log("collision");

      //     //   state.gameOver = true;
      //   }
      // }

      // * food collision
      const food = document.getElementById("food");

      if (food) {
        const foodX = parseInt(food.style.left);
        const foodY = parseInt(food.style.top);

        if (head.x === foodX && head.y === foodY) {
          state.score += 1;
          state.snake.unshift({ x: foodX, y: foodY });
          dropFood();
        }
      }
    };

    const interval = setInterval(() => {
      moveSnake();
      checkCollision();
    }, 100);

    return () => clearInterval(interval);
  }, [snake, direction, paused, started, gameOver, headerHeight, dropFood]);

  // const { get, set } = useLocalStorage();

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

  return (
    <>
      <div className="h-3/5" ref={mapRef}>
        {started &&
          !gameOver &&
          snake.map((segment, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white"
              style={{ left: segment.x, top: segment.y }}
            />
          ))}
        {started && !gameOver && (
          <div id="food" className="absolute w-2 h-2 bg-red-500" />
        )}
      </div>
      {started && !gameOver && <Trackpad trackpadRef={trackpadRef} />}
    </>
  );
};

export default Snake;
