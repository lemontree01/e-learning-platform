import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isAxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, type StateSchema } from '~/app/providers/StoreProvider';
import AppService from '../../api/courseServices';
import { getApiLanguage, type ApiLanguage } from '../../api/getApiLanguage';
import { courseActions } from '../slice/courseSlice';
import { type Course } from '../types/course';

export type CourseLoadStatus = 'loading' | 'ready' | 'not-found' | 'error';

export function useCourse (
  id: string | undefined,
  seed?: { language: ApiLanguage; course: Course }
) {
  const { i18n, } = useTranslation();
  const language = getApiLanguage(i18n.resolvedLanguage ?? i18n.language);
  const dispatch = useAppDispatch();
  const validId = id !== undefined && /^\d+$/.test(id) && Number.isSafeInteger(Number(id));
  const key = `${language}:${Number(id)}`;
  const stored = useSelector((state: StateSchema) =>
    validId ? state.course.details?.[key] : undefined
  );
  const seeded = seed?.language === language && validId && seed.course.id === Number(id)
    ? seed.course
    : undefined;
  const course = stored ?? seeded;
  const [failure, setFailure] = useState<{ key: string; status: CourseLoadStatus }>();

  useEffect(() => {
    if (!validId || id === undefined || course) return;

    const controller = new AbortController();
    setFailure(undefined);
    AppService.getCourse(id, language, controller.signal)
      .then(({ data, }) => {
        if (!controller.signal.aborted) {
          dispatch(courseActions.cacheCourse({ key, course: data, }));
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
  }, [id, language, key, validId, course, dispatch]);

  const status: CourseLoadStatus = !validId
    ? 'not-found'
    : course ? 'ready' : failure?.key === key ? failure.status : 'loading';
  return { course, status, };
}
