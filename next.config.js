const path = require('path');
const { sandboxCsp } = require('./scripts/playground-security.cjs');

const configuredOrigin = process.env.SERVER_URL;
if (process.env.VERCEL && !configuredOrigin) {
  throw new Error('Set SERVER_URL to the deployed backend HTTPS origin before deploying.');
}
const apiOrigin = new URL(configuredOrigin || 'http://127.0.0.1:3001');
if (!['http:', 'https:'].includes(apiOrigin.protocol) || apiOrigin.username || apiOrigin.password ||
    apiOrigin.pathname !== '/' || apiOrigin.search || apiOrigin.hash ||
    (process.env.VERCEL && (apiOrigin.protocol !== 'https:' ||
      ['localhost', '127.0.0.1', '[::1]'].includes(apiOrigin.hostname)))) {
  throw new Error('SERVER_URL must be a public HTTPS origin on Vercel, without credentials, paths, or queries.');
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true, },
  images: { disableStaticImages: true, },
  async headers () {
    return [{
      source: '/code-runtime/:path*',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable', }],
    }, {
      source: '/code-runtime/manifest.json',
      headers: [{ key: 'Cache-Control', value: 'no-store', }],
    }, {
      source: '/code-sandbox/frame.html',
      headers: [
        { key: 'Content-Security-Policy', value: sandboxCsp, },
        { key: 'Referrer-Policy', value: 'no-referrer', },
        { key: 'X-Content-Type-Options', value: 'nosniff', },
        { key: 'Cache-Control', value: 'no-store', },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()', }
      ],
    }];
  },
  async rewrites () {
    // https://nextjs.org/docs/15/app/api-reference/config/next-config-js/rewrites#rewriting-to-an-external-url
    return [
      { source: '/favicon.ico', destination: '/favicon.svg', },
      { source: '/api/:path*', destination: `${apiOrigin.origin}/api/:path*`, },
      { source: '/course-:id(\\d+).jpg', destination: `${apiOrigin.origin}/course-:id.jpg`, }
    ];
  },
  webpack: (config) => {
    config.resolve.alias['~'] = path.join(__dirname, 'src');
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|webp|svg|woff2)$/i,
      type: 'asset/resource',
      generator: { filename: 'static/media/[name].[contenthash:8][ext]', },
    });
    return config;
  },
};

module.exports = nextConfig;
