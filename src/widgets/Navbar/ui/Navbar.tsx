import { useTranslation } from 'react-i18next';
import { NavLink } from '~/features/NavLink';

export const Navbar = () => {
  const { t, } = useTranslation();
  return (
    <nav>
      <NavLink to={'/home'} icon={<i className="fas fa-home"></i>}>
        {t('home')}
      </NavLink>
      <NavLink to={'/about'} icon={<i className="fas fa-question"></i>}>
        {t('about')}
      </NavLink>
      <NavLink to={'/courses'} icon={<i className="fas fa-graduation-cap"></i>}>
        {t('courses')}
      </NavLink>
      <NavLink
        to={'/teachers'}
        icon={<i className="fas fa-chalkboard-user"></i>}
      >
        {t('teachers')}
      </NavLink>
      <NavLink to={'/contacts'} icon={<i className="fas fa-headset"></i>}>
        {t('contact-us')}
      </NavLink>
    </nav>
  );
};
