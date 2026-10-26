import { type Color } from '~/shared/types/Color';
import { DEFAULT_THEME } from '~/shared/config/themes';
import { type ThemeSchema } from '../types/theme';
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: ThemeSchema = {
  color: DEFAULT_THEME,
  isSidebarShown: false,
  isUserShown: false,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeColor: (state, action: PayloadAction<Color>) => {
      state.color = action.payload;
    },
    setIsSidebarShown: (state, action: PayloadAction<boolean>) => {
      state.isSidebarShown = action.payload;
    },
    setIsUserShown: (state, action: PayloadAction<boolean>) => {
      state.isUserShown = action.payload;
    },
  },
});

export const { actions: themeActions, } = themeSlice;
export const { reducer: themeReducer, } = themeSlice;
