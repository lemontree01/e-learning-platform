import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import themeSlice from "./features/themeSlice";
import userSlice from "./features/userSlice";
import coursesSlice from "./features/coursesSlice";

export const store = configureStore({
  reducer: {
    theme: themeSlice,
    user: userSlice,
    courses: coursesSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
