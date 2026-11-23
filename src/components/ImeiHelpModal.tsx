import React, { useEffect } from 'react';
import { PhoneCall, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { RippleButton } from './ui/RippleButton';

interface ImeiHelpModalProps {
  open: boolean;
  onClose: () => void;
}

export const ImeiHelpModal: React.FC<ImeiHelpModalProps> = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const steps = [
    {
      num: '01',
      title: 'Open the phone dialer.',
      detail: 'Launch the standard Phone app on your iOS or Android device.',
    },
    {
      num: '02',
      title: 'Dial *#06#.',
      detail: 'No need to press call — the device information sheet appears automatically.',
    },
    {
      num: '03',
      title: 'Locate the IMEI on screen.',
      detail: 'Copy the 14 or 15-digit IMEI number (IMEI 1 for dual-SIM devices).',
    },
    {
      num: '04',
      title: 'Can’t access the device? Open the SIM slot.',
      detail:
        'If you cannot access the phone screen, eject the SIM card tray to find the IMEI number printed on it.',
    },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="imei-help-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-2xl bg-white border border-[#D2D2D7] p-6 sm:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close IMEI instructions"
              className="absolute top-4 right-4 w-9 h-9 inline-flex items-center justify-center rounded-full bg-[#F5F5F7] border border-[#D2D2D7] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Minimalist phone illustration */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-44 h-72 rounded-[28px] bg-[#1D1D1F] p-2.5 flex flex-col justify-between">
                  <div className="mx-auto w-12 h-1.5 rounded-full bg-white/20 mt-1" />

                  <div className="flex-1 my-2.5 rounded-[18px] bg-white p-3 flex flex-col justify-between overflow-hidden">
                    <div className="flex items-center justify-between text-[10px] text-[#6E6E73] font-mono">
                      <span>DIALER</span>
                      <PhoneCall className="w-3 h-3 text-[#1D1D1F]" aria-hidden="true" />
                    </div>

                    <div className="text-center py-2">
                      <div className="font-mono text-xl font-bold tracking-wider text-[#1D1D1F]">
                        *#06#
                      </div>
                      <div className="mt-1 text-[10px] font-medium text-[#6E6E73]">
                        Device Info
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] p-2 text-center">
                      <div className="text-[9px] text-[#6E6E73] uppercase tracking-wider">
                        IMEI 1
                      </div>
                      <div className="font-mono text-[11px] font-semibold text-[#1D1D1F] tabular-nums mt-0.5">
                        490154203237518
                      </div>
                    </div>
                  </div>

                  <div className="mx-auto w-14 h-1 rounded-full bg-white/30 mb-0.5" />
                </div>
              </div>

              {/* Instructions */}
              <div className="md:col-span-7">
                <h2
                  id="imei-help-title"
                  className="text-2xl font-bold text-[#1D1D1F] tracking-[-0.025em]"
                >
                  Where to find your IMEI
                </h2>
                <p className="mt-2 text-sm text-[#6E6E73]">
                  Every cellular device has a unique 14 or 15-digit International Mobile Equipment Identity number.
                </p>

                <ol className="mt-5 space-y-3">
                  {steps.map((step) => (
                    <li
                      key={step.num}
                      className="flex items-start gap-3 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] p-3.5"
                    >
                      <span className="font-mono text-xs font-semibold text-[#1D1D1F] bg-white border border-[#D2D2D7] rounded-lg px-2 py-0.5 shrink-0">
                        {step.num}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#1D1D1F]">
                          {step.title}
                        </p>
                        <p className="text-xs text-[#6E6E73] mt-0.5 leading-relaxed">
                          {step.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-6 flex justify-end">
                  <RippleButton variant="primary" onClick={onClose}>
                    Got it
                  </RippleButton>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
