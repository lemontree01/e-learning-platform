import { type MetadataRoute } from 'next';
import { siteUrl } from '~/shared/lib/metadata/siteUrl';

export const revalidate = 3600;

export default async function sitemap (): Promise<MetadataRoute.Sitemap> {
  const paths = new Set(['/home', '/courses', '/about', '/contacts']);
  const controller = new AbortController();
  const timeout = setTimeout(() => { controller.abort(); }, 4000);
  try {
    const origin = process.env.SERVER_URL || 'http://127.0.0.1:3001';
    const response = await fetch(`${origin}/api/courses?lang=eng`, {
      signal: controller.signal, next: { revalidate: 3600, },
    });
    const courses: unknown = response.ok ? await response.json() : null;
    if (Array.isArray(courses)) {
      for (const course of courses as unknown[]) {
        if (!course || typeof course !== 'object') continue;
        const { id, numberOfLessons, } = course as Record<string, unknown>;
        if (typeof id !== 'number' || !Number.isSafeInteger(id) || id < 0 ||
            typeof numberOfLessons !== 'number' || !Number.isSafeInteger(numberOfLessons) ||
            numberOfLessons < 0 || numberOfLessons > 1000) continue;
        paths.add(`/course/${id}`);
        for (let index = 0; index < numberOfLessons; index++) {
          paths.add(`/course/${id}/lesson/${index}`);
        }
      }
    }
  } catch {
    // Keep public navigation discoverable during a transient API outage.
  } finally {
    clearTimeout(timeout);
  }
  return Array.from(paths, pathname => ({ url: new URL(pathname, siteUrl).href, }));
}
