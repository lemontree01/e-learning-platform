import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import type { Language } from '../model/protocol';

const highlighting = HighlightStyle.define([
  { tag: [tags.keyword, tags.modifier], color: 'var(--syntax-keyword)', },
  { tag: [tags.string, tags.regexp], color: 'var(--syntax-string)', },
  { tag: [tags.number, tags.bool, tags.null], color: 'var(--syntax-number)', },
  {
    tag: [tags.function(tags.variableName), tags.function(tags.propertyName)],
    color: 'var(--syntax-function)',
  },
  {
    tag: [tags.definition(tags.variableName), tags.className],
    color: 'var(--syntax-definition)',
  },
  { tag: [tags.propertyName, tags.attributeName], color: 'var(--syntax-property)', },
  { tag: [tags.typeName, tags.namespace], color: 'var(--syntax-type)', },
  { tag: tags.comment, color: 'var(--muted)', fontStyle: 'italic', },
  { tag: tags.punctuation, color: 'var(--muted)', }
]);

export function CodeEditor ({ value, language, label, onChange, }: {
  value: string; language: Language; label: string; onChange: (value: string) => void;
}) {
  const { t, } = useTranslation('editor');
  const phrases = useMemo(
    () => t('phrases', { returnObjects: true, }) as Record<string, string>, [t]
  );
  const container = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const initial = useRef(value);
  initial.current = value;
  useEffect(() => {
    if (!container.current) return;
    const editor = new EditorView({
      parent: container.current,
      state: EditorState.create({
        doc: initial.current,
        extensions: [
          basicSetup,
          EditorState.phrases.of(phrases),
          language === 'python' ? python() : javascript(),
          syntaxHighlighting(highlighting),
          EditorView.lineWrapping,
          EditorView.contentAttributes.of({ 'aria-label': label, spellcheck: 'false', }),
          EditorView.updateListener.of(update => {
            if (update.docChanged) onChange(update.state.doc.toString());
          }),
          EditorView.theme({
            '&': { color: 'var(--ink)', backgroundColor: 'var(--surface)', },
            '.cm-content': { caretColor: 'var(--ink)', },
            '.cm-cursor': { borderLeftColor: 'var(--ink)', },
            '.cm-gutters': {
              color: 'var(--muted)',
              backgroundColor: 'var(--surface)',
              borderRight: '1px solid var(--line)',
            },
            '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: 'var(--raised)', },
            '.cm-gutterElement': { paddingInline: '0.8rem', },
            '.cm-tooltip': {
              color: 'var(--ink)',
              backgroundColor: 'var(--raised)',
              border: '1px solid var(--control-line)',
            },
            '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
              backgroundColor: 'var(--control-line)', opacity: '0.35',
            },
          })
        ],
      }),
    });
    view.current = editor;
    return () => { view.current = null; editor.destroy(); };
  }, [language, label, onChange, phrases]);
  useEffect(() => {
    const editor = view.current;
    if (editor && editor.state.doc.toString() !== value) {
      editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: value, }, });
    }
  }, [value]);
  return <div className="playground-editor" ref={container} />;
}
