import { type ReactNode } from 'react';
import { routeMetadata } from '~/shared/lib/metadata/routeMetadata';

export async function generateMetadata ({ params, }: { params: Promise<{ id: string }> }) {
  const { id, } = await params;
  return await routeMetadata(`/lesson/${encodeURIComponent(id)}`);
}

export default function Layout ({ children, }: { children: ReactNode }) {
  return <>{children}</>;
}
