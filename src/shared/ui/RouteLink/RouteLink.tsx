'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ComponentProps, type ReactNode } from 'react';

export function RouteLink ({
  href, children, ...props
}: ComponentProps<typeof Link> & { children?: ReactNode }) {
  const pathname = usePathname();
  const current = pathname === href;
  return (
    <Link href={href} prefetch={false} aria-current={current ? 'page' : undefined} {...props}>
      {children}
    </Link>
  );
}
