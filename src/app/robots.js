export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/private/',
        '/_next/',
        '/workspace/edit-course/',
        '/workspace/course/',
      ],
    },
    sitemap: 'https://skillsprint.com/sitemap.xml',
    host: 'https://skillsprint.com',
  };
}
