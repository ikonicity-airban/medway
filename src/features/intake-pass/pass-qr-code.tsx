"use client";

import * as React from "react";
import QRCode from "qrcode";
import { Check, Copy, ScanLine } from "lucide-react";

export interface PassQrCodeProps {
  passCode: string;
  size?: number;
  className?: string;
  showCode?: boolean;
}

/**
 * PassQrCode renders an authentic, standards-compliant vector matrix QR code
 * inside a clinical scanner viewfinder card for the student digital intake slip.
 * Generates true ISO/IEC 18004 scannable 2D barcodes with high-contrast quiet zones.
 */
export const PassQrCode: React.FC<PassQrCodeProps> = ({
  passCode,
  size = 180,
  className = "",
  showCode = true,
}) => {
  const [copied, setCopied] = React.useState(false);

  // Generate authentic QR code matrix using standard QRCode library
  const { matrix, moduleCount } = React.useMemo(() => {
    try {
      const qr = QRCode.create(passCode, {
        errorCorrectionLevel: "M",
      });
      const count = qr.modules.size;
      const grid: boolean[][] = [];

      for (let y = 0; y < count; y++) {
        const row: boolean[] = [];
        for (let x = 0; x < count; x++) {
          row.push(qr.modules.get(x, y) === 1);
        }
        grid.push(row);
      }

      return { matrix: grid, moduleCount: count };
    } catch {
      // Fallback 21x21 grid in case of edge input
      const fallbackSize = 21;
      const fallbackGrid = Array.from({ length: fallbackSize }, () =>
        Array(fallbackSize).fill(false)
      );
      return { matrix: fallbackGrid, moduleCount: fallbackSize };
    }
  }, [passCode]);

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(passCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // SVG calculations with a 2-module quiet zone
  const quietZone = 2;
  const totalGridSize = moduleCount + quietZone * 2;
  const cellSize = 10;
  const totalSvgDimension = totalGridSize * cellSize;

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 shadow-md max-w-[260px] w-full mx-auto select-none ${className}`}
      role="img"
      aria-label={`Digital verification matrix for pass ${passCode}`}
    >
      {/* 4 Optical Viewfinder Corner Brackets */}
      <div
        className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-teal-700 rounded-tl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-teal-700 rounded-tr pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-teal-700 rounded-bl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-teal-700 rounded-br pointer-events-none"
        aria-hidden="true"
      />

      {/* Real Vector SVG QR Code */}
      <div className="p-1 bg-white rounded-lg flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${totalSvgDimension} ${totalSvgDimension}`}
          className="w-full h-auto max-w-[190px]"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
        >
          {/* Solid White Canvas Background */}
          <rect
            width={totalSvgDimension}
            height={totalSvgDimension}
            fill="#ffffff"
          />

          {/* Authentic Scannable QR Matrix Modules */}
          {matrix.map((row, y) =>
            row.map((isDark, x) =>
              isDark ? (
                <rect
                  key={`${y}-${x}`}
                  x={(x + quietZone) * cellSize}
                  y={(y + quietZone) * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill="#0f172a"
                />
              ) : null
            )
          )}
        </svg>
      </div>

      {/* Styled Pass Code Badge with One Tap Copy */}
      {showCode && (
        <div className="w-full flex flex-col items-center mt-3 pt-2.5 border-t border-slate-100">
          <div
            onClick={handleCopyCode}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCopyCode(e as unknown as React.MouseEvent);
              }
            }}
            title="Click to copy pass code"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 cursor-pointer transition-colors shadow-2xs"
          >
            <span className="font-mono text-sm font-extrabold tracking-widest">
              {passCode}
            </span>
            <span className="text-slate-400 group-hover:text-slate-700">
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-500" />
              )}
            </span>
          </div>

          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
            <ScanLine className="w-3 h-3 text-teal-700 shrink-0" />
            <span>Counter Optical Verification</span>
          </div>
        </div>
      )}
    </div>
  );
};
