import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useArtworkMorph } from './useArtworkMorph';

const push = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push, }), }));

function Card () {
  const morph = useArtworkMorph();
  return <article onClickCapture={event => { morph(event, 3); }}>
    <div data-course-art="3" />
    <a href="/course/3">Open</a>
  </article>;
}

test('a card click navigates while its artwork morphs into the course page', async () => {
  const original = window.matchMedia;
  window.matchMedia = jest.fn(() => ({ matches: false, })) as unknown as typeof matchMedia;
  const destination = document.createElement('div');
  destination.dataset.courseArt = '3';
  push.mockImplementation(() => { document.body.append(destination); });
  let named = '';
  Object.assign(document, {
    startViewTransition (update: () => Promise<void>) {
      const finished = update().then(() => { named = destination.style.viewTransitionName; });
      return { finished, };
    },
  });
  try {
    render(<Card />);
    expect(fireEvent.click(screen.getByText('Open'))).toBe(false);
    expect(push).toHaveBeenCalledWith('/course/3');
    await waitFor(() => { expect(named).toBe('course-art'); });
    await waitFor(() => { expect(destination.style.viewTransitionName).toBe(''); });
  } finally {
    delete (document as { startViewTransition?: unknown }).startViewTransition;
    window.matchMedia = original;
    destination.remove();
  }
});
