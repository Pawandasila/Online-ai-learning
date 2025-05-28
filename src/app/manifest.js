export default function manifest() {
  return {
    name: 'SkillSprint - AI-Powered Learning Platform',
    short_name: 'SkillSprint',
    description: 'Create personalized learning courses instantly with AI. Generate comprehensive courses with videos, exercises, and certificates.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any',
      },
    ],
    categories: ['education', 'productivity', 'business'],
    lang: 'en-US',
    screenshots: [
      {
        src: '/screenshots/desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'SkillSprint Dashboard on Desktop',
      },
      {
        src: '/screenshots/mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'SkillSprint Mobile Experience',
      },
    ],
  };
}
