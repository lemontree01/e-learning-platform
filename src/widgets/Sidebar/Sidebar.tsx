import { type KeyboardEvent, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { Brand } from '~/shared/ui/Brand/Brand';
import { getIsSidebarShown, themeActions } from '~/entities/Theme';
import { useAppDispatch } from '~/app/providers/StoreProvider';
import { Navbar } from '../Navbar';
import styles from './sidebar.module.scss';

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const shown = useSelector(getIsSidebarShown);
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const { t, } = useTranslation();
  const close = () => { dispatch(themeActions.setIsSidebarShown(false)); };
  const containFocus = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab') return;
    const controls = event.currentTarget.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  useEffect(() => {
    const element = dialog.current;
    if (shown && element && !element.open) element.showModal();
    if (!shown && element?.open) element.close();
  }, [shown]);

  useEffect(() => {
    dispatch(themeActions.setIsSidebarShown(false));
  }, [pathname, dispatch]);

  return <dialog ref={dialog} className={styles.drawer} aria-label={t('navigation')}
    onClose={close} onCancel={close} onKeyDown={containFocus}
    onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
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
  </dialog>;
};
export default Sidebar;
