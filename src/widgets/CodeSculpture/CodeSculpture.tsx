'use client';

import {
  Component, type ComponentType, type ReactElement, useCallback, useEffect, useRef, useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_PARAMETERS, type Parameter } from './model/ribbon';
import { ParameterControl } from './ParameterControl';
import { type SculptureRendererProps } from './renderer/types';
import styles from './CodeSculpture.module.scss';

const ARTWORK_SIZES = '(min-width: 1440px) 600px, (min-width: 1024px) 44vw, ' +
  '(min-width: 640px) 600px, calc(100vw - 32px)';

class RendererBoundary extends Component<{
  children: ReactElement;
  onUnavailable: () => void;
}, { failed: boolean }> {
  state = { failed: false, };
  static getDerivedStateFromError () { return { failed: true, }; }
  componentDidCatch () { this.props.onUnavailable(); }
  render () { return this.state.failed ? null : this.props.children; }
}

export function CodeSculpture () {
  const { t, } = useTranslation();
  const stage = useRef<HTMLDivElement>(null);
  const alive = useRef(false);
  const started = useRef(false);
  const failed = useRef(false);
  const [Renderer, setRenderer] = useState<ComponentType<SculptureRendererProps> | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [parameters, setParameters] = useState({ ...DEFAULT_PARAMETERS, });
  const [rotation, setRotation] = useState({ x: 0, y: 0, });
  const [wireframe, setWireframe] = useState(false);
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(true);
  const [mobile, setMobile] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  const drag = useRef<{ x: number; y: number; pointer: number } | null>(null);
  const ready = status === 'ready';
  const unavailable = useCallback(() => {
    failed.current = true;
    if (alive.current) { setStatus('error'); setRenderer(null); }
  }, []);
  const onReady = useCallback(() => {
    if (alive.current && !failed.current) setStatus('ready');
  }, []);
  const activate = useCallback(() => {
    if (started.current) return;
    started.current = true;
    setStatus('loading');
    void import(/* webpackChunkName: "sculpture-renderer" */ './renderer/SculptureRenderer')
      .then(module => { if (alive.current && !failed.current) setRenderer(() => module.default); })
      .catch(unavailable);
  }, [unavailable]);

  useEffect(() => {
    alive.current = true;
    const width = matchMedia('(width < 1024px)');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setMobile(width.matches); setReducedMotion(motion.matches); };
    const visibility = () => { setForeground(document.visibilityState === 'visible'); };
    update();
    visibility();
    width.addEventListener('change', update);
    motion.addEventListener('change', update);
    document.addEventListener('visibilitychange', visibility);
    const observer = new IntersectionObserver(([entry]) => { setVisible(entry.isIntersecting); });
    if (stage.current) observer.observe(stage.current);
    return () => {
      alive.current = false;
      observer.disconnect();
      width.removeEventListener('change', update);
      motion.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  useEffect(() => {
    if (mobile || reducedMotion || !visible || !foreground || status !== 'idle') return;
    let idle = 0;
    const frame = requestAnimationFrame(() => {
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(activate, { timeout: 2500, })
        : window.setTimeout(activate, 200);
    });
    return () => {
      cancelAnimationFrame(frame);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
    };
  }, [mobile, reducedMotion, visible, foreground, status, activate]);

  useEffect(() => {
    if (status !== 'loading' || !visible || !foreground) return;
    const timer = setTimeout(unavailable, 15000);
    return () => { clearTimeout(timer); };
  }, [status, visible, foreground, unavailable]);

  const rotate = (x: number, y: number) => {
    setRotation(previous => ({
      x: Math.max(-1.2, Math.min(1.2, previous.x + x)), y: previous.y + y,
    }));
  };

  return (
    <div className={styles.widget} data-sculpture={status}>
      <div className={styles.caption}>
        <span>{t('sculpture-title')}</span>
      </div>
      <div ref={stage} className={styles.stage}>
        <picture>
          <source type="image/avif" sizes={ARTWORK_SIZES}
            srcSet={'/images/sculpture-540.avif 540w, /images/sculpture-810.avif 810w, ' +
              '/images/sculpture.avif 1080w'} />
          <img className={styles.artwork} src="/images/sculpture.webp" width="1080" height="840"
            alt={t('sculpture-alt')} style={{ opacity: ready ? 0 : 1, }} aria-hidden={ready}
            decoding="async" fetchPriority="high" loading="eager" />
        </picture>
        {Renderer && <div className={styles.renderer}
          role="group" aria-label={t('sculpture-rotation')} aria-describedby="sculpture-hint"
          tabIndex={ready ? 0 : -1}
          onKeyDown={event => {
            const steps: Record<string, [number, number]> = {
              ArrowLeft: [0, -0.15],
              ArrowRight: [0, 0.15],
              ArrowUp: [-0.15, 0],
              ArrowDown: [0.15, 0],
            };
            if (steps[event.key]) { event.preventDefault(); rotate(...steps[event.key]); }
          }}
          onPointerDown={event => {
            if (!ready || event.button !== 0) return;
            drag.current = { x: event.clientX, y: event.clientY, pointer: event.pointerId, };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={event => {
            if (!drag.current || drag.current.pointer !== event.pointerId) return;
            rotate(event.pointerType === 'touch' ? 0 : (event.clientY - drag.current.y) * 0.008,
              (event.clientX - drag.current.x) * 0.008);
            drag.current = { x: event.clientX, y: event.clientY, pointer: event.pointerId, };
          }}
          onPointerUp={() => { drag.current = null; }}
          onLostPointerCapture={() => { drag.current = null; }}
          onPointerCancel={() => { drag.current = null; }}>
          <RendererBoundary onUnavailable={unavailable}>
            <Renderer parameters={parameters} rotation={rotation} wireframe={wireframe}
              ready={ready} active={visible && foreground}
              mobile={mobile} reducedMotion={reducedMotion}
              onReady={onReady} onUnavailable={unavailable} />
          </RendererBoundary>
        </div>}
      </div>
      <div className={styles.status}>
        <span role="status">{t(`sculpture-status-${status}`)}</span>
        {status === 'idle' && <button className={styles.button} onClick={activate}>
          {t('sculpture-explore')}
        </button>}
      </div>
      <div className={styles.editor}>
        <p className={styles.syntax} aria-hidden="true">createRibbon({'{'}</p>
        <div className={styles.parameters}>
          {(Object.keys(DEFAULT_PARAMETERS) as Parameter[]).map(name => (
            <ParameterControl key={name} name={name} value={parameters[name]} disabled={!ready}
              onChange={value => {
                setParameters(previous => ({ ...previous, [name]: value, }));
              }} />
          ))}
        </div>
        <p className={styles.syntax} aria-hidden="true">{'})'}</p>
      </div>
      <div className={styles.toolbar}>
        <div role="group" aria-label={t('sculpture-mode')}>
          <button className={styles.button} disabled={!ready} aria-pressed={!wireframe}
            onClick={() => { setWireframe(false); }}>{t('sculpture-solid')}</button>
          <button className={styles.button} disabled={!ready} aria-pressed={wireframe}
            onClick={() => { setWireframe(true); }}>{t('sculpture-wireframe')}</button>
        </div>
        <button className={styles.button} disabled={!ready} onClick={() => {
          setParameters({ ...DEFAULT_PARAMETERS, });
          setRotation({ x: 0, y: 0, });
          setWireframe(false);
        }}>{t('sculpture-reset')}</button>
      </div>
      <p className={styles.hint} id="sculpture-hint">{t('sculpture-hint')}</p>
    </div>
  );
}
