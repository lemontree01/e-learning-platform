interface Props { time: number; fixed: boolean }

export function ObservatoryMachine ({ time, fixed, }: Props) {
  const progress = Math.min(time / 1100, 1);
  const angle = progress * Math.PI * 2;
  return <svg viewBox='0 0 600 410' fill='none' aria-hidden='true'>
    <defs>
      <pattern id='instrument-grid' width='32' height='32' patternUnits='userSpaceOnUse'
        patternTransform='matrix(1 .45 -1 .45 300 10)'>
        <path d='M32 0H0V32' stroke='var(--line)' strokeWidth='.7' />
      </pattern>
    </defs>
    <path d='M0 0H600V410H0Z' fill='url(#instrument-grid)' />
    <ellipse cx='300' cy='300' rx='185' ry='72' fill='var(--line)' opacity='.5' />
    <path d='M113 228L300 126L487 228V253L300 355L113 253Z'
      fill='var(--surface)' stroke='var(--muted)' />
    <path d='M113 228L300 331L487 228M300 331V355' stroke='var(--muted)' />
    <path d='M137 228L300 139L463 228L300 317Z' fill='var(--raised)' stroke='var(--muted)' />
    <path d='M157 228L300 150L443 228L300 306Z' stroke='var(--line)' />
    {[0, 1, 2].map((level) => <g key={level} transform={`translate(0 ${-level * 22})`}>
      <ellipse cx='300' cy='218' rx='128' ry='61' stroke='var(--line)' strokeWidth='12' />
      <ellipse cx='300' cy='213' rx='128' ry='61' stroke='var(--ink)' strokeWidth='7' />
    </g>)}
    <path d='M254 165L300 140L346 165V245L300 272L254 245Z'
      fill='var(--raised)' stroke='var(--muted)' />
    <path d='M254 165L300 191L346 165M300 191V272' stroke='var(--muted)' />
    <path d='M267 162L300 144L333 162L300 180Z' fill='var(--ink)' stroke='var(--muted)' />
    <path d='M282 162L295 155L308 162L295 169Z' fill='var(--surface)' />
    <circle cx={300 + Math.cos(angle) * 128} cy={169 + Math.sin(angle) * 61}
      r='7' fill={fixed ? 'var(--positive)' : 'var(--accent)'}
      stroke='var(--ink)' strokeWidth='2' />
    <path d='M111 227L65 202V131L132 94M487 228L539 200V130L473 94'
      stroke='var(--muted)' />
    <path d='M135 95L181 120V164M465 95L419 120V164' stroke='var(--ink)' strokeDasharray='4 5' />
    <path d='M70 80L116 55L162 80V105L116 131L70 105Z' fill='var(--raised)' stroke='var(--muted)' />
    <path d='M70 80L116 106L162 80M116 106V131' stroke='var(--muted)' />
    <text x='116' y='88' fill='var(--ink)' textAnchor='middle'
      fontSize='21' fontFamily='inherit'>JS</text>
    <path d='M438 80L484 55L530 80V105L484 131L438 105Z'
      fill='var(--raised)' stroke='var(--muted)' />
    <path d='M438 80L484 106L530 80M484 106V131' stroke='var(--muted)' />
    <text x='484' y='88' fill='var(--ink)' textAnchor='middle'
      fontSize='18' fontFamily='inherit'>UI</text>
    <circle cx='300' cy='320' r='3' fill='var(--ink)' />
    <path d='M300 359V385M291 379L300 385L309 379' stroke='var(--muted)' />
    <text x='37' y='163' fill='var(--muted)' fontSize='9'
      fontFamily='inherit' letterSpacing='2'>INPUT</text>
    <text x='510' y='163' fill='var(--muted)' fontSize='9'
      fontFamily='inherit' letterSpacing='2'>STATE</text>
    <text x='300' y='402' fill='var(--muted)' fontSize='9' textAnchor='middle'
      fontFamily='inherit' letterSpacing='3'>THE ASYNC ENGINE</text>
  </svg>;
}
