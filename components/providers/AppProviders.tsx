'use client';

import { A11yProvider } from './A11yProvider';
import { AuthProvider } from './AuthProvider';
import { CandidatoProvider } from './CandidatoProvider';
import { I18nProvider } from './I18nProvider';
import { ToastProvider } from './ToastProvider';

/** Un solo punto de entrada para todo el estado global del cliente. */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <A11yProvider>
      <I18nProvider>
        <AuthProvider>
          <CandidatoProvider>
            <ToastProvider>{children}</ToastProvider>
          </CandidatoProvider>
        </AuthProvider>
      </I18nProvider>
    </A11yProvider>
  );
}
