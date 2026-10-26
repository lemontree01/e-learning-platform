import {
  type AxiosResponse
} from 'axios';
import {
  $api
} from '~/shared/api/instance';
import { type Course, type CourseLesson } from '../model/types/course';
import { type ApiLanguage } from './getApiLanguage';

export default class AppService {
  static async getCourses (
    lang: ApiLanguage, signal?: AbortSignal
  ): Promise<AxiosResponse<Course[]>> {
    return await $api.get<Course[]>('/courses', {
      params: {
        lang,
      },
      signal,
    });
  }

  static async getCourse (
    id: string, lang: ApiLanguage, signal?: AbortSignal
  ): Promise<AxiosResponse<Course>> {
    return await $api.get<Course>(`/courses/${id}`, { params: { lang, }, signal, });
  }

  static async getShortCourses (
    lang: 'rus' | 'eng'
  ): Promise<AxiosResponse<Course[]>> {
    return await $api.get<Course[]>('/courses/short', {
      params: {
        lang,
      },
    });
  }

  static async getLesson (
    courseId: string, lessonId: string, lang: ApiLanguage, signal?: AbortSignal
  ): Promise<AxiosResponse<CourseLesson>> {
    return await $api.get<CourseLesson>(`/courses/${courseId}/lessons/${lessonId}`, {
      params: { lang, }, signal,
    });
  }

  static async searchCourses (
    lang: ApiLanguage, query: string, signal?: AbortSignal
  ): Promise<AxiosResponse<Course[]>> {
    return await $api.get<Course[]>('/courses/search', {
      params: {
        lang,
        search: query,
      },
      signal,
    });
  }
}
