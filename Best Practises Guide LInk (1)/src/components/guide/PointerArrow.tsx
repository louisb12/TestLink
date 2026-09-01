/**
 * A red pointer arrow drawn on top of a screenshot.
 * `left` / `top` are the position of the arrow TIP in percent of the image.
 * `angle` is the direction the arrow points, in degrees (0 = points right).
 */
export function PointerArrow({
  left,
  top,
  angle = 0,
  length = 120,
  label,
}: {
  left: number;
  top: number;
  angle?: number;
  length?: number;
  label?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${length}px`,
        height: "26px",
        transform: `translate(-100%, -50%) rotate(${angle}deg)`,
        transformOrigin: "100% 50%",
      }}
    >
      <svg viewBox={`0 0 ${length} 26`} width={length} height={26} className="block">
        <g
          fill="none"
          stroke="#E5322D"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.45))" }}
        >
          <path d={`M4 13 H ${length - 6}`} />
          <path d={`M ${length - 20} 4 L ${length - 5} 13 L ${length - 20} 22`} />
        </g>
      </svg>
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}
