import { createAsyncThunk } from '@reduxjs/toolkit';
import { type Course } from '../types/course';
import AppService from '../../api/courseServices';
import { getApiLanguage } from '../../api/getApiLanguage';

export const fetchCoursesByQuery =
createAsyncThunk<Course[], { query: string; lang: string }>(
  'courses/search',
  async (args, { signal, }) => {
    const response = await AppService.searchCourses(getApiLanguage(args.lang), args.query, signal);
    return response.data;
  }
);
