import { type ReducersMapObject, configureStore } from '@reduxjs/toolkit';
import { type ThunkExtraArg, type StateSchema } from './StateSchema';
import { courseReducer } from '~/entities/Course';
import { $api } from '~/shared/api/instance';
import { themeReducer } from '~/entities/Theme';
import { useDispatch } from 'react-redux';

export const createReduxStore = (
  initialState?: StateSchema
) => {
  const reducer: ReducersMapObject<StateSchema> = {
    course: courseReducer,
    theme: themeReducer,
  };

  const extraArg: ThunkExtraArg = {
    api: $api,
  };

  return configureStore({
    reducer,
    devTools: IS_DEV,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      thunk: {
        extraArgument: extraArg,
      },
    }),
  });
};

export type AppDispatch = ReturnType<typeof createReduxStore>['dispatch'];
export const useAppDispatch = () => useDispatch<AppDispatch>();
