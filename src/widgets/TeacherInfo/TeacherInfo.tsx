import { useParams } from 'react-router-dom';
import { names } from '../Teachers/Teachers';
import { avatars } from '~/shared/assets/avatars';
import './teacherInfo.scss';
import { useTranslation } from 'react-i18next';

const TeacherInfo = () => {
  const { id, } = useParams();
  const { t, } = useTranslation('teachers');
  return (
    <section className="teacher-profile">
    <h1 className="heading">{t('profile details')}</h1>
    <div className="details">
      <div className="tutor">
        <img src={avatars[+id]} alt="" />
        <h3>{names[+id]}</h3>
        <span>{t('developer')}</span>
      </div>
      <div className="flex">
        <p>
        {t('total playlists')} : <span>4</span>
        </p>
        <p>
        {t('total videos')} : <span>18</span>
        </p>
        <p>
        {t('total likes')} : <span>1208</span>
        </p>
        <p>
          {t('total comments')} : <span>52</span>
        </p>
      </div>
    </div>
  </section>
  );
};

export default TeacherInfo;
