'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useCandidato } from '@/components/providers/CandidatoProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import { initials } from '@/lib/utils';

/**
 * Dock de accesos directos posterior al login.
 * Ampliacion tipo lupa: cada icono crece segun la distancia al cursor,
 * con badges de conteo y tooltips accesibles.
 */

interface ItemDock {
  href: string;
  key: string;
  icono: React.ReactNode;
  badge?: number;
  opcional?: boolean;
}

function Icono({ d, extra }: { d: string; extra?: React.ReactNode }) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      {extra}
    </svg>
  );
}

export function Dock() {
  const { t } = useI18n();
  const { autenticado, usuario, logout } = useAuth();
  const { guardadas, alertas, comparar, noLeidas } = useCandidato();
  const pathname = usePathname();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  if (!autenticado) return null;
  // El dock no compite con el panel de impresion de la hoja de vida.
  if (pathname.startsWith('/panel/cv')) return null;

  const items: ItemDock[] = [
    { href: '/panel', key: 'nav.panel', icono: <Icono d="M4 13h7V4H4zM13 20h7v-9h-7zM4 20h7v-4H4zM13 8h7V4h-7z" />, badge: noLeidas },
    { href: '/convocatorias', key: 'nav.convocatorias', icono: <Icono d="M4 7h16M4 12h16M4 17h10" /> },
    {
      href: '/panel?tab=guardadas',
      key: 'panel.tab.guardadas',
      icono: <Icono d="M6 4h12v16l-6-4-6 4z" />,
      badge: guardadas.length,
    },
    {
      href: '/panel?tab=alertas',
      key: 'panel.tab.alertas',
      icono: <Icono d="M6 9a6 6 0 1 1 12 0c0 4 2 5 2 5H4s2-1 2-5M10 19a2 2 0 0 0 4 0" />,
      badge: alertas.filter((a) => a.activa).length,
      opcional: true,
    },
    {
      href: '/panel?tab=documentos',
      key: 'panel.tab.documentos',
      icono: <Icono d="M7 3h7l4 4v14H7zM14 3v5h4" />,
      opcional: true,
    },
    {
      href: '/panel?tab=comparar',
      key: 'panel.tab.comparar',
      icono: <Icono d="M6 20V9M12 20V4M18 20v-7" />,
      badge: comparar.length,
      opcional: true,
    },
    { href: '/evaluaciones', key: 'nav.evaluaciones', icono: <Icono d="M9 11l2.5 2.5L16 9M5 4h14v16H5z" /> },
    { href: '/recursos', key: 'nav.recursos', icono: <Icono d="M4 5h7v15H4zM13 5h7v15h-7" />, opcional: true },
    { href: '/panel/cv', key: 'panel.tab.cv', icono: <Icono d="M8 3h8l3 3v15H5V6zM9 12h6M9 16h4" />, opcional: true },
  ];

  /** Ampliacion tipo lupa segun la posicion horizontal del cursor. */
  const mover = (event: React.MouseEvent) => {
    const cont = ref.current;
    if (!cont) return;
    const hijos = Array.from(cont.querySelectorAll<HTMLElement>('[data-dock-item]'));
    hijos.forEach((hijo) => {
      const rect = hijo.getBoundingClientRect();
      const centro = rect.left + rect.width / 2;
      const distancia = Math.abs(event.clientX - centro);
      const influencia = Math.max(0, 1 - distancia / 140);
      hijo.style.setProperty('--dock-scale', String(1 + influencia * 0.34));
      hijo.style.setProperty('--dock-lift', String(influencia * 10));
    });
  };

  const salir = () => {
    ref.current?.querySelectorAll<HTMLElement>('[data-dock-item]').forEach((hijo) => {
      hijo.style.setProperty('--dock-scale', '1');
      hijo.style.setProperty('--dock-lift', '0');
    });
  };

  const activo = (href: string) => {
    const base = href.split('?')[0];
    return pathname === base;
  };

  return (
    <nav className="dock no-print" aria-label={t('nav.menu')} ref={ref} onMouseMove={mover} onMouseLeave={salir}>
      {items.map((item) => (
        <Link
          key={item.key + item.href}
          href={item.href}
          data-dock-item
          className={`dock__item${item.opcional ? ' dock__item--optional' : ''}`}
          aria-current={activo(item.href) ? 'page' : undefined}
          aria-label={t(item.key)}
        >
          {item.icono}
          {!!item.badge && item.badge > 0 && <span className="dock__badge">{item.badge}</span>}
          <span className="dock__tip" role="tooltip">
            {t(item.key)}
          </span>
        </Link>
      ))}

      <span className="dock__sep" aria-hidden="true" />

      <button
        type="button"
        data-dock-item
        className="dock__item"
        onClick={() => {
          if (window.confirm(t('panel.logoutConfirm'))) {
            logout();
            router.push('/');
          }
        }}
        aria-label={t('nav.logout')}
      >
        <span className="dock__avatar">{initials(usuario?.nombre ?? '', usuario?.apellido)}</span>
        <span className="dock__tip" role="tooltip">
          {t('nav.logout')}
        </span>
      </button>
    </nav>
  );
}
