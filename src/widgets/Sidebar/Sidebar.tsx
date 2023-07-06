import { useTranslation } from 'react-i18next';
import Avatar from '~/shared/assets/avatars/images/pic-1.jpg';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '~/shared/state';
import { toggleSidebar } from '~/shared/state/features/themeSlice';
import styles from './sidebar.module.scss';
import { useSelector } from 'react-redux';
import { getIsSidebarShown } from '~/entities/Theme';
import { Text } from '~/shared/ui/Text';
import { Navbar } from '../Navbar';

const Sidebar = () => {
  const username = 'dasd';
  const role = 'dads';
  const dispatch = useAppDispatch();
  const isSideBarShown = useSelector(getIsSidebarShown);
  const body = document.body;
  body.classList.add('active');
  if (isSideBarShown) {
    body.classList.add('active');
  } else {
    body.classList.remove('active');
  }

  const { t, } = useTranslation();

  return (
    <div className={`${styles['side-bar']} ${isSideBarShown && styles.active}`}>
      <div
        id={styles['close-btn']}
        onClick={() => {
          if (isSideBarShown) {
            dispatch(toggleSidebar());
          }
        }}
      >
        <i className="fas fa-times"></i>
      </div>

      <div className={styles.profile}>
        <img src={Avatar} className="image" alt="" />
        <Text size="l" bold>{t('hello')}</Text>
        <Text size="m" variant="light">{t('non-authorized')}</Text>
        <Link to="profile" className="btn">
          {t('view-profile')}
        </Link>
      </div>

     <Navbar/>
    </div>
  );
};

export default Sidebar;
