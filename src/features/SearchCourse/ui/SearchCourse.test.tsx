import { type ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { StoreProvider } from '~/app/providers/StoreProvider/ui/StoreProvider';
import { SearchCourse } from './SearchCourse';

const navigation = {
  search: '',
  push (url: string) {
    navigation.search = url.includes('?') ? url.slice(url.indexOf('?') + 1) : '';
  },
};

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) =>
    <a href={href} {...props}>{children}</a>,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: (url: string) => { navigation.push(url); }, }),
  useSearchParams: () => new URLSearchParams(navigation.search),
}));

jest.mock('~/shared/api/instance', () => ({
  $api: { get: jest.fn().mockResolvedValue({ data: [], }), },
}));

test('submitting search preserves an encoded query in the URL', () => {
  render(<StoreProvider><SearchCourse /></StoreProvider>);
  const field = screen.getByRole('textbox');
  fireEvent.mouseDown(field.parentElement ?? field);
  expect(field).toHaveFocus();
  fireEvent.change(field, { target: { value: 'React & TypeScript', }, });
  fireEvent.submit(screen.getByRole('search'));
  expect(new URLSearchParams(navigation.search).get('search')).toBe('React & TypeScript');
});
