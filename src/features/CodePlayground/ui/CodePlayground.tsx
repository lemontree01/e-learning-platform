import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { startRun } from '../model/runner';
import { INPUT_LIMIT, type Language, type RunStatus } from '../model/protocol';
import { CodeEditor } from './CodeEditor';
import { PlaygroundIcon } from './PlaygroundIcon';
import './code-playground.scss';

export default function CodePlayground ({ initialLanguage, initialCode, starters, expected, }: {
  initialLanguage: Language; initialCode: string;
  starters?: Partial<Record<Language, string>>;
  expected?: { command: string; output: string };
}) {
  const { t, } = useTranslation();
  const [language, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(initialCode);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<RunStatus | 'idle' | 'loading' | 'running'>('idle');
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const run = useRef<ReturnType<typeof startRun> | null>(null);
  const version = useRef(0);
  const inputId = useId();
  const busy = status === 'loading' || status === 'running';
  useEffect(() => () => { version.current++; run.current?.stop(); }, []);
  useEffect(() => {
    if (copyState === 'idle') return;
    const timer = setTimeout(() => { setCopyState('idle'); }, 2200);
    return () => { clearTimeout(timer); };
  }, [copyState]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState('copied');
    } catch { setCopyState('error'); }
  };
  const stop = () => { version.current++; run.current?.stop(); setStatus('stopped'); };
  const reset = (next = language) => {
    version.current++;
    run.current?.stop();
    setLanguage(next);
    setCode(next === initialLanguage ? initialCode : starters?.[next] ?? '');
    setOutput('');
    setStatus('idle');
  };
  const execute = () => {
    const current = ++version.current;
    setOutput('');
    setStatus('loading');
    const handle = startRun(language, code, input, () => {
      if (version.current === current) setStatus('running');
    });
    run.current = handle;
    void handle.result.then(result => {
      if (version.current !== current) return;
      setOutput(result.output);
      setStatus(result.status);
    });
  };
  return <div className="lesson-code code-playground" role="group" aria-label={t('code-example')}>
    <div className="playground-toolbar">
      <div className="playground-heading">
        <PlaygroundIcon name="code" />
        <span>{t('code-example')}</span>
      </div>
      <div className="playground-tools">
        <select aria-label={t('code-language')} value={language}
          onChange={event => { reset(event.target.value as Language); }}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
        <button type="button" className="playground-quiet" onClick={copy}>
          <PlaygroundIcon name="copy" />
          {t(copyState === 'copied' ? 'copied' : 'copy-code')}
        </button>
      </div>
    </div>
    <div className="playground-workspace">
      <div className="playground-source">
        <p className="playground-caption">{t('code-edit-hint')}</p>
        <CodeEditor value={code} language={language} label={t('code-editor')} onChange={setCode} />
        <details className="playground-input">
          <summary>{t('code-program-input')} <span>{t('code-optional')}</span></summary>
          <label htmlFor={inputId}>{t('code-input')}</label>
          <textarea id={inputId} value={input} maxLength={INPUT_LIMIT}
            placeholder={t('code-input-placeholder')}
            onChange={event => { setInput(event.target.value); }} rows={2} spellCheck={false} />
        </details>
        <div className="playground-actions">
          <button type="button" className="action" onClick={execute} disabled={busy}>
            <PlaygroundIcon name="play" />{t('code-run')}
          </button>
          {busy && <button type="button" className="playground-quiet" onClick={stop}>
            <PlaygroundIcon name="stop" />{t('code-stop')}
          </button>}
          <button type="button" className="playground-quiet" onClick={() => { reset(); }}>
            <PlaygroundIcon name="reset" />{t('code-reset')}
          </button>
        </div>
      </div>
      <div className="playground-results">
        <div className="playground-output-heading">
          <span><PlaygroundIcon name="terminal" />{t('code-output')}</span>
          <span role="status" className="playground-status" data-status={status}>
            {t(`code-status-${status}`)}
          </span>
        </div>
        <div className={`playground-output${!output ? ' playground-output-empty' : ''}`}>
          {!output && <PlaygroundIcon name="terminal" />}
          <pre tabIndex={0} aria-label={t('code-output')} data-testid="code-output">
            {output || t(status === 'completed' ? 'code-no-output' : 'code-output-placeholder')}
          </pre>
        </div>
        {expected && <details className="playground-expected">
          <summary>{t('expected-output')}<span>{t('code-compare')}</span></summary>
          <p>{t('code-reference-note')}</p>
          <code className="reference-command">$ {expected.command}</code>
          <pre tabIndex={0} aria-label={t('expected-output')}>{expected.output}</pre>
        </details>}
      </div>
    </div>
    <div className="playground-footer">
      <span>{t('code-browser-note')}</span>
      <details className="playground-safety">
        <summary>{t('code-runtime-details')}</summary>
        <p>{t('code-safety-note')}</p>
      </details>
      <span className="playground-copy-status" aria-live="polite">
        {copyState === 'error' ? t('copy-failed') : copyState === 'copied' ? t('copied') : ''}
      </span>
    </div>
  </div>;
}
