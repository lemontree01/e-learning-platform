import NotFoundPage from '~/screens/NotFoundPage/NotFoundPage';
import { routeMetadata } from '~/shared/lib/metadata/routeMetadata';

export const generateMetadata = async () => await routeMetadata('/_not-found', { missing: true, });

export default function NotFound () {
  return <NotFoundPage />;
}
