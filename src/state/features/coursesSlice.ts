import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import AppService from "../../api/service";

export type Course = {
  author: string;
  date: string;
  numberOfLessons: number;
  name: string;
  id: number
};

type CoursesState = {
  courses: Course[];
  status: "ok" | "loading" | "error";
};

const initialState: CoursesState = {
  courses: [],
  status: "loading",
};

export const getCourses = createAsyncThunk<Course[], void>(
  "courses",
  async () => {
    const response = await AppService.getCourses("eng");
    return response.data;
  }
);

export const getShortCourses = createAsyncThunk<Course[], void>(
  "courses/short",
  async () => {
    const response = await AppService.getShortCourses("eng");
    return response.data;
  }
);

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getCourses.fulfilled,
      (state: CoursesState, action: PayloadAction<Course[]>) => {
        state.status = "ok";
        state.courses = action.payload;
      }
    )
    .addCase(getCourses.pending, (state: CoursesState) => {
    })
    .addCase(getCourses.rejected, (state: CoursesState) => {
      state.status = "error";
    })
    .addCase(
      getShortCourses.fulfilled,
      (state: CoursesState, action: PayloadAction<Course[]>) => {
        state.status = "ok";
        state.courses = action.payload;
      }
    )
    .addCase(getShortCourses.pending, (state: CoursesState) => {
      state.status = "loading";
    })
    .addCase(getShortCourses.rejected, (state: CoursesState) => {
      state.status = "error";
    });
  },
});

export default coursesSlice.reducer;
