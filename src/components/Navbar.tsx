import React, { useEffect, useState } from 'react';
import { Menu, User, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { BrandLogo } from './ui/BrandLogo';
import { RippleButton } from './ui/RippleButton';
import type { AppView, UserProfile } from '../types';

interface NavbarProps {
  activeView: AppView;
  user: UserProfile | null;
  onNavigateView: (view: AppView, sectionId?: string) => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onLogout: () => void;
  onGetStarted: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  user,
  onNavigateView,
  onOpenAuth,
  onLogout,
  onGetStarted,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems: { label: string; view: AppView; sectionId?: string }[] = [
    { label: 'Home', view: 'home', sectionId: 'top' },
    { label: 'Services', view: 'home', sectionId: 'services' },
    { label: 'How it works', view: 'home', sectionId: 'how-it-works' },
    { label: 'Support', view: 'home', sectionId: 'support' },
  ];

  const handleLinkClick = (item: { view: AppView; sectionId?: string }) => {
    setMobileOpen(false);
    onNavigateView(item.view, item.sectionId);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-colors duration-200 bg-white/85 backdrop-blur-xl ${
          scrolled || activeView !== 'home'
            ? 'border-b border-[#D2D2D7]'
            : 'border-b border-transparent'
        }`}
      >
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="shrink-0">
            <BrandLogo onClick={() => onNavigateView('home', 'top')} />
          </div>

          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-5"
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleLinkClick(item)}
                className="text-sm font-medium whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer text-[#6E6E73] hover:text-[#1D1D1F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F] rounded"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="hidden md:flex items-center gap-2.5">
              {user ? (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Sign out"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1D1D1F] bg-[#F5F5F7] border border-[#D2D2D7] rounded-full hover:bg-[#EBEBF0] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
                  <span className="max-w-[110px] truncate">{user.name}</span>
                  <span className="text-[#6E6E73]">· Sign Out</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenAuth('signin')}
                  className="px-3 py-1.5 text-xs font-medium text-[#6E6E73] hover:text-[#1D1D1F] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F] rounded-full"
                >
                  Sign In
                </button>
              )}

              <RippleButton
                variant="primary"
                size="sm"
                onClick={onGetStarted}
              >
                Get Started
              </RippleButton>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={
                mobileOpen ? 'Close navigation menu' : 'Open navigation menu'
              }
              aria-expanded={mobileOpen}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#F5F5F7] border border-[#D2D2D7] text-[#1D1D1F] hover:bg-[#EBEBF0] transition-colors cursor-pointer"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 md:hidden bg-black/25 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          >
            <motion.nav
              aria-label="Mobile navigation"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="ml-auto h-full w-full max-w-[300px] bg-white border-l border-[#D2D2D7] p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-[#D2D2D7]">
                  <BrandLogo
                    compact
                    onClick={() =>
                      handleLinkClick({ view: 'home', sectionId: 'top' })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close navigation menu"
                    className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-[#F5F5F7] border border-[#D2D2D7] text-[#1D1D1F]"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-5 flex flex-col gap-1">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleLinkClick(item)}
                      className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors min-h-[44px]"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-5 border-t border-[#D2D2D7] flex flex-col gap-2.5">
                {user ? (
                  <RippleButton
                    variant="secondary"
                    fullWidth
                    onClick={() => {
                      setMobileOpen(false);
                      onLogout();
                    }}
                  >
                    <User className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
                    <span>{user.name} · Sign Out</span>
                  </RippleButton>
                ) : (
                  <RippleButton
                    variant="secondary"
                    fullWidth
                    onClick={() => {
                      setMobileOpen(false);
                      onOpenAuth('signin');
                    }}
                  >
                    Sign In
                  </RippleButton>
                )}

                <RippleButton
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    setMobileOpen(false);
                    onGetStarted();
                  }}
                >
                  Get Started
                </RippleButton>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
