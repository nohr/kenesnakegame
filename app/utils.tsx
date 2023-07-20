"use client";

import { RefObject, useEffect, useState } from "react";
import { proxy } from "valtio";

// player state
export const player = proxy({
  name: "",
  games: [] as Game[],
  highScore: 0,
});

export const state = proxy({
  player: null,
  snake: [{ x: 100, y: window.innerHeight / 2 }],
  score: 0,
  time: 0,
  started: false,
  paused: false,
  direction: "right" as DirectionType,
  gameOver: false,
  trackpadHeight: 0,
});

// hooks
const useArrowKeys = (callback: (key: string) => void) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          " ",
          "Escape",
        ].includes(e.key)
      ) {
        e.preventDefault();
        callback(e.key);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [callback]);
};

const useTouchControls = (
  callback: (direction: DirectionType) => void,
  ref: RefObject<HTMLDivElement>
) => {
  useEffect(() => {
    let startX: number | undefined;
    let startY: number | undefined;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!startX || !startY) {
        return;
      }

      const touch = e.touches[0];
      const xDiff = startX - touch.clientX;
      const yDiff = startY - touch.clientY;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        callback(xDiff > 0 ? "left" : "right");
      } else {
        callback(yDiff > 0 ? "up" : "down");
      }

      startX = undefined;
      startY = undefined;
    };

    if (!ref.current) {
      return;
    }
    ref.current.addEventListener("touchstart", handleTouchStart);
    ref.current.addEventListener("touchmove", handleTouchMove);

    return () => {
      if (!ref.current) {
        return;
      }
      ref.current.removeEventListener("touchstart", handleTouchStart);
      ref.current.removeEventListener("touchmove", handleTouchMove);
    };
  }, [callback, ref]);
};

const useLocalStorage = () => {
  function get(key: string): string {
    if (typeof window !== "undefined") {
      const item = window.localStorage.getItem(key) || "";
      return item;
    } else {
      return "";
    }
  }

  function set(key: string, value: any): void {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value));
      return;
    }
  }

  return { get, set };
};

const useTimer = (started: boolean, paused: boolean, gameOver: boolean) => {
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (started && !paused) {
      timer = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [started, paused, gameOver]);

  useEffect(() => {
    if (!gameOver) {
      state.time = time;
    } else {
      setTime(0);
    }
  }, [gameOver, time]);

  return time;
};

function newGame() {
  state.gameOver = false;
  state.snake = [{ x: 100, y: window.innerHeight / 2 }];
  state.score = 0;
  state.time = 0;
  state.started = true;
  state.direction = "right";
}

export { useArrowKeys, useTouchControls, useLocalStorage, useTimer, newGame };
