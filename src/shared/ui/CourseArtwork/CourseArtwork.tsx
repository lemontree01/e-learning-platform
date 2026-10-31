import { type PointerEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type LiveIcon } from './renderer/liveIcons';
import styles from './CourseArtwork.module.scss';

// One icon per course (courseIcons.ts). Posters are rendered offline by
// scripts/render-course-art.cjs; on screen a live, spinning 3D icon replaces them.
export const COURSE_ART_COUNT = 20;
const SIZES = '(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 40vw';

export function CourseArtwork ({ id, eager = false, }: { id: number; eager?: boolean }) {
  const { t, } = useTranslation();
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef<LiveIcon | null>(null);
  const [isLive, setLive] = useState(false);
  // shortcut: courses past the icon set reuse earlier icons; add icons when courses grow.
  const form = id % COURSE_ART_COUNT;
  const src = `/images/courses/course-${form}`;

  useEffect(() => {
    const target = canvas.current;
    if (!target || !('IntersectionObserver' in window) ||
      matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let alive = true;
    let shown = false;
    let loading = false;
    const observer = new IntersectionObserver(([entry]) => {
      shown = entry.isIntersecting;
      live.current?.show(shown);
      if (!shown || loading) return;
      loading = true;
      // Without WebGL the import fails and the poster simply stays.
      void import(/* webpackChunkName: "course-icons" */ './renderer/liveIcons')
        .then(({ mountIcon, }) => {
          if (!alive) return;
          live.current = mountIcon(target, form, setLive);
          live.current?.show(shown);
        })
        .catch(() => {});
    });
    observer.observe(target);
    return () => {
      alive = false;
      observer.disconnect();
      live.current?.unmount();
      live.current = null;
      setLive(false);
    };
  }, [form]);

  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty('--art-x', `${y * -5}deg`);
    event.currentTarget.style.setProperty('--art-y', `${x * 5}deg`);
    live.current?.point(x, y);
  };
  const reset = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--art-x', '0deg');
    event.currentTarget.style.setProperty('--art-y', '0deg');
    live.current?.leave();
  };
  return (
    <div className={styles.art} aria-hidden="true" data-course-art={id}
      data-live={isLive || undefined} onPointerMove={tilt} onPointerLeave={reset}>
      <span className={styles.index}>
        {t('artwork-study', { number: String(id + 1).padStart(2, '0'), })}
      </span>
      <picture>
        <source type="image/avif" sizes={SIZES}
          srcSet={`${src}-480.avif 480w, ${src}-960.avif 960w`} />
        <img className={styles.object} src={`${src}.webp`} alt="" width="960" height="576"
          loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'}
          decoding="async" />
      </picture>
      <canvas ref={canvas} className={styles.live} />
    </div>
  );
}
