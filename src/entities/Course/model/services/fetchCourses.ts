import { createAsyncThunk } from '@reduxjs/toolkit';
import { type Course } from '../types/course';
import AppService from '../../api/courseServices';
import { getApiLanguage } from '../../api/getApiLanguage';

export const fetchCourses = createAsyncThunk<Course[], string>(
  'courses',
  async (language: string, { signal, }) => {
    const response = await AppService.getCourses(getApiLanguage(language), signal);
    return response.data;
  }
);
