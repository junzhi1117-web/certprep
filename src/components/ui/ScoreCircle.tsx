import { useEffect, useState } from 'react';

interface ScoreCircleProps {
  score: number;
  size?: number;
}

export function ScoreCircle({ score, size = 160 }: ScoreCircleProps) {
  const [animatedOffset, setAnimatedOffset] = useState(283);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (score / 100) * circumference;

  const color = score >= 90 ? 'var(--color-success)' : score >= 75 ? 'var(--color-primary)' : score >= 50 ? 'var(--color-warning)' : 'var(--color-danger)';

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedOffset(targetOffset), 100);
    return () => clearTimeout(timer);
  }, [targetOffset]);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke="#F2F2F7"
          strokeWidth="8"
        />
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.32, 0.72, 0, 1)' }}
        />
        <text
          x="50" y="46"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-3xl font-bold"
          style={{ fontSize: '24px', fontWeight: 700, fill: 'var(--color-dark)' }}
        >
          {score}%
        </text>
        <text
          x="50" y="62"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: '10px', fill: 'var(--color-secondary)' }}
        >
          Score
        </text>
      </svg>
    </div>
  );
}
