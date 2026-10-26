import './teachers.scss';
import Link from 'next/link';
import { avatars } from '~/shared/assets/avatars';
import { useTranslation } from 'react-i18next';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getRouteTeacher } from '~/shared/routes/routes';

export const names = [
  'Noah Smith', 'Emma Johnson', 'Kevin Brown', 'Liam Wilson', 'Ava Martinez',
  'William Taylor', 'Sophia Anderson', 'James Thomas', 'Andrew Garcia', 'Benjamin Davis'
];

const Teachers = () => {
  const { t, } = useTranslation('teachers');
  return <section className='teachers'>
    <p className='eyebrow'>
      {t('brand-name', { ns: 'translation', })} / {t('directory-label')}
    </p>
    <h1>{t('our-teachers')}</h1>
    <p className='teachers-description'>{t('directory-description')}</p>
    <div className='teacher-grid'>
      {names.map((name, index) => <article key={name}>
        <img src={avatars[index % avatars.length]} alt='' />
        <span className='eyebrow'>{t('sample-label')}</span>
        <h2>{t(`names.${index}`, { defaultValue: name, })}</h2><p>{t('developer')}</p>
        <Link href={getRouteTeacher(String(index))}>{t('View profile')}
          <ArrowForwardIcon /></Link>
      </article>)}
    </div>
  </section>;
};
export default Teachers;
