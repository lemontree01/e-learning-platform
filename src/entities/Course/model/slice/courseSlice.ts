import {
  createSlice,
  type PayloadAction
} from '@reduxjs/toolkit';
import { type Course, type CourseLesson, type CourseSchema } from '../types/course';
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
    cacheLesson (state, action: PayloadAction<{ key: string; lesson: CourseLesson }>) {
      state.lessonDetails ??= {};
      state.lessonDetails[action.payload.key] = action.payload.lesson;
    },
    cacheCourse (state, action: PayloadAction<{ key: string; course: Course }>) {
      state.details ??= {};
      state.details[action.payload.key] = action.payload.course;
    },
    setCurrentCourse (state, action: PayloadAction<Course>) {
      state.currentCourse = action.payload;
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
        if (state.courses.length === 0) state.status = Response.LOADING;
      })
      .addCase(fetchCourses.rejected, (state: CourseSchema, action) => {
        if (!action.meta.aborted) state.status = Response.ERROR;
      })
      .addCase(
        fetchShortCourses.fulfilled,
        (state: CourseSchema, action: PayloadAction<Course[]>) => {
          state.status = Response.OK;
          state.courses = action.payload;
        }
      )
      .addCase(fetchShortCourses.pending, (state: CourseSchema) => {
        if (state.courses.length === 0) state.status = Response.LOADING;
      })
      .addCase(fetchShortCourses.rejected, (state: CourseSchema) => {
        state.status = Response.ERROR;
      })
      .addCase(
        fetchCoursesByQuery.pending, (state: CourseSchema) => {
          if (state.courses.length === 0) state.status = Response.LOADING;
        }
      )
      .addCase(
        fetchCoursesByQuery.fulfilled,
        (state: CourseSchema, action: PayloadAction<Course[]>) => {
          state.status = Response.OK;
          state.courses = action.payload;
        }
      )
      .addCase(fetchCoursesByQuery.rejected, (state: CourseSchema, action) => {
        if (!action.meta.aborted) state.status = Response.ERROR;
      });
  },
});

export const { actions: courseActions, } = courseSlice;
export const { reducer: courseReducer, } = courseSlice;
