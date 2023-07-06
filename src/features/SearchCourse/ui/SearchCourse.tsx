import { useState } from 'react';
import { Input } from '~/shared/ui/Input';
import { useNavigate } from 'react-router-dom';
import { Icon } from '~/shared/ui/Icon';
import SearchIcon from '@mui/icons-material/Search';
import { Button } from '~/shared/ui/Button';
import styles from './SearchCourse.module.scss';
import { useTranslation } from 'react-i18next';

export const SearchCourse = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const { t, } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <Input
        type="text"
        name="search_box"
        required
        placeholder={t('search-placeholder')}
        maxLength={25}
        value={query}
        onChange={(value: string) => {
          setQuery(value);
        }}
        addonRight={
          <Button
            variant="clear"
            onClick={() => {
              navigate('/home');
            }}
          >
            <Icon icon={<SearchIcon />} />
          </Button>
        }
      />
    </div>
  );
};
