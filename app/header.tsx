"use client";

import { useSnapshot } from "valtio";
import { player, state } from "./utils";
import { Time } from "./ui";

export default function Header() {
  const { score } = useSnapshot(state);
  return (
    <header className="flex h-fit flex-row justify-between items-center bg-zinc-700">
      <Time />
      {player.name && (
        <div className="text-white absolute top-0 left-0 m-4">
          {player.name}
        </div>
      )}
      <div className="text-white absolute top-0 right-0 m-4">{`${score}`}</div>
    </header>
  );
}
