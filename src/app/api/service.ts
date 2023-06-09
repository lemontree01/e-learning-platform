import {
  type AxiosResponse
} from 'axios';
import { type Course } from '~/entities/Course';
import { $api } from '~/shared/api/instance';

export default class AppService {
  static async getCourses (
    lang: 'rus' | 'eng'
  ): Promise<AxiosResponse<Course[]>> {
    return await $api.get<Course[]>('/courses', {
      params: {
        lang,
      },
    });
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

  static async searchCourses (
    lang: 'rus' | 'eng', query: string
  ): Promise<AxiosResponse<Course[]>> {
    return await $api.get<Course[]>('/courses/search', {
      params: {
        lang,
        search: query,
      },
    });
  }
}
