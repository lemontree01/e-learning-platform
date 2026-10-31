const paths = {
  play: 'm8 5 11 7-11 7V5Z',
  stop: 'M6 6h12v12H6z',
  copy: 'M9 9h11v11H9z M15 9V4H4v11h5',
  reset: 'M3 10a9 9 0 1 1 2 8 M3 4v6h6',
  code: 'm8 6-6 6 6 6 m8-12 6 6-6 6 M14.5 4l-5 16',
  chevron: 'm6 9 6 6 6-6',
  terminal: 'm4 5 6 6-6 6 m9 1h7',
};

export function PlaygroundIcon ({ name, }: { name: keyof typeof paths }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d={paths[name]} />
  </svg>;
}
