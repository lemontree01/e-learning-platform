import { createAsyncThunk } from '@reduxjs/toolkit';
import { type Course } from '../types/course';
import AppService from '../../api/courseServices';

export const fetchCoursesByQuery =
createAsyncThunk<Course[], { query: string; lang: 'rus' | 'eng' }>(
  'courses/search',
  async (args: { query: string; lang: 'rus' | 'eng' }) => {
    const response = await AppService.searchCourses(args.lang, args.query);
    return response.data;
  }
);
