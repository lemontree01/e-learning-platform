import { useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import AppService from '../../api/courseServices';
import { getApiLanguage } from '../../api/getApiLanguage';
import { type Course } from '../types/course';

export type CourseLoadStatus = 'loading' | 'ready' | 'not-found' | 'error';

export function useCourse (id: string | undefined) {
  const { i18n, } = useTranslation();
  const language = getApiLanguage(i18n.resolvedLanguage ?? i18n.language);
  const [course, setCourse] = useState<Course>();
  const [status, setStatus] = useState<CourseLoadStatus>('loading');
  const shownId = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (id === undefined || !/^\d+$/.test(id) || !Number.isSafeInteger(Number(id))) {
      shownId.current = undefined;
      setCourse(undefined);
      setStatus('not-found');
      return;
    }

    const numericId = Number(id);
    const controller = new AbortController();
    if (shownId.current !== numericId) {
      setCourse(undefined);
      setStatus('loading');
    }
    AppService.getCourse(id, language, controller.signal)
      .then(({ data, }) => {
        if (!controller.signal.aborted) {
          shownId.current = data.id;
          setCourse(data);
          setStatus('ready');
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setStatus(isAxiosError(error) && error.response?.status === 404 ? 'not-found' : 'error');
        }
      });
    return () => { controller.abort(); };
  }, [id, language]);

  return { course, status, };
}
