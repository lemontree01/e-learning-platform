import { useState } from 'react';
import { Input } from '~/shared/ui/Input';
import { useNavigate } from 'react-router-dom';
import { Icon } from '~/shared/ui/Icon';
import SearchIcon from '@mui/icons-material/Search';
import { Button } from '~/shared/ui/Button';
import styles from './SearchCourse.module.scss';
import { useTranslation } from 'react-i18next';
import { fetchCoursesByQuery }
  from '~/entities/Course/model/services/fetchCoursesByQuery';
import { useAppDispatch } from '~/app/providers/StoreProvider';

export const SearchCourse = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const dispatch = useAppDispatch();

  const { t, i18n, } = useTranslation();

  const lang = i18n.language as 'rus' | 'eng';

  const clickHandler = () => {
    dispatch(fetchCoursesByQuery({ query, lang, }));
    navigate('/courses');
  };

  return (
    <div className={styles.wrapper}>
      <Input
        type="text"
        name="search_box"
        required
        placeholder={t('search-placeholder') ?? ''}
        maxLength={25}
        value={query}
        onChange={(value: string) => {
          setQuery(value);
        }}
        addonRight={
          <Button
          variant="clear"
          onClick={clickHandler}
        >
          <Icon icon={<SearchIcon />} />
        </Button>
        }
      />
    </div>
  );
};
