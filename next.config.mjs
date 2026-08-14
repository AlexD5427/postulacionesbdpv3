/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Todo el arte visual es SVG/CSS generativo: no dependemos de un CDN externo.
  // Si en el futuro se suben fotografias reales, colocarlas en /public/media.
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  eslint: {
    // Un aviso de estilo no debe impedir un despliegue. El chequeo de tipos si
    // bloquea el build (ver typescript, mas abajo).
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

export default nextConfig;
