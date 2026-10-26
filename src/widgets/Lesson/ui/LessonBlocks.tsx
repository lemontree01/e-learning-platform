import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type LessonBlock } from '~/entities/Course/model/types/course';
import { serverUrl } from '~/shared/api/instance';

function mediaUrl (src: string) {
  if (!/^[\w.-]+$/.test(src)) return '';
  return `${serverUrl}/${src}`;
}

function TextBlock ({ heading, body, }: { heading: string; body: string }) {
  return <article className='lesson-text'>
    <h2>{heading}</h2>
    <p>{body}</p>
  </article>;
}

function PictureBlock ({ src, alt, }: { src: string; alt: string }) {
  const url = mediaUrl(src);
  if (!url) return null;
  return <figure className='lesson-picture'>
    <img src={url} alt={alt} />
  </figure>;
}

function VideoBlock ({
  poster, title, caption,
}: { poster: string; title: string; caption: string }) {
  const { t, } = useTranslation();
  const url = mediaUrl(poster);
  return <figure className='lesson-video'>
    {url && <img src={url} alt='' />}
    <figcaption>
      <p className='eyebrow'>{t('lesson-video')}</p>
      <h2>{title}</h2>
      <p>{caption}</p>
    </figcaption>
  </figure>;
}

function CodeBlock ({ language, code, }: { language: string; code: string }) {
  const { t, } = useTranslation();
  return <figure className='lesson-code'>
    <figcaption className='eyebrow'>{t('lesson-code')} / {language}</figcaption>
    <pre><code>{code}</code></pre>
  </figure>;
}

function ConsoleBlock ({ command, output, }: { command: string; output: string }) {
  const { t, } = useTranslation();
  const [ran, setRan] = useState(false);
  return <div className='lesson-console'>
    <p className='eyebrow'>{t('lesson-console')}</p>
    <pre><code>$ {command}</code></pre>
    <button type='button' className='action' onClick={() => { setRan(true); }} disabled={ran}>
      {t('lesson-run')}
    </button>
    {ran && <pre className='lesson-console-output'>{output}</pre>}
  </div>;
}

export function LessonBlocks ({ blocks, }: { blocks: LessonBlock[] }) {
  return <div className='lesson-blocks'>
    {blocks.map((block, index) => {
      if (block.type === 'text') return <TextBlock key={index} {...block} />;
      if (block.type === 'picture') return <PictureBlock key={index} {...block} />;
      if (block.type === 'video') return <VideoBlock key={index} {...block} />;
      if (block.type === 'code') return <CodeBlock key={index} {...block} />;
      if (block.type === 'console') return <ConsoleBlock key={index} {...block} />;
      return null;
    })}
  </div>;
}
