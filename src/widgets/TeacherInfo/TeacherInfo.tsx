import Link from 'next/link';
import { useParams } from 'next/navigation';
import { names } from '../Teachers/Teachers';
import { avatars } from '~/shared/assets/avatars';
import { useTranslation } from 'react-i18next';
import './teacherInfo.scss';

const TeacherInfo = () => {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : undefined;
  const { t, } = useTranslation('teachers');
  const teacherId = Number(id);
  if (id === undefined || !/^\d+$/.test(id) ||
    !Number.isSafeInteger(teacherId) || teacherId >= names.length) {
    return <section><div className='state-panel'><h1 className='heading'>{t('not-found')}</h1>
      <Link href='/teachers' className='action'>{t('back-to-teachers')}</Link></div></section>;
  }
  return <section className='teacher-profile'>
    <Link href='/teachers' className='text-link'>← {t('back-to-teachers')}</Link>
    <div className='teacher-details'>
      <img src={avatars[teacherId % avatars.length]} alt='' />
      <div><p className='eyebrow'>{t('sample-label')}</p>
        <h1>{t(`names.${teacherId}`, { defaultValue: names[teacherId], })}</h1>
        <p>{t('developer')}</p><p className='teacher-description'>{t('profile-description')}</p>
        <Link href='/courses' className='action action-secondary'>{t('browse-courses')}</Link>
      </div>
    </div>
  </section>;
};
export default TeacherInfo;
