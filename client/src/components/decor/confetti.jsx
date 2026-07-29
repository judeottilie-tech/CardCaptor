import Sparkle from "./sparkle";

const COLORS = ["#FD8CEA", "#d137bf", "#7971FC", "#2AD3DC"];

const SETS = {
  1: [
    { top: "6%", side: "left", offset: "3%", size: 10, rotate: -18, c: 0 },
    { top: "16%", side: "right", offset: "5%", size: 14, rotate: 10, c: 2 },
    { top: "28%", side: "left", offset: "8%", size: 8, rotate: 24, c: 3 },
    { top: "38%", side: "right", offset: "2%", size: 12, rotate: -8, c: 1 },
    { top: "52%", side: "left", offset: "4%", size: 16, rotate: 6, c: 0 },
    { top: "64%", side: "right", offset: "9%", size: 9, rotate: -20, c: 2 },
    { top: "76%", side: "left", offset: "1%", size: 11, rotate: 16, c: 3 },
    { top: "88%", side: "right", offset: "6%", size: 13, rotate: -4, c: 1 },
  ],
  2: [
    { top: "10%", side: "right", offset: "2%", size: 11, rotate: 14, c: 1 },
    { top: "22%", side: "left", offset: "6%", size: 9, rotate: -22, c: 3 },
    { top: "34%", side: "right", offset: "10%", size: 15, rotate: 4, c: 0 },
    { top: "46%", side: "left", offset: "2%", size: 8, rotate: 20, c: 2 },
    { top: "60%", side: "right", offset: "5%", size: 12, rotate: -10, c: 3 },
    { top: "72%", side: "left", offset: "9%", size: 10, rotate: 8, c: 1 },
    { top: "84%", side: "right", offset: "3%", size: 14, rotate: -16, c: 0 },
  ],
};

export default function Confetti({ set = 1, className = "" }) {
  const pieces = SETS[set] || SETS[1];
  return (
    <div className={`pointer-events-none absolute inset-0 hidden md:block ${className}`} aria-hidden="true">
      {pieces.map((p, i) => (
        <Sparkle
          key={i}
          color={COLORS[p.c]}
          className="absolute"
          style={{
            top: p.top,
            [p.side]: p.offset,
            width: p.size,
            height: p.size,
            opacity: 0.28,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
