export function HexGrid() {
  return (
    <svg
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.04,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="hexPattern" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
          <polygon
            points="28,2 52,14 52,38 28,50 4,38 4,14"
            fill="none"
            stroke="#00E5C3"
            strokeWidth="0.8"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexPattern)" />
    </svg>
  );
}
