import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AppColor = "light" | "dark" | "system";

type Theme = {
  color: AppColor
  isSideBarShown: boolean 
};

const initialThemeState: Theme = {
  color: "light",
  isSideBarShown: false
};

const themeSlice = createSlice({
  name: "theme",
  initialState: initialThemeState,
  reducers: {
    changeColor(state, action: PayloadAction<AppColor>) {
      state.color = action.payload;
    },
    toggleColor(state) {
      state.color = state.color === "light" ? "dark" : "light"
    },
    toggleSidebar(state) {
      state.isSideBarShown = !state.isSideBarShown
    }
  },
});

export const { changeColor, toggleColor, toggleSidebar } = themeSlice.actions
export default themeSlice.reducer