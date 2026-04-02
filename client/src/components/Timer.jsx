import { useState, useRef, useEffect } from "react";
import { Play, RotateCcw } from "lucide-react";

const Timer = () => {
  const [seconds, setSeconds] = useState(90);
  const [active, setActive] = useState(false);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (!active) {
      setActive(true);
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearInterval(intervalRef.current);
            setActive(false);
            return 90;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }
  };

  const resetTimer = () => {
    setActive(false);
    clearInterval(intervalRef.current);
    setSeconds(90);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-2xl font-semibold">
        {" "}
        {String(Math.floor(seconds / 60)).padStart(2, "0")}:
        {String(seconds % 60).padStart(2, "0")}{" "}
      </span>
      <div className="flex gap-2">
        <button
          onClick={startTimer}
          disabled={active}
          className="bg-emerald-500 px-3 py-1 rounded text-white hover:cursor-pointer hover:bg-emerald-500/70"
        >
          <Play />
        </button>
        <button
          onClick={resetTimer}
          className="bg-gray-400 px-3 py-1 rounded text-white hover:cursor-pointer hover:bg-zinc-500"
        >
          <RotateCcw />
        </button>
      </div>
    </div>
  );
};

export default Timer;
