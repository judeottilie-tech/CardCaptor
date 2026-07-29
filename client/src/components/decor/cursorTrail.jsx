import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sparkle from "./sparkle";

const COLORS = ["#FD8CEA", "#d137bf", "#7971FC", "#2AD3DC"];

let uid = 0;

export default function CursorTrail() {
  const [sparkles, setSparkles] = useState([]);
  const lastSpawn = useRef(0);

  useEffect(() => {
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarsePointer) return;

    function handleMove(e) {
      const now = performance.now();
      if (now - lastSpawn.current < 70) return;
      lastSpawn.current = now;

      const id = (uid += 1);
      const sparkle = {
        id,
        x: e.clientX,
        y: e.clientY,
        color: COLORS[id % COLORS.length],
        size: 10 + Math.random() * 10,
        rotate: Math.random() * 60 - 30,
      };

      setSparkles((prev) => [...prev.slice(-14), sparkle]);

      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== id));
      }, 650);
    }

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[999]" aria-hidden="true">
      <AnimatePresence>
        {sparkles.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 1, scale: 0.4, x: s.x, y: s.y, rotate: s.rotate }}
            animate={{ opacity: 0, scale: 1, y: s.y + 18, rotate: s.rotate + 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="absolute top-0 left-0"
            style={{ marginLeft: -s.size / 2, marginTop: -s.size / 2 }}
          >
            <Sparkle color={s.color} className="h-[var(--sz)] w-[var(--sz)]" style={{ "--sz": `${s.size}px` }} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
