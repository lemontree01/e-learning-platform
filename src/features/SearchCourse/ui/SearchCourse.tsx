import { SearchIcon } from '~/shared/ui/SvgIcon/SvgIcon';
import { type FormEvent, Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Input } from '~/shared/ui/Input';
import { Icon } from '~/shared/ui/Icon';
import { Button } from '~/shared/ui/Button';
import styles from './SearchCourse.module.scss';

const SearchCourseForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const currentQuery = params.get('search') ?? '';
  const [query, setQuery] = useState(currentQuery);
  const { t, } = useTranslation();

  useEffect(() => { setQuery(currentQuery); }, [currentQuery]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Read the field itself: text typed before hydration never reached `query`.
    const value = String(new FormData(event.currentTarget).get('search') ?? '').trim();
    const search = value ? `?${new URLSearchParams({ search: value, }).toString()}` : '';
    router.push(`/courses${search}`);
  };

  return (
    // action and name make a submit before hydration land on the same filtered catalog.
    <form role='search' className={styles.wrapper} onSubmit={submitSearch} action='/courses'>
      <Input
        type='text'
        name='search'
        aria-label={t('search-courses')}
        placeholder={t('search-placeholder')}
        maxLength={200}
        value={query}
        onChange={setQuery}
        addonRight={
          <Button type='submit' variant='clear'
            aria-label={t('search-courses')}>
            <Icon icon={<SearchIcon />} />
          </Button>
        }
      />
    </form>
  );
};

export const SearchCourse = () => (
  <Suspense fallback={null}><SearchCourseForm /></Suspense>
);
