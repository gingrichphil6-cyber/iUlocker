/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useState } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { AuthModal } from './components/AuthModal';
import { CheckoutView } from './components/CheckoutView';
import { ContactSection } from './components/ContactSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { HowItWorksSection } from './components/HowItWorksSection';
import { ImeiCheckerCard } from './components/ImeiCheckerCard';
import { ImeiHelpModal } from './components/ImeiHelpModal';
import { Navbar } from './components/Navbar';
import { TrustSection } from './components/TrustSection';
import { RippleButton } from './components/ui/RippleButton';
import type { AppPersistedState, AppView, UnlockServiceType } from './types';
import { createUserProfile, loadAppState, saveAppState } from './utils/storage';

export default function App() {
  const [persisted, setPersisted] = useState<AppPersistedState>(() =>
    loadAppState()
  );
  const [activeView, setActiveView] = useState<AppView>('home');
  const [imeiHelpOpen, setImeiHelpOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{
    open: boolean;
    mode: 'signin' | 'signup';
  }>({ open: false, mode: 'signin' });

  useEffect(() => {
    saveAppState(persisted);
  }, [persisted]);

  const scrollToSection = useCallback((sectionId?: string) => {
    if (!sectionId || sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  }, []);

  const handleNavigateView = useCallback(
    (view: AppView, sectionId?: string) => {
      setActiveView(view);
      if (view === 'home') {
        scrollToSection(sectionId);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [scrollToSection]
  );

  const handleSelectService = (service: UnlockServiceType) => {
    setPersisted((prev) => ({ ...prev, selectedService: service }));
  };

  const handleAuthenticate = (name: string, email: string) => {
    const newUser = createUserProfile(name, email);
    setPersisted((prev) => ({
      ...prev,
      user: newUser,
    }));
  };

  const handleLogout = () => {
    setPersisted((prev) => ({ ...prev, user: null }));
    setActiveView('home');
  };

  return (
    <div
      id="top"
      data-view={activeView}
      className="min-h-screen flex flex-col bg-white text-[#1D1D1F]"
    >
      <Navbar
        activeView={activeView}
        user={persisted.user}
        onNavigateView={handleNavigateView}
        onOpenAuth={(mode = 'signin') =>
          setAuthModal({ open: true, mode })
        }
        onLogout={handleLogout}
        onGetStarted={() => handleNavigateView('home', 'imei-checker-anchor')}
      />

      <main className="flex-1">
        {activeView === 'home' && (
          <>
            {/* Hero Section */}
            <section
              aria-label="Hero and IMEI Checker"
              className="pt-8 pb-16 sm:pt-12 sm:pb-20 px-4 sm:px-6 bg-white"
            >
              <div className="max-w-[680px] mx-auto text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#F5F5F7] border border-[#D2D2D7] text-[11px] font-medium tracking-[0.08em] text-[#6E6E73] uppercase">
                  SMART UNLOCK
                </div>

                <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-[-0.03em] text-[#1D1D1F] leading-[1.08] [text-wrap:balance]">
                  Your Device. Your Freedom.
                </h1>

                <p className="mt-3 text-base sm:text-lg text-[#6E6E73] max-w-lg mx-auto leading-relaxed">
                  Check your device eligibility in seconds. A smarter way to understand your device unlock options.
                </p>

                <div className="mt-5 flex items-center justify-center">
                  <RippleButton
                    variant="secondary"
                    size="sm"
                    onClick={() => scrollToSection('services')}
                  >
                    <span>Explore Services</span>
                    <ArrowDownRight className="w-3.5 h-3.5 text-[#6E6E73]" aria-hidden="true" />
                  </RippleButton>
                </div>

                <div id="imei-checker-anchor" className="mt-7 sm:mt-8 scroll-mt-20">
                  <ImeiCheckerCard
                    selectedService={persisted.selectedService}
                    onSelectService={handleSelectService}
                    onOpenImeiHelp={() => setImeiHelpOpen(true)}
                  />
                </div>
              </div>
            </section>

            <TrustSection />
            <HowItWorksSection />
            <FaqSection />
            <ContactSection />
          </>
        )}

        {activeView === 'checkout' && (
          <CheckoutView
            selectedPlanId={persisted.selectedPlanId}
            billingCycle={persisted.billingCycle}
            onChangeBillingCycle={(cycle) =>
              setPersisted((prev) => ({ ...prev, billingCycle: cycle }))
            }
            onChangePlan={(planId) =>
              setPersisted((prev) => ({ ...prev, selectedPlanId: planId }))
            }
            onBack={() => handleNavigateView('home', 'top')}
          />
        )}
      </main>

      <Footer onNavigateView={handleNavigateView} />

      <ImeiHelpModal
        open={imeiHelpOpen}
        onClose={() => setImeiHelpOpen(false)}
      />

      <AuthModal
        open={authModal.open}
        initialMode={authModal.mode}
        onClose={() => setAuthModal((prev) => ({ ...prev, open: false }))}
        onAuthenticate={handleAuthenticate}
      />
    </div>
  );
}
