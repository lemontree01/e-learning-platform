import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isAxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, type StateSchema } from '~/app/providers/StoreProvider';
import AppService from '../../api/courseServices';
import { getApiLanguage } from '../../api/getApiLanguage';
import { courseActions } from '../slice/courseSlice';
import { type CourseLoadStatus } from './useCourse';

function validId (id: string | undefined): id is string {
  return id !== undefined && /^\d+$/.test(id) && Number.isSafeInteger(Number(id));
}

export function useLesson (courseId: string | undefined, lessonId: string | undefined) {
  const { i18n, } = useTranslation();
  const language = getApiLanguage(i18n.resolvedLanguage ?? i18n.language);
  const dispatch = useAppDispatch();
  const valid = validId(courseId) && validId(lessonId);
  const key = `${language}:${Number(courseId)}:${Number(lessonId)}`;
  const lesson = useSelector((state: StateSchema) =>
    valid ? state.course.lessonDetails?.[key] : undefined
  );
  const [failure, setFailure] = useState<{ key: string; status: CourseLoadStatus }>();
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!valid || courseId === undefined || lessonId === undefined || lesson) return;

    const controller = new AbortController();
    setFailure(undefined);
    AppService.getLesson(courseId, lessonId, language, controller.signal)
      .then(({ data, }) => {
        if (!controller.signal.aborted) {
          dispatch(courseActions.cacheLesson({ key, lesson: data, }));
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setFailure({
            key,
            status: isAxiosError(error) && error.response?.status === 404 ? 'not-found' : 'error',
          });
        }
      });
    return () => { controller.abort(); };
  }, [courseId, lessonId, language, key, valid, lesson, dispatch, attempt]);

  const status: CourseLoadStatus = !valid
    ? 'not-found'
    : lesson ? 'ready' : failure?.key === key ? failure.status : 'loading';
  const retry = () => {
    setFailure(undefined);
    setAttempt(previous => previous + 1);
  };
  return { lesson, status, retry, };
}
