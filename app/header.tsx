"use client";

import { useSnapshot } from "valtio";
import { player, state, useTimer } from "./utils";

export default function Header() {
  const { score } = useSnapshot(state);

  const { started, paused, gameOver } = useSnapshot(state);
  useTimer(started, paused, gameOver);

  return (
    <header className="flex h-fit flex-row justify-between items-center border-b-[1px] bg-zinc-800 border-zinc-400 absolute top-0 w-full z-50">
      {player.name && <div className="text-current m-4">{player.name}</div>}
      <div className="text-current m-4">{`${score}`}</div>
    </header>
  );
}
