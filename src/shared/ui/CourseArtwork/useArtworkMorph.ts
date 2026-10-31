import { type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';

const NAME = 'course-art';
// The page stays frozen on its old snapshot meanwhile, so never wait long for the destination.
const WAIT = 800;

// Resolves with the course page's artwork once it has replaced the card's, or null on timeout.
async function arrival (id: number, from: Element) {
  return await new Promise<HTMLElement | null>(resolve => {
    const find = () => [...document.querySelectorAll<HTMLElement>(`[data-course-art="${id}"]`)]
      .find(element => element !== from);
    const done = (element: HTMLElement | null) => {
      observer.disconnect();
      clearTimeout(timer);
      resolve(element);
    };
    const observer = new MutationObserver(() => { const to = find(); if (to) done(to); });
    const timer = setTimeout(() => { done(find() ?? null); }, WAIT);
    observer.observe(document.body, { childList: true, subtree: true, });
  });
}

// Opens a course inside a native view transition so the card artwork grows into the course
// page artwork. Plain clicks only; everything else keeps ordinary link behaviour.
export function useArtworkMorph () {
  const router = useRouter();
  return (event: MouseEvent<HTMLElement>, id: number) => {
    const link = (event.target as Element).closest('a');
    const from = event.currentTarget.querySelector<HTMLElement>(`[data-course-art="${id}"]`);
    if (!link || !from || link.pathname !== `/course/${id}` || link.target ||
      event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
      !('startViewTransition' in document) ||
      matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    event.preventDefault();
    let to: HTMLElement | null = null;
    from.style.viewTransitionName = NAME;
    const transition = document.startViewTransition(async () => {
      // The old snapshot is taken; names must stay unique while the new page mounts.
      from.style.viewTransitionName = '';
      router.push(link.pathname);
      to = await arrival(id, from);
      if (to) to.style.viewTransitionName = NAME;
    });
    // Unnamed again afterwards, so later transitions (theme wipe) keep it in the page snapshot.
    transition.finished.finally(() => {
      from.style.viewTransitionName = '';
      if (to) to.style.viewTransitionName = '';
    });
  };
}
