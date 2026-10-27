import { type ReactNode } from 'react';
import { routeMetadata } from '~/shared/lib/metadata/routeMetadata';

export const generateMetadata = async () => await routeMetadata('/courses');

export default function Layout ({ children, }: { children: ReactNode }) {
  return <>{children}</>;
}
