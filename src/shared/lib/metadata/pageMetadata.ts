export function getPageMetadata (pathname: string, t: (key: string) => string) {
  const segment = pathname.split('/')[1];
  let titleKey: string;
  let descriptionKey = 'app-description';
  switch (segment) {
    case '':
    case 'home': return { title: t('app-title'), description: t(descriptionKey), };
    case 'courses': titleKey = 'courses'; descriptionKey = 'library-description'; break;
    case 'course': titleKey = pathname.includes('/lesson/') ? 'lesson' : 'course'; break;
    case 'lesson': titleKey = 'lesson'; break;
    case 'about': titleKey = 'about'; break;
    case 'contacts': titleKey = 'contact-us'; break;
    case 'login': titleKey = 'account-sign-in'; descriptionKey = 'account-login-intro'; break;
    case 'register': titleKey = 'account-create'; descriptionKey = 'account-register-intro'; break;
    case 'profile': titleKey = 'account-view'; descriptionKey = 'account-profile-intro'; break;
    default: titleKey = 'page-not-found'; descriptionKey = 'page-not-found-description';
  }
  return { title: `${t(titleKey)} — ${t('brand-name')}`, description: t(descriptionKey), };
}
