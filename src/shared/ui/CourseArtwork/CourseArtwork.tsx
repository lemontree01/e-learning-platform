import { type PointerEvent } from 'react';
import styles from './CourseArtwork.module.scss';

// Original geometric studies. The same visual family is used throughout the catalog.
export function CourseArtwork ({ id, }: { id: number }) {
  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      '--art-x',
      `${((event.clientY - bounds.top) / bounds.height - 0.5) * -5}deg`
    );
    event.currentTarget.style.setProperty(
      '--art-y',
      `${((event.clientX - bounds.left) / bounds.width - 0.5) * 5}deg`
    );
  };
  const reset = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--art-x', '0deg');
    event.currentTarget.style.setProperty('--art-y', '0deg');
  };
  return (
    <div className={styles.art} aria-hidden="true" onPointerMove={tilt} onPointerLeave={reset}>
      <span className={styles.index}>{String(id + 1).padStart(2, '0')} / STUDY</span>
      <svg viewBox="0 0 600 360" fill="none" className={styles.object}>
        <defs>
          <linearGradient
            id={`stone-${id}`}
            x1="150"
            y1="60"
            x2="400"
            y2="320"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--ink)" />
            <stop offset="1" stopColor="var(--muted)" />
          </linearGradient>
        </defs>
        <path d="M70 290H530M100 310H500" stroke="var(--line)" />
        {id % 3 === 0 && (
          <g>
            {[0, 1, 2, 3, 4].map((step) => (
              <g key={step} transform={`translate(${step * 42} ${step * -27})`}>
                <path
                  d="M148 246L227 207L304 246V263L226 304L148 263Z"
                  fill="var(--raised)"
                  stroke="var(--muted)"
                />
                <path d="M148 246L227 207L304 246L226 286Z" fill={`url(#stone-${id})`} />
                <path d="M226 286V304" stroke="var(--muted)" />
              </g>
            ))}
          </g>
        )}
        {id % 3 === 1 && (
          <g>
            <path d="M160 250L300 63L441 250L300 310Z" fill="var(--raised)" stroke="var(--muted)" />
            <path d="M160 250L300 63L300 310Z" fill={`url(#stone-${id})`} />
            <path d="M300 63L441 250L300 213Z" fill="var(--surface)" stroke="var(--muted)" />
            <path d="M195 261L300 120L405 261M230 277L300 176L370 277" stroke="var(--line)" />
          </g>
        )}
        {id % 3 === 2 && (
          <g transform="translate(300 178) rotate(-22)">
            {[104, 80, 56, 32].map((radius, i) => (
              <g key={radius} transform={`translate(${i * 3} ${i * -9})`}>
                <rect
                  x={-radius}
                  y={-radius}
                  width={radius * 2}
                  height={radius * 2}
                  rx="8"
                  fill="var(--surface)"
                  stroke={`url(#stone-${id})`}
                  strokeWidth="14"
                />
                <path
                  d={`M${-radius} ${radius}h${radius * 2}`}
                  stroke="var(--muted)"
                  strokeWidth="2"
                />
              </g>
            ))}
          </g>
        )}
      </svg>
      <span className={styles.coordinate}>FORM / {String((id % 3) + 1).padStart(2, '0')}</span>
    </div>
  );
}
