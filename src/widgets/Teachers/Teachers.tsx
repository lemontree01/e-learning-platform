import './teachers.scss';
import { Link } from 'react-router-dom';
import { avatars } from '~/shared/assets/avatars';
import { useTranslation } from 'react-i18next';

export const names = [
  'Noah Smith',
  'Emma Johnson',
  'Kevin Brown',
  'Liam Wilson',
  'Ava Martinez',
  'William Taylor',
  'Sophia Anderson',
  'James Thomas',
  'Andrew Garcia',
  'Benjamin Davis'
];

const Teachers = () => {
  const { t, } = useTranslation('teachers');
  return (
    <section className="teachers">
      <h1 className="heading">{t('our-teachers')}</h1>
      <form action="" method="post" className="search-tutor">
        <input
          type="text"
          name="search_box"
          placeholder={t('placeholder')}
          required
        />
        <button
          type="submit"
          className="fas fa-search"
          name="search_tutor"
        ></button>
      </form>

      <div className="box-container">
        <div className="box offer">
          <h3>{t('become a tutor')}</h3>
          <p>
           {t('description')}
          </p>
          <Link to="/1" className="inline-btn">
            {t('get started')}
          </Link>
        </div>

        {Array.from({ length: 9, }).map((_, index) => (
          <div className="box" key={index}>
          <div className="tutor">
            <img src={avatars[index]} alt="" />
            <div>
              <h3>{names[index]}</h3>
              <span>{t('developer')}</span>
            </div>
          </div>
          <p>
            {t('total playlists')} : <span>{30 - index * 2 + 1}</span>
          </p>
          <p>
            {t('total videos')} : <span>{40 - index * 3 }</span>
          </p>
          <p>
         {t('total likes')} : <span>{1280 - 12 * index}</span>
          </p>
          <Link to={String(index)} className="inline-btn">
            {t('View profile')}
          </Link>
        </div>
        ))}

      </div>
    </section>
  );
};

export default Teachers;
