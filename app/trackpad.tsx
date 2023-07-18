import { use, useEffect, useRef } from "react";
import { state, useTouchControls } from "./utils";

export default function Trackpad() {
  const trackpadRef = useRef<HTMLDivElement>(null);
  useTouchControls(
    (direction: DirectionType) => (state.direction = direction),
    trackpadRef
  );

  useEffect(() => {
    if (trackpadRef.current) {
      state.trackpadHeight = trackpadRef.current.clientHeight;
    }
  }, [trackpadRef]);
  return (
    <div
      ref={trackpadRef}
      className="h-1/4 w-screen lg:hidden border-[1px] bg-zinc-800 border-zinc-400"
    ></div>
  );
}
