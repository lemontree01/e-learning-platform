import { type ReactNode } from 'react';
import { domAnimation, LazyMotion } from 'motion/react';

const loadFeatures = async () => {
  try {
    return (await import(/* webpackChunkName: "motion-features" */ './features')).default;
  } catch {
    // Animation is optional: links and view controls remain usable if its chunk fails.
    return domAnimation;
  }
};

export function MotionFeatures ({ children, }: { children: ReactNode }) {
  return <LazyMotion features={loadFeatures} strict>{children}</LazyMotion>;
}
