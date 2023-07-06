import { createAsyncThunk } from '@reduxjs/toolkit';
import { type Course } from '../types/course';
import AppService from '../../api/courseServices';

export const fetchCoursesByQuery =
createAsyncThunk<Course[], { query: string }>(
  'courses/search',
  async (args: { query: string }) => {
    const response = await AppService.searchCourses('eng', args.query);
    return response.data;
  }
);
