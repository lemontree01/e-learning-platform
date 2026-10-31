import { type MetadataRoute } from 'next';
import { siteUrl } from '~/shared/lib/metadata/siteUrl';

export default function robots (): MetadataRoute.Robots {
  return {
    sitemap: new URL('/sitemap.xml', siteUrl).href,
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/code-runtime/', '/code-sandbox/'],
    },
  };
}
