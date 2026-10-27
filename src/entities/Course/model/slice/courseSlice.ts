import {
  createSlice,
  isAnyOf,
  type PayloadAction
} from '@reduxjs/toolkit';
import { type Course, type CourseLesson, type CourseSchema } from '../types/course';
import { Response } from '~/shared/types/Response';
import { fetchCourses } from '../services/fetchCourses';
import { fetchShortCourses } from '../services/fetchShortCourses';
import { fetchCoursesByQuery } from '../services/fetchCoursesByQuery';
import { getCatalogKey } from '../catalogKey';

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
      .addMatcher(
        isAnyOf(fetchCourses.pending, fetchCoursesByQuery.pending, fetchShortCourses.pending),
        (state, action) => {
          state.catalogKey = fetchCoursesByQuery.pending.match(action)
            ? getCatalogKey(action.meta.arg.lang, action.meta.arg.query)
            : fetchCourses.pending.match(action)
              ? getCatalogKey(action.meta.arg)
              : 'short:eng';
          state.catalogRequestId = action.meta.requestId;
          state.status = Response.LOADING;
        }
      )
      .addMatcher(
        isAnyOf(fetchCourses.fulfilled, fetchCoursesByQuery.fulfilled, fetchShortCourses.fulfilled),
        (state, action) => {
          if (state.catalogRequestId !== action.meta.requestId) return;
          state.catalogRequestId = undefined;
          state.status = Response.OK;
          state.courses = action.payload;
        }
      )
      .addMatcher(
        isAnyOf(fetchCourses.rejected, fetchCoursesByQuery.rejected, fetchShortCourses.rejected),
        (state, action) => {
          if (state.catalogRequestId !== action.meta.requestId) return;
          state.catalogRequestId = undefined;
          if (!action.meta.aborted) state.status = Response.ERROR;
        }
      );
  },
});

export const { actions: courseActions, } = courseSlice;
export const { reducer: courseReducer, } = courseSlice;
