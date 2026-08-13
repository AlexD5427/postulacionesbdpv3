'use client';

import Link from 'next/link';
import { BdpMark } from '@/components/brand/BdpLogo';
import { useI18n } from '@/components/providers/I18nProvider';
import { AndeanPattern } from '@/components/ui/backgrounds';
import { Reveal } from '@/components/ui/motion';

export function Footer() {
  const { t } = useI18n();
  const anio = new Date().getFullYear();

  return (
    <footer className="footer" data-surface="deep" id="contacto">
      <AndeanPattern />
      <div className="container">
        <div className="footer__grid">
          <div>
            <BdpMark className="brand__mark" />
            <p className="h3" style={{ marginTop: '1rem', maxWidth: '22ch' }}>
              {t('brand.claim')}
            </p>
            <p className="muted" style={{ marginTop: '0.7rem', fontSize: 'var(--fs-sm)' }}>
              {t('footer.langNotice')}
            </p>
          </div>

          <div>
            <p className="footer__title">{t('footer.explore')}</p>
            <div className="footer__links">
              <Link href="/convocatorias">{t('nav.convocatorias')}</Link>
              <Link href="/bolsa">{t('nav.bolsa')}</Link>
              <Link href="/evaluaciones">{t('nav.evaluaciones')}</Link>
              <Link href="/recursos">{t('nav.recursos')}</Link>
            </div>
          </div>

          <div>
            <p className="footer__title">{t('footer.candidate')}</p>
            <div className="footer__links">
              <Link href="/registro">{t('nav.register')}</Link>
              <Link href="/login">{t('nav.login')}</Link>
              <Link href="/panel">{t('nav.panel')}</Link>
              <Link href="/panel/cv">{t('panel.tab.cv')}</Link>
            </div>
          </div>

          <div>
            <p className="footer__title">{t('footer.legal')}</p>
            <div className="footer__links">
              <span>{t('footer.transparency')}</span>
              <span>{t('footer.privacy')}</span>
              <span>{t('footer.terms')}</span>
              <span>{t('footer.accessibility')}</span>
            </div>
          </div>
        </div>

        <Reveal variant="mask">
          <p className="footer__wordmark" aria-hidden="true">
            BDP S.A.M.
          </p>
        </Reveal>

        <div className="footer__bottom">
          <span>
            &copy; {anio} {t('brand.full')}. {t('footer.rights')}.
          </span>
          <span>{t('footer.address')}</span>
        </div>
      </div>
    </footer>
  );
}
