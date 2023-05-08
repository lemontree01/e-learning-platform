import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AppColor = "light" | "dark" | "system";

type Theme = {
  color: AppColor
};

const initialThemeState: Theme = {
  color: "light",
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
    }
  },
});

export const { changeColor, toggleColor } = themeSlice.actions
export default themeSlice.reducer