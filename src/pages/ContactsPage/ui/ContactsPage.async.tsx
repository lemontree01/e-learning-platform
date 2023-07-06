import {
  lazy
} from 'react';

export const ContactsPageAsync = lazy(async () =>
  await import('./ContactsPage'));
