import {
  lazy
} from 'react';

export const CoursesPageAsync = lazy(async () => await import('./CoursesPage'));
