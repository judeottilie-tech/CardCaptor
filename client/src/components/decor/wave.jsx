export default function Wave({ fill }) {
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 w-full leading-none" aria-hidden="true">
      <svg viewBox="0 0 1440 100" className="block h-14 w-full md:h-20" preserveAspectRatio="none">
        <path
          d="M0,32 C240,80 480,80 720,48 C960,16 1200,16 1440,48 L1440,100 L0,100 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
