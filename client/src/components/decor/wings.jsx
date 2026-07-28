export default function Wings({ className = "", color = "#F59BAD" }) {
  const feather =
    "M58,50 C48,44 30,42 14,30 C24,32 34,28 40,18 C36,30 44,34 50,32 C48,38 54,42 58,38 Z";
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden="true">
      <path d={feather} fill={color} />
      <path d={feather} fill={color} transform="scale(-1,1) translate(-120,0)" />
    </svg>
  );
}
