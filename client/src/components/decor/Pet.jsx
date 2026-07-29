import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { feedPet } from "../../managers/petManager";
import { getSpriteUrl } from "../../data/pokemonStarters";
import Heart from "./heart";

const FED_LINES = ["!!!", ":0", "!", "!!!", ":D", ":3", ">:|"];

export default function Pet({ pet, setPet }) {
  const [line, setLine] = useState(null);
  const [evolvedTo, setEvolvedTo] = useState(null);
  const [hearts, setHearts] = useState([]);
  const controls = useAnimationControls();
  const heartId = useRef(0);

  useEffect(() => {
    let timeout;
    const scheduleHop = () => {
      timeout = setTimeout(() => {
        controls.start({
          y: [0, -20, 0, -8, 0],
          scaleY: [1, 1.08, 0.85, 1.05, 1],
          scaleX: [1, 0.94, 1.1, 0.97, 1],
          transition: { duration: 0.7, ease: "easeOut" },
        });
        scheduleHop();
      }, 2500 + Math.random() * 3500);
    };
    scheduleHop();
    return () => clearTimeout(timeout);
  }, [controls]);

  if (!pet) return null;

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
        y: [0, -28, 0],
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
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 sm:left-auto sm:right-5 sm:translate-x-0 z-40 flex flex-col items-center">
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
              <Heart color="#d137bf" className="h-3 w-3" />
            </motion.span>
          ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={handleFeed}
          aria-label="Feed your pet"
          title={`${pet.currentPokemon} (feed to help it evolve)`}
          className="block"
        >
          <img
            src={getSpriteUrl(pet.currentPokemon)}
            alt={pet.currentPokemon}
            className="h-16 w-16 sm:h-32 sm:w-32 object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)]"
          />
        </button>
      </motion.div>
    </div>
  );
}
