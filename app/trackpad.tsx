import { RefObject, useEffect } from "react";
import { state, useTouchControls } from "./utils";

export default function Trackpad({
  trackpadRef,
}: {
  trackpadRef: RefObject<HTMLDivElement>;
}) {
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
      className="h-2/5 w-screen lg:hidden border-t-[1px] bg-zinc-800 border-zinc-400 z-50"
    ></div>
  );
}
