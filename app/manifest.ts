import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BDP Talento - Banco de Desarrollo Productivo S.A.M.',
    short_name: 'BDP Talento',
    description:
      'Plataforma centralizada de talento del BDP S.A.M.: convocatorias, perfil profesional y bolsa de talento.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050b16',
    theme_color: '#004282',
    lang: 'es-BO',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  };
}
