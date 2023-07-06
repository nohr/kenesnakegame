"use client";

import { useEffect, useState } from "react";
import { proxy } from "valtio";

// player state
export const player = proxy({
  name: "",
  games: [],
  highScore: 0,
  date: new Date(),
});

// game state
export const state = proxy({
  player: null,
  snake: [{ x: 0, y: 0 }],
  score: 0,
  started: false,
  paused: false,
  direction: "right" as DirectionType,
  gameOver: false,
});

// hooks
const useArrowKeys = (callback: (key: string) => void) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        e.preventDefault();
        callback(e.key);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [callback]);
};

const useTouchControls = (callback: (direction: DirectionType) => void) => {
  // TODO:  long press to pause with visual feedback
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

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [callback]);
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

export { useArrowKeys, useTouchControls, useLocalStorage };
