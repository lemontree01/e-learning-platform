import { AppLogo } from '~/shared/ui/AppLogo';
import { SearchCourse } from '~/features/SearchCourse';
import { ToggleSidebar } from '~/features/ToggleSidebar/ui/ToggleSidebar';
import { OpenProfile } from '~/features/OpenProfile';
import { ToggleTheme } from '~/features/ToggleTheme';
import { ToggleLanguage } from '~/features/ToggleLanguage';
import { Profile } from '~/features/Profile';

import styles from './header.module.scss';

export const Header = () => {
  return (
    <header className={styles.header}>
      <section>
        <AppLogo>E-learning platform</AppLogo>
        <SearchCourse />
        <div className={styles.icons}>
          <ToggleSidebar />
          <OpenProfile />
          <ToggleTheme />
          <ToggleLanguage />
        </div>
        <Profile />
      </section>
    </header>
  );
};
