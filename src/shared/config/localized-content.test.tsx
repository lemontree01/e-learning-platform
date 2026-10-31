import { act, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { createAppI18n } from './i18n';
import ContactInfo from '~/widgets/ContactInfo/ContactInfo';
import { CourseArtwork } from '~/shared/ui/CourseArtwork/CourseArtwork';

test('page copy and artwork switch language with the interface', async () => {
  const i18n = createAppI18n('en');
  render(<I18nextProvider i18n={i18n}>
    <ContactInfo /><CourseArtwork id={0} />
  </I18nextProvider>);
  expect(screen.getByRole('heading', { level: 1, name: 'Get in touch', })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Open an issue', }))
    .toHaveAttribute('href', 'https://github.com/lemontree01/e-learning-platform/issues');
  expect(screen.getByText('01 / STUDY')).toBeInTheDocument();

  await act(async () => { await i18n.changeLanguage('ru'); });
  expect(screen.getByRole('heading', { level: 1, name: 'Связаться с нами', })).toBeInTheDocument();
  expect(screen.getByText('01 / УРОК')).toBeInTheDocument();
});
