// Always use the public origin, never a preview hostname or an untrusted Host header.
export const siteUrl = new URL(
  process.env.SITE_URL || 'https://learning-platform-gray-mu.vercel.app'
);

if (siteUrl.protocol !== 'https:' || siteUrl.username || siteUrl.password ||
    siteUrl.pathname !== '/' || siteUrl.search || siteUrl.hash) {
  throw new Error('SITE_URL must be an HTTPS origin without credentials, a path, or a query.');
}
