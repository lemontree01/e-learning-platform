import {
  createSlice,
  type PayloadAction
} from '@reduxjs/toolkit';
import { type Course, type CourseSchema } from '../types/course';
import { Response } from '~/shared/types/Response';
import { fetchCourses } from '../services/fetchCourses';
import { fetchShortCourses } from '../services/fetchShortCourses';
import { fetchCoursesByQuery } from '../services/fetchCoursesByQuery';

const initialState: CourseSchema = {
  courses: [],
  searchedCourses: [],
  isSearched: false,
  status: Response.OK,
};

export const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCurrentCourse (state, action: PayloadAction<number>) {
      state.currentCourse = state.courses[action.payload];
    },
    setIsSearched (state, action: PayloadAction<boolean>) {
      state.isSearched = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchCourses.fulfilled,
        (state: CourseSchema, action: PayloadAction<Course[]>) => {
          state.status = Response.OK;
          state.courses = action.payload;
        }
      )
      .addCase(fetchCourses.pending, (state: CourseSchema) => {
        state.status = Response.LOADING;
      })
      .addCase(fetchCourses.rejected, (state: CourseSchema) => {
        state.status = Response.ERROR;
      })
      .addCase(
        fetchShortCourses.fulfilled,
        (state: CourseSchema, action: PayloadAction<Course[]>) => {
          state.status = Response.OK;
          state.courses = action.payload;
        }
      )
      .addCase(fetchShortCourses.pending, (state: CourseSchema) => {
        state.status = Response.LOADING;
      })
      .addCase(fetchShortCourses.rejected, (state: CourseSchema) => {
        state.status = Response.ERROR;
      })
      .addCase(
        fetchCoursesByQuery.pending, (state: CourseSchema) => {
          state.status = Response.LOADING;
        }
      )
      .addCase(
        fetchCoursesByQuery.fulfilled,
        (state: CourseSchema, action: PayloadAction<Course[]>) => {
          state.status = Response.OK;
          state.searchedCourses = action.payload;
        }
      );
  },
});

export const { actions: courseActions, } = courseSlice;
export const { reducer: courseReducer, } = courseSlice;
