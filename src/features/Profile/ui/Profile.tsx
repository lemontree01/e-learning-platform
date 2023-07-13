import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getIsUserShown, themeActions } from '~/entities/Theme';
import styles from './Profile.module.scss';
import Img from '~/shared/assets/avatars/images/pic-1.jpg';
import { useAppDispatch } from '~/app/providers/StoreProvider';
import { useTranslation } from 'react-i18next';

export const Profile = () => {
  const isUserShown = useSelector(getIsUserShown);
  const dispatch = useAppDispatch();
  const { t, } = useTranslation();
  return (
    <div className={`${styles.profile} ${isUserShown && styles.active}`}>
    <img src={Img} className={styles.image} alt="" />
    <h3 className={styles.name}>username</h3>
    <p className={styles.role}>role</p>
    <Link
      onClick={() => { dispatch(themeActions.setIsUserShown(false)); }}
      to="profile"
      className="btn"
    >
      {t('view profile')}
    </Link>
    <div className="flex-btn">
      <Link to="login" className="option-btn">
        {t('login')}
      </Link>
      <Link to="register" className="option-btn">
        {t('register')}
      </Link>
    </div>
  </div>
  );
};
