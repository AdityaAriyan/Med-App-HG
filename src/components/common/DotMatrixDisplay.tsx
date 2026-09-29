import React from 'react';

// 5x7 Dot Matrix Font Definitions for Digits 0-9 and Symbols
const MATRIX_MAP: Record<string, number[][]> = {
  '0': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '1': [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
  ],
  '2': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  '3': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '4': [
    [0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0],
  ],
  '5': [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '6': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '7': [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
  ],
  '8': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '9': [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  '.': [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [1, 1],
    [1, 1],
  ],
  '%': [
    [1, 1, 0, 0, 1],
    [1, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 1],
    [1, 0, 0, 1, 1],
    [0, 0, 0, 0, 0],
  ],
  '-': [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  '+': [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
  ]
};

interface DotMatrixDisplayProps {
  value: string | number;
  unit?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  dotColor?: string;
  offDotColor?: string;
  showOffDots?: boolean;
  className?: string;
}

export const DotMatrixDisplay: React.FC<DotMatrixDisplayProps> = ({
  value,
  unit,
  size = 'md',
  dotColor = 'currentColor',
  offDotColor = 'transparent',
  showOffDots = false,
  className = ''
}) => {
  const str = String(value);

  // Size configurations
  const config = {
    sm: { dotSize: 3, gap: 2, charGap: 6, unitSize: 11, unitMargin: 4 },
    md: { dotSize: 4.5, gap: 2.5, charGap: 8, unitSize: 14, unitMargin: 6 },
    lg: { dotSize: 6, gap: 3.5, charGap: 12, unitSize: 18, unitMargin: 8 },
    xl: { dotSize: 8, gap: 4.5, charGap: 16, unitSize: 22, unitMargin: 10 }
  }[size];

  return (
    <div
      className={`inline-flex items-end ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: `${config.unitMargin}px`,
        userSelect: 'none'
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'flex-end',
          gap: `${config.charGap}px`
        }}
      >
        {str.split('').map((char, charIdx) => {
          const matrix = MATRIX_MAP[char];

          if (!matrix) {
            // Fallback for unmapped characters
            return (
              <span
                key={charIdx}
                style={{
                  fontFamily: 'var(--font-digital)',
                  fontSize: `${config.dotSize * 8}px`,
                  lineHeight: 1,
                  fontWeight: 700,
                  color: dotColor
                }}
              >
                {char}
              </span>
            );
          }

          const cols = matrix[0].length;
          const rows = matrix.length;
          const charWidth = cols * config.dotSize + (cols - 1) * config.gap;
          const charHeight = rows * config.dotSize + (rows - 1) * config.gap;

          return (
            <svg
              key={charIdx}
              width={charWidth}
              height={charHeight}
              viewBox={`0 0 ${charWidth} ${charHeight}`}
              style={{ display: 'block', overflow: 'visible' }}
            >
              {matrix.map((row, rIdx) =>
                row.map((active, cIdx) => {
                  const cx = cIdx * (config.dotSize + config.gap) + config.dotSize / 2;
                  const cy = rIdx * (config.dotSize + config.gap) + config.dotSize / 2;

                  if (!active && !showOffDots) return null;

                  return (
                    <circle
                      key={`${rIdx}-${cIdx}`}
                      cx={cx}
                      cy={cy}
                      r={config.dotSize / 2}
                      fill={active ? dotColor : offDotColor}
                      style={{
                        transition: 'fill 0.2s ease'
                      }}
                    />
                  );
                })
              )}
            </svg>
          );
        })}
      </div>

      {unit && (
        <span
          style={{
            fontFamily: 'var(--font-main)',
            fontSize: `${config.unitSize}px`,
            fontWeight: 600,
            letterSpacing: '0.02em',
            opacity: 0.85,
            color: dotColor,
            marginLeft: '4px'
          }}
        >
          {unit}
        </span>
      )}
    </div>
  );
};
