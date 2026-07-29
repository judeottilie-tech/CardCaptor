export default function Sparkle({ className = "", color = "#d137bf", style }) {
  return (
    <svg viewBox="0 0 24 26" className={className} fill={color} style={style} aria-hidden="true">
      <path d="M12 0c.6 4.8 1.6 7.9 3.4 9.6C17.2 11.4 20.2 12.4 24 13c-3.8.6-6.8 1.6-8.6 3.4C13.6 18.2 12.6 21.2 12 26c-.6-4.8-1.6-7.8-3.4-9.6C6.8 14.6 3.8 13.6 0 13c3.8-.6 6.8-1.6 8.6-3.4C10.4 7.8 11.4 4.8 12 0Z" />
    </svg>
  );
}
