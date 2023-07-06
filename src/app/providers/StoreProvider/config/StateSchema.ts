import {
  type EnhancedStore,
  type CombinedState,
  type ReducersMapObject,
  type AnyAction,
  type Reducer
} from '@reduxjs/toolkit';
import { type AxiosInstance } from 'axios';
import { type CourseSchema } from '~/entities/Course/model/types/course';
import { type ThemeSchema } from '~/entities/Theme/model/types/theme';

export interface StateSchema {
  course: CourseSchema;
  theme: ThemeSchema;
}

export type StateSchemaKey = keyof StateSchema;

export interface ReducerManager {
  getReducerMap: () => ReducersMapObject<StateSchema>;
  reduce: (state: StateSchema, action: AnyAction) => CombinedState<StateSchema>;
  add: (key: StateSchemaKey, reducer: Reducer) => void;
  remove: (key: StateSchemaKey) => void;
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
  reducerManager: ReducerManager;
}

export interface ThunkExtraArg {
  api: AxiosInstance;
}

export interface ThunkConfig<T> {
  rejectValue: T;
  extra: ThunkExtraArg;
}
