import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { type LessonBlock } from '~/entities/Course/model/types/course';
import { serverUrl } from '~/shared/api/instance';

function mediaUrl (src: string) {
  if (!/^[\w.-]+$/.test(src)) return '';
  return `${serverUrl}/${src}`;
}

function TextBlock ({ heading, body, title, }: { heading: string; body: string; title?: string }) {
  return (
    <article className="lesson-text">
      {heading !== title && <h2>{heading}</h2>}
      <p>{body}</p>
    </article>
  );
}

function PictureBlock ({ src, alt, }: { src: string; alt: string }) {
  const url = mediaUrl(src);
  if (!url) return null;
  return (
    <figure className="lesson-picture">
      <img src={url} alt={alt} />
    </figure>
  );
}

function VideoBlock ({
  poster,
  title,
  caption,
}: {
  poster: string;
  title: string;
  caption: string;
}) {
  const { t, } = useTranslation();
  const url = mediaUrl(poster);
  return (
    <figure className="lesson-video">
      {url && <img src={url} alt="" />}
      <figcaption>
        <p className="eyebrow">{t('lesson-video')}</p>
        <h2>{title}</h2>
        <p>{caption}</p>
      </figcaption>
    </figure>
  );
}

function CodeBlock ({ language, code, }: { language: string; code: string }) {
  const { t, } = useTranslation();
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  useEffect(() => {
    if (copyState !== 'copied') return;
    const timer = setTimeout(() => {
      setCopyState('idle');
    }, 2200);
    return () => {
      clearTimeout(timer);
    };
  }, [copyState]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  };
  return (
    <figure className="lesson-code">
      <figcaption>
        <span className="eyebrow">
          {t('lesson-code')} / {language}
        </span>
        <button type="button" className="copy-code" onClick={copy}>
          <motion.span
            key={copyState}
            initial={{ opacity: 0, y: 3, }}
            animate={{ opacity: 1, y: 0, }}
            transition={{ duration: 0.16, }}
          >
            <span aria-hidden="true">{copyState === 'copied' ? '✓' : '⧉'}</span>{' '}
            {t(copyState === 'copied' ? 'copied' : 'copy-code')}
          </motion.span>
        </button>
      </figcaption>
      <pre tabIndex={0}>
        <code>{code}</code>
      </pre>
      <span className="copy-status" role="status">
        {copyState === 'error' ? t('copy-failed') : copyState === 'copied' ? t('copied') : ''}
      </span>
    </figure>
  );
}

function ConsoleBlock ({ command, output, }: { command: string; output: string }) {
  const { t, } = useTranslation();
  const [ran, setRan] = useState(false);
  return (
    <div className="lesson-console">
      <p className="eyebrow">{t('expected-output')}</p>
      <p className="demo-note">{t('output-note')}</p>
      <pre>
        <code>$ {command}</code>
      </pre>
      <button
        type="button"
        className="action"
        onClick={() => {
          setRan(true);
        }}
        disabled={ran}
      >
        {t('show-output')}
      </button>
      {ran && (
        <pre className="lesson-console-output" role="status">
          {output}
        </pre>
      )}
    </div>
  );
}

export function LessonBlocks ({ blocks, title, }: { blocks: LessonBlock[]; title?: string }) {
  return (
    <div className="lesson-blocks">
      {blocks.map((block, index) => {
        if (block.type === 'text') return <TextBlock key={index} {...block} title={title} />;
        if (block.type === 'picture') return <PictureBlock key={index} {...block} />;
        if (block.type === 'video') return <VideoBlock key={index} {...block} />;
        if (block.type === 'code') return <CodeBlock key={index} {...block} />;
        if (block.type === 'console') return <ConsoleBlock key={index} {...block} />;
        return null;
      })}
    </div>
  );
}
