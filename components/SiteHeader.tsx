'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BdpLogo } from '@/components/brand/BdpLogo';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { abrirPaleta } from '@/components/CommandPalette';
import { useAuth } from '@/components/providers/AuthProvider';
import { useCandidato } from '@/components/providers/CandidatoProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import { GlassLink } from '@/components/ui/glass';
import { initials } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

const ENLACES = [
  { href: '/convocatorias', key: 'nav.convocatorias' },
  { href: '/bolsa', key: 'nav.bolsa' },
  { href: '/evaluaciones', key: 'nav.evaluaciones' },
  { href: '/recursos', key: 'nav.recursos' },
] as const;

export function SiteHeader() {
  const { t } = useI18n();
  const { usuario, autenticado } = useAuth();
  const { noLeidas } = useCandidato();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [oculto, setOculto] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    let ultimo = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Se esconde al bajar y reaparece al subir: mas espacio de lectura.
      setOculto(y > 320 && y > ultimo);
      ultimo = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenu(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = menu ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [menu]);

  const activo = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="site-header no-print" data-scrolled={scrolled} data-hidden={oculto && !menu}>
        <div className="container site-header__bar">
          <Link href="/" aria-label={t('brand.name')}>
            <BdpLogo name={t('brand.name')} tagline={t('brand.tagline')} />
          </Link>

          <nav className="nav nav--desktop" aria-label={t('nav.menu')}>
            {ENLACES.map((e) => (
              <Link key={e.href} href={e.href} className="nav__link" aria-current={activo(e.href) ? 'page' : undefined}>
                {t(e.key)}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <button type="button" className="icon-btn" onClick={abrirPaleta} aria-label={t('nav.commandHint')} title="Ctrl+K">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.9" />
                <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
            </button>

            <LanguageSwitcher />

            {autenticado ? (
              <Link href="/panel" className="icon-btn icon-btn--solid" aria-label={t('nav.panel')} style={{ position: 'relative' }}>
                {initials(usuario?.nombre ?? '', usuario?.apellido)}
                {noLeidas > 0 && <span className="dock__badge">{noLeidas}</span>}
              </Link>
            ) : (
              <GlassLink href="/login" variant="primary" size="sm" className="hide-sm">
                {t('nav.login')}
              </GlassLink>
            )}

            <button
              type="button"
              className="icon-btn menu-btn"
              onClick={() => setMenu(true)}
              aria-label={t('nav.openMenu')}
              aria-expanded={menu}
            >
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
                <path d="M0 1h18M0 6h18M0 11h12" stroke="currentColor" strokeWidth="1.7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="nav-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.menu')}
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.72, ease: EASE }}
          >
            <div className="between" style={{ position: 'absolute', top: '1.2rem', left: 'var(--gutter)', right: 'var(--gutter)' }}>
              <BdpLogo name={t('brand.name')} />
              <button type="button" className="icon-btn" onClick={() => setMenu(false)} aria-label={t('nav.closeMenu')}>
                &#10005;
              </button>
            </div>

            <ul className="nav-overlay__list">
              {[{ href: '/', key: 'nav.home' }, ...ENLACES, { href: '/panel', key: 'nav.panel' }].map((e, i) => (
                <li className="nav-overlay__item" key={e.href}>
                  <motion.div
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '110%' }}
                    transition={{ duration: 0.8, delay: 0.06 * i, ease: EASE }}
                  >
                    <Link href={e.href} className="nav-overlay__link" onClick={() => setMenu(false)}>
                      <i>{String(i + 1).padStart(2, '0')}</i>
                      {t(e.key)}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>

            <div className="nav-overlay__meta">
              <div>
                <p className="footer__title">{t('lang.label')}</p>
                <LanguageSwitcher />
              </div>
              <div>
                <p className="footer__title">{t('footer.contact')}</p>
                <p>{t('footer.address')}</p>
              </div>
              <div>
                <p className="footer__title">{t('nav.login')}</p>
                <GlassLink href={autenticado ? '/panel' : '/login'} variant="primary" size="sm">
                  {autenticado ? t('nav.panel') : t('nav.login')}
                </GlassLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
