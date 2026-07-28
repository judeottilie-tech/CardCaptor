import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { getPet, feedPet } from "../../managers/petManager";
import { getSpriteUrl } from "../../data/pokemonStarters";
import Heart from "./heart";

const FED_LINES = ["yummers!!!", "thankya!!", "yummy", "my favorite", ":3", "heheee"];

const MOOD = {
  happy: { threshold: 60, ring: "#9EDEF9" },
  neutral: { threshold: 30, ring: "#FAD0D5" },
  hungry: { threshold: 0, ring: "#F59BAD" },
};

function getMood(fullness) {
  if (fullness >= MOOD.happy.threshold) return MOOD.happy;
  if (fullness >= MOOD.neutral.threshold) return MOOD.neutral;
  return MOOD.hungry;
}

const RING_R = 34;
const RING_CIRC = 2 * Math.PI * RING_R;

export default function Pet() {
  const [pet, setPet] = useState(null);
  const [line, setLine] = useState(null);
  const [evolvedTo, setEvolvedTo] = useState(null);
  const [hearts, setHearts] = useState([]);
  const controls = useAnimationControls();
  const heartId = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    getPet(controller.signal)
      .then(setPet)
      .catch((err) => {
        if (err.name !== "AbortError") throw err;
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    let timeout;
    const scheduleSquish = () => {
      timeout = setTimeout(() => {
        controls.start({
          scaleY: [1, 0.8, 1.08, 1],
          scaleX: [1, 1.1, 0.95, 1],
          transition: { duration: 0.5 },
        });
        scheduleSquish();
      }, 4000 + Math.random() * 5000);
    };
    scheduleSquish();
    return () => clearTimeout(timeout);
  }, [controls]);

  if (!pet) return null;

  const mood = getMood(pet.fullness);

  const handleFeed = () => {
    feedPet().then((updated) => {
      setPet(updated);

      setLine(FED_LINES[Math.floor(Math.random() * FED_LINES.length)]);
      setTimeout(() => setLine(null), 2000);

      if (updated.evolved) {
        setEvolvedTo(updated.currentPokemon);
        setTimeout(() => setEvolvedTo(null), 3000);
      }

      controls.start({
        scaleY: [1, 0.7, 1.15, 1],
        scaleX: [1, 1.2, 0.9, 1],
        transition: { duration: 0.55 },
      });

      const id = (heartId.current += 1);
      const burst = Array.from({ length: 5 }).map((_, i) => ({
        id: `${id}-${i}`,
        dx: (Math.random() - 0.5) * 60,
        delay: i * 0.04,
      }));
      setHearts((prev) => [...prev, ...burst]);
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => !burst.find((b) => b.id === h.id)));
      }, 700);
    });
  };

  return (
    <div className="fixed right-5 bottom-5 z-40 flex flex-col items-center">
      <AnimatePresence>
        {evolvedTo && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            className="mb-2 rounded-2xl bg-white px-3 py-1.5 text-xs font-semibold text-brand-ink shadow-lg"
          >
            Whoa! Evolved into {evolvedTo}!
          </motion.div>
        )}
        {!evolvedTo && line && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            className="mb-2 rounded-2xl bg-white px-3 py-1.5 text-xs text-brand-ink shadow-lg"
          >
            {line}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div animate={controls} className="relative">
        <AnimatePresence>
          {hearts.map((h) => (
            <motion.span
              key={h.id}
              initial={{ opacity: 1, y: 0, x: 0, scale: 0.6 }}
              animate={{ opacity: 0, y: -46, x: h.dx, scale: 1.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, delay: h.delay, ease: "easeOut" }}
              className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2"
            >
              <Heart color="#F59BAD" className="h-3 w-3" />
            </motion.span>
          ))}
        </AnimatePresence>

        <svg
          viewBox="0 0 76 76"
          className="pointer-events-none absolute -top-[6px] -left-[6px] h-[76px] w-[76px] -rotate-90"
          aria-hidden="true"
        >
          <circle cx="38" cy="38" r={RING_R} fill="none" stroke="#000336" strokeWidth="4" />
          <circle
            cx="38"
            cy="38"
            r={RING_R}
            fill="none"
            stroke={mood.ring}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={RING_CIRC}
            strokeDashoffset={RING_CIRC * (1 - pet.fullness / 100)}
            style={{ transition: "stroke-dashoffset 0.4s ease, stroke 0.4s ease" }}
          />
        </svg>

        <button
          type="button"
          onClick={handleFeed}
          aria-label="Feed your pet"
          title={`${pet.currentPokemon} (feed to help it evolve)`}
          className="h-16 w-16 overflow-hidden rounded-full bg-white p-2 shadow-lg"
        >
          <img
            src={getSpriteUrl(pet.currentPokemon)}
            alt={pet.currentPokemon}
            className="h-full w-full object-contain"
          />
        </button>
      </motion.div>
    </div>
  );
}
