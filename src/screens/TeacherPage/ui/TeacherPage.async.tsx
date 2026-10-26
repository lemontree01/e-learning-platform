import {
  lazy
} from 'react';

export const TeacherPageAsync = lazy(async () => await import('./TeacherPage'));
