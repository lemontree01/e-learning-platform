import {
  lazy
} from 'react';

export const TeachersPageAsync = lazy(async () =>
  await import('./TeachersPage'));
