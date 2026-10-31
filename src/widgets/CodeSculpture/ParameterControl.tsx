import { useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { normalizeParameter, PARAMETERS, type Parameter } from './model/ribbon';
import styles from './CodeSculpture.module.scss';

export function ParameterControl ({ name, value, disabled, onChange, }: {
  name: Parameter;
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  const { t, } = useTranslation();
  const id = useId();
  const [draft, setDraft] = useState(String(value));
  useEffect(() => { setDraft(String(value)); }, [value]);
  const bounds = PARAMETERS[name];
  return (
    <div className={styles.parameter}>
      <div className={styles['code-value']}>
        <label htmlFor={id}>{name}:</label>
        <input id={id} type="number" inputMode={name === 'spread' ? 'decimal' : undefined}
          aria-label={t(`sculpture-${name}-value`)} {...bounds} value={draft} disabled={disabled}
          onChange={event => {
            const text = event.target.value;
            setDraft(text);
            const parsed = Number(text);
            if (text && Number.isFinite(parsed) && parsed >= bounds.min && parsed <= bounds.max) {
              onChange(normalizeParameter(name, parsed));
            }
          }}
          onBlur={() => {
            const next = normalizeParameter(name, draft.trim() ? Number(draft) : value);
            setDraft(String(next));
            onChange(next);
          }} />
      </div>
      <input type="range" aria-label={t(`sculpture-${name}`)} {...bounds} value={value}
        aria-valuetext={name === 'twist' ? `${value}°` : String(value)} disabled={disabled}
        onChange={event => { onChange(normalizeParameter(name, Number(event.target.value))); }} />
    </div>
  );
}
