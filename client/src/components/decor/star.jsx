const PATHS = {
  a: "M-7.52,-78.36 Q0,-100 7.52,-78.36 Q23.51,-32.36 46.42,-31.89 Q95.11,-30.9 76.85,-17.06 Q38.04,12.36 44.68,34.29 Q58.78,80.9 39.97,67.81 Q0,40 -18.81,53.09 Q-58.78,80.9 -52.14,58.97 Q-38.04,12.36 -56.3,-1.48 Q-95.11,-30.9 -72.2,-31.37 Q-23.51,-32.36 -15.99,-54 Z",
  d: "M32.46,-73.53 Q50,-86.6 47.45,-64.88 Q42.02,-18.71 59.87,-6.07 Q97.81,20.79 76.36,25.07 Q30.78,34.18 24.27,55.07 Q10.45,99.45 -0.25,80.37 Q-23,39.84 -44.87,40.11 Q-91.35,40.67 -76.51,24.6 Q-44.99,-9.56 -52,-30.28 Q-66.91,-74.31 -47.04,-65.17 Q-4.81,-45.75 12.73,-58.82 Z",
};

let uid = 0;

export default function Star({
  variant = "a",
  className = "",
  colors = ["#d137bf", "#7971FC"],
}) {
  const id = `star-grad-${(uid += 1)}`;
  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[1]} />
        </linearGradient>
      </defs>
      <path d={PATHS[variant]} fill={`url(#${id})`} />
    </svg>
  );
}
