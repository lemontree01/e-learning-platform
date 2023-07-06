import { createAsyncThunk } from '@reduxjs/toolkit';
import { type Course } from '../types/course';
import AppService from '../../api/courseServices';

export const fetchCourses = createAsyncThunk<Course[], string>(
  'courses',
  async (language: string) => {
    if (language === 'en') {
      const response = await AppService.getCourses('eng');
      return response.data;
    } else {
      const response = await AppService.getCourses('rus');
      return response.data;
    }
  }
);
