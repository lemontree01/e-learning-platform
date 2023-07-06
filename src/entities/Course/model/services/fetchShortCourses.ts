import { createAsyncThunk } from '@reduxjs/toolkit';
import { type Course } from '../types/course';
import AppService from '../../api/courseServices';

export const fetchShortCourses = createAsyncThunk<Course[], void>(
  'courses/short',
  async () => {
    const response = await AppService.getShortCourses('eng');
    return response.data;
  }
);
