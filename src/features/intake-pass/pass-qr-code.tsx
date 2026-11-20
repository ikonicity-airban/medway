import * as React from "react";

export interface PassQrCodeProps {
  passCode: string;
  size?: number;
  className?: string;
}

/**
 * PassQrCode renders an accessible, high-contrast vector matrix SVG
 * representing the intake pass verification code.
 * Zero external network CDNs, zero canvas taint, fully offline compatible.
 */
export const PassQrCode: React.FC<PassQrCodeProps> = ({
  passCode,
  size = 180,
  className = "",
}) => {
  // Generate a deterministic 21x21 QR-like matrix grid from the passCode string
  const matrix = React.useMemo(() => {
    const gridSize = 21;
    const grid: boolean[][] = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(false)
    );

    // 1. Draw corner position finder patterns (7x7 blocks at top-left, top-right, bottom-left)
    const drawFinder = (startX: number, startY: number) => {
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
          const isOuter = x === 0 || x === 6 || y === 0 || y === 6;
          const isInner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
          grid[startY + y][startX + x] = isOuter || isInner;
        }
      }
    };

    drawFinder(0, 0); // Top-left
    drawFinder(gridSize - 7, 0); // Top-right
    drawFinder(0, gridSize - 7); // Bottom-left

    // 2. Draw timing patterns (dashed lines connecting finders)
    for (let i = 8; i < gridSize - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    // 3. Populate data cells deterministically using passCode character codes
    let hash = 0;
    for (let i = 0; i < passCode.length; i++) {
      hash = (hash * 31 + passCode.charCodeAt(i)) >>> 0;
    }

    let seed = hash;
    const pseudoRandom = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        // Skip finder pattern zones and separators
        const inTopLeft = x < 8 && y < 8;
        const inTopRight = x >= gridSize - 8 && y < 8;
        const inBottomLeft = x < 8 && y >= gridSize - 8;
        const isTiming = (y === 6 && x >= 8 && x < gridSize - 8) || (x === 6 && y >= 8 && y < gridSize - 8);

        if (!inTopLeft && !inTopRight && !inBottomLeft && !isTiming) {
          grid[y][x] = pseudoRandom() > 0.45;
        }
      }
    }

    return grid;
  }, [passCode]);

  const gridSize = matrix.length;
  const cellSize = 10;
  const totalSize = gridSize * cellSize;

  return (
    <div
      className={`inline-flex flex-col items-center justify-center p-3 bg-white rounded-lg border-2 border-slate-900 shadow-sm ${className}`}
      role="img"
      aria-label={`Digital verification matrix for pass ${passCode}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${totalSize} ${totalSize}`}
        className="w-full h-auto max-w-[200px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={totalSize} height={totalSize} fill="#ffffff" />
        {matrix.map((row, y) =>
          row.map((cell, x) =>
            cell ? (
              <rect
                key={`${y}-${x}`}
                x={x * cellSize}
                y={y * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#0f172a"
              />
            ) : null
          )
        )}
      </svg>
      <span className="mt-2 text-xs font-mono font-bold tracking-widest text-slate-900">
        {passCode}
      </span>
    </div>
  );
};
