import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import { EXPERIMENT_END, getExperimentFrame } from '../model/experiment';
import { ObservatoryMachine } from './ObservatoryMachine';
import styles from './Observatory.module.scss';

export function Observatory () {
  const { t, } = useTranslation('observatory');
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [speed, setSpeed] = useState(1);
  const frame = getExperimentFrame(time, fixed);
  const start = () => { setTime(0); setPlaying(true); };
  const runFromIntro = () => {
    start();
    if (window.matchMedia('(max-width: 800px)').matches) {
      document.getElementById('observatory')?.scrollIntoView({
        block: 'start',
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    }
  };

  useEffect(() => {
    if (!playing) return;
    let previous: number | undefined;
    let animation: number;
    const tick = (now: number) => {
      if (previous !== undefined) {
        const elapsed = Math.min(now - previous, 100) * 0.2 * speed;
        setTime((current) => Math.min(EXPERIMENT_END, current + elapsed));
      }
      previous = now;
      animation = requestAnimationFrame(tick);
    };
    animation = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(animation); };
  }, [playing, speed]);

  useEffect(() => {
    if (time >= EXPERIMENT_END) setPlaying(false);
  }, [time]);

  useEffect(() => {
    const pauseWhenHidden = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener('visibilitychange', pauseWhenHidden);
    return () => { document.removeEventListener('visibilitychange', pauseWhenHidden); };
  }, []);

  useEffect(() => {
    if (window.location.hash === '#observatory') {
      document.getElementById('observatory')?.scrollIntoView({ block: 'start', });
    }
  }, []);

  const announcement = time === 0
    ? t('ready')
    : frame.stale ? t('stale-result') : frame.result ? t('latest-result') : t('requests-running');

  return <section className={styles.hero} aria-labelledby='hero-title'>
    <div className={styles.intro}>
      <p className={styles.eyebrow}><span />{t('eyebrow')}</p>
      <h1 id='hero-title'>{t('title-first')}<br /><em>{t('title-last')}</em></h1>
      <p className={styles.description}>{t('description')}</p>
      <div className={styles.actions}>
        <button type='button' className='action' onClick={runFromIntro}>
          <PlayArrowIcon />{t('run-demo')}
        </button>
        <Link href='/courses' className='action action-secondary'>
          {t('explore-courses')}<ArrowForwardIcon />
        </Link>
      </div>
      <p className={styles.invitation}>{t('invitation')}</p>
      <div className={styles.index}>
        <span>01 — {t('observe')}</span>
        <span>02 — {t('interact')}</span>
        <span>03 — {t('understand')}</span>
      </div>
    </div>
    <div className={styles.instrument} id='observatory'>
      <div className={styles['instrument-head']}>
        <span>OBS / 001</span><span className={styles.live}><span />{t('interactive')}</span>
      </div>
      <div className={styles.machine}><ObservatoryMachine time={time} fixed={fixed} /></div>
      <div className={styles.experiment}>
        <div className={styles['experiment-title']}>
          <div><p className='eyebrow'>{t('experiment')}</p><h2>{t('race-title')}</h2></div>
          <span className={styles.timing}>{Math.round(time)} ms</span>
        </div>
        <div className={styles.request}>
          <code>react</code><div className={styles.track}>
            <svg viewBox='0 0 100 8' preserveAspectRatio='none' aria-hidden='true'>
              <rect width='100' height='8' rx='4' fill='var(--line)' />
              <rect width={fixed && time >= 200 ? 18 : Math.min(time / 11, 100)}
                height='8' rx='4' fill={fixed ? 'var(--muted)' : 'var(--ink)'} />
            </svg>
          </div><span>{t(frame.first)}</span>
        </div>
        <div className={styles.request}>
          <code>react hooks</code><div className={styles.track}>
            <svg viewBox='0 0 100 8' preserveAspectRatio='none' aria-hidden='true'>
              <rect width='100' height='8' rx='4' fill='var(--line)' />
              <rect x='18' width={Math.max(0, Math.min((time - 200) / 4.5, 82))}
                height='8' rx='4' fill='var(--ink)' />
            </svg>
          </div><span>{t(frame.second)}</span>
        </div>
        <input className={styles.scrubber} type='range' min='0' max={EXPERIMENT_END}
          value={Math.round(time)} aria-label={t('scrub')}
          onChange={(event) => { setPlaying(false); setTime(Number(event.target.value)); }} />
        <div className={styles.controls}>
          <div className={styles.playback}>
            <button type='button' onClick={() => {
              if (time >= EXPERIMENT_END) start(); else setPlaying(!playing);
            }} aria-label={playing ? t('pause') : t('play')}>
              {playing ? <PauseIcon /> : <PlayArrowIcon />}
            </button>
            <button type='button' onClick={start} aria-label={t('replay')}><ReplayIcon /></button>
            <select value={speed} onChange={(event) => { setSpeed(Number(event.target.value)); }}
              aria-label={t('speed')}>
              <option value='1'>1×</option><option value='2'>2×</option>
            </select>
          </div>
          <label className={styles.fix}><input type='checkbox' checked={fixed}
            onChange={(event) => { setFixed(event.target.checked); }} />{t('cancel-older')}</label>
        </div>
        <div className={styles.result} data-stale={frame.stale}>
          <span className={styles['result-dot']} /><p role='status'>{announcement}</p>
        </div>
        <p className={styles.simulated}>{t('simulated')}</p>
      </div>
    </div>
    <div className={styles.bottom}>
      <span>{t('bottom-label')}</span>
      <p>{t('bottom-description')}</p>
      <span className={styles.coordinate}>JS / TS / REACT</span>
    </div>
  </section>;
}
