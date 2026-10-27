import { CloseIcon } from '~/shared/ui/SvgIcon/SvgIcon';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Brand } from '~/shared/ui/Brand/Brand';
import { Drawer } from '~/shared/ui/Drawer/Drawer';
import { getIsSidebarShown, themeActions } from '~/entities/Theme';
import { useAppDispatch } from '~/app/providers/StoreProvider';
import { Navbar } from '../Navbar';
import styles from './sidebar.module.scss';

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const shown = useSelector(getIsSidebarShown);
  const pathname = usePathname();
  const { t, } = useTranslation();
  const close = () => { dispatch(themeActions.setIsSidebarShown(false)); };
  useEffect(() => {
    dispatch(themeActions.setIsSidebarShown(false));
  }, [pathname, dispatch]);

  return <Drawer open={shown} onDismiss={close} className={styles.drawer} label={t('navigation')}>
    <aside id='main-navigation' aria-label={t('main-navigation')}>
      <div className={styles.top}>
        <Brand />
        <button type='button' onClick={close} aria-label={t('close-navigation')}>
          <CloseIcon />
        </button>
      </div>
      <p className='eyebrow'>{t('explore-observatory')}</p>
      <Navbar />
      <div className={styles.note}>
        <span className='eyebrow'>{t('public-demo')}</span>
        <p>{t('no-account-needed')}</p>
      </div>
    </aside>
  </Drawer>;
};
export default Sidebar;
