"use client";

import "./globals.css";
import Header from "./header";
import { GameOver, Paused, Start } from "./ui";
import { useSnapshot } from "valtio";
import { state } from "./utils";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { started, paused, gameOver } = useSnapshot(state);
  useEffect(() => {
    window.scrollTo({ behavior: "instant", top: 0 });
  }, [started]);
  return (
    <html lang="en">
      <body className="select-none text-zinc-400 bg-zinc-900 w-[100svw] h-[100dvh] overflow-hidden">
        <Header />
        <main className="w-full h-screen flex flex-col"> {children}</main>
        {gameOver && <GameOver />}
        {!started && <Start />}
        {paused && <Paused />}
      </body>
    </html>
  );
}
