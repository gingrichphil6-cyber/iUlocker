import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  QrCode,
  ShieldCheck,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { BillingCycle, PlanId } from '../types';
import {
  formatCurrency,
  generateDemoPaymentReference,
  getCheckoutTotal,
  getPlanById,
} from '../utils/pricing';
import { RippleButton } from './ui/RippleButton';

interface CheckoutViewProps {
  selectedPlanId: PlanId;
  billingCycle: BillingCycle;
  onChangeBillingCycle: (cycle: BillingCycle) => void;
  onChangePlan: (planId: PlanId) => void;
  onBack: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  selectedPlanId,
  billingCycle,
  onChangeBillingCycle,
  onChangePlan,
  onBack,
}) => {
  const plan = getPlanById(selectedPlanId);
  const total = getCheckoutTotal(plan, billingCycle);
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  const paymentReference = useMemo(
    () => generateDemoPaymentReference(selectedPlanId, 482910),
    [selectedPlanId]
  );

  const handleCopyRef = async () => {
    try {
      await navigator.clipboard.writeText(paymentReference);
      setCopiedRef(true);
      window.setTimeout(() => setCopiedRef(false), 1800);
    } catch {
      setCopiedRef(true);
      window.setTimeout(() => setCopiedRef(false), 1800);
    }
  };

  return (
    <section
      aria-label="Unlock Checkout"
      className="py-12 sm:py-16 px-4 sm:px-6 min-h-[calc(100vh-4rem)] bg-white"
    >
      <div className="max-w-[680px] mx-auto space-y-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Home</span>
        </button>

        <div>
          <h1 className="text-3xl font-bold tracking-[-0.03em] text-[#1D1D1F]">
            Complete Your Order
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#6E6E73]">
            Review your selected service tier and proceed with payment instructions.
          </p>
        </div>

        {/* Order Summary */}
        <div className="rounded-2xl bg-[#F5F5F7] border border-[#D2D2D7] p-6 space-y-5">
          <div className="flex items-center justify-between gap-3 border-b border-[#D2D2D7] pb-4">
            <h2 className="text-base font-semibold text-[#1D1D1F]">
              Order Summary
            </h2>
            <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white border border-[#D2D2D7]">
              <button
                type="button"
                onClick={() => onChangeBillingCycle('monthly')}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-[#1D1D1F] text-white'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => onChangeBillingCycle('yearly')}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-[#1D1D1F] text-white'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Plan Switcher */}
          <div>
            <span className="text-xs text-[#6E6E73] uppercase tracking-[0.06em] font-semibold">
              Selected Tier
            </span>
            <div className="mt-2.5 grid grid-cols-3 gap-2.5">
              {(['starter', 'pro', 'elite'] as PlanId[]).map((pid) => {
                const p = getPlanById(pid);
                const active = pid === selectedPlanId;
                return (
                  <button
                    key={pid}
                    type="button"
                    onClick={() => onChangePlan(pid)}
                    className={`rounded-xl px-3 py-2.5 text-left border transition-colors cursor-pointer ${
                      active
                        ? 'bg-white border-[#1D1D1F] text-[#1D1D1F]'
                        : 'bg-white/60 border-[#D2D2D7] text-[#6E6E73] hover:border-[#1D1D1F]/40'
                    }`}
                  >
                    <div className="text-xs font-semibold uppercase">
                      {p.name}
                    </div>
                    <div className="text-xs font-mono tabular-nums mt-0.5 text-[#1D1D1F] font-semibold">
                      {formatCurrency(getCheckoutTotal(p, billingCycle))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <dl className="divide-y divide-[#D2D2D7] text-sm border-t border-[#D2D2D7]">
            <div className="py-3 flex items-center justify-between">
              <dt className="text-[#6E6E73]">Plan</dt>
              <dd className="font-semibold text-[#1D1D1F]">{plan.name}</dd>
            </div>
            <div className="py-3 flex items-center justify-between">
              <dt className="text-[#6E6E73]">Billing Cycle</dt>
              <dd className="font-semibold text-[#1D1D1F] capitalize">
                {billingCycle}
              </dd>
            </div>
            <div className="py-3 flex items-center justify-between">
              <dt className="text-[#6E6E73]">Payment Method</dt>
              <dd className="font-semibold text-[#1D1D1F]">Binance Pay</dd>
            </div>
            <div className="pt-4 flex items-center justify-between text-base">
              <dt className="font-semibold text-[#1D1D1F]">Total Due</dt>
              <dd className="text-2xl font-bold text-[#1D1D1F] tabular-nums">
                {formatCurrency(total)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Binance Pay Card */}
        <div className="rounded-2xl bg-[#F5F5F7] border border-[#D2D2D7] p-6 space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#D2D2D7] flex items-center justify-center shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12 3L7.5 7.5L9.2 9.2L12 6.4L14.8 9.2L16.5 7.5L12 3ZM4.5 10.5L2.8 12.2L4.5 13.9L6.2 12.2L4.5 10.5ZM19.5 10.5L17.8 12.2L19.5 13.9L21.2 12.2L19.5 10.5ZM12 9.4L9.4 12L12 14.6L14.6 12L12 9.4ZM12 17.6L9.2 14.8L7.5 16.5L12 21L16.5 16.5L14.8 14.8L12 17.6Z"
                    fill="#1D1D1F"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-[#1D1D1F]">
                  Binance Pay
                </h2>
                <p className="text-xs text-[#6E6E73]">
                  Instant encrypted payment flow
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-white border border-[#D2D2D7] text-[#1D1D1F] text-[11px] font-semibold whitespace-nowrap shrink-0">
              Instant Pay
            </span>
          </div>

          <div className="rounded-xl bg-white border border-[#D2D2D7] divide-y divide-[#D2D2D7] px-4 text-xs">
            <div className="py-3 flex items-center justify-between">
              <span className="text-[#6E6E73]">Status</span>
              <span className="font-semibold text-[#1D1D1F]">
                Awaiting Initiation
              </span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-[#6E6E73]">Reference</span>
              <span className="font-mono font-semibold text-[#1D1D1F] tabular-nums">
                {paymentReference}
              </span>
            </div>
          </div>

          <RippleButton
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => setModalOpen(true)}
          >
            Pay with Binance
          </RippleButton>

          <p className="text-xs text-[#6E6E73] leading-relaxed flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1D1D1F] shrink-0" aria-hidden="true" />
            <span>Protected merchant checkout powered by Binance Pay.</span>
          </p>
        </div>
      </div>

      {/* Binance Payment Instructions Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="binance-modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-2xl bg-white border border-[#D2D2D7] p-6 sm:p-7"
            >
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close Binance payment instructions"
                className="absolute top-4 right-4 w-9 h-9 inline-flex items-center justify-center rounded-full bg-[#F5F5F7] border border-[#D2D2D7] text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="text-center">
                <h3
                  id="binance-modal-title"
                  className="text-xl font-bold text-[#1D1D1F]"
                >
                  Binance Pay Instructions
                </h3>
                <p className="mt-1 text-xs text-[#6E6E73]">
                  Scan the code below in your Binance App to authorize this payment.
                </p>

                <div className="mt-5 mx-auto w-44 h-44 rounded-2xl bg-[#F5F5F7] p-4 flex flex-col items-center justify-center border border-[#D2D2D7]">
                  <QrCode className="w-28 h-28 text-[#1D1D1F]" aria-hidden="true" />
                  <span className="mt-1.5 font-mono text-[10px] font-semibold text-[#6E6E73] uppercase tracking-wider">
                    SCAN WITH BINANCE APP
                  </span>
                </div>

                <div className="mt-5 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] divide-y divide-[#D2D2D7] px-3.5 text-left text-xs">
                  <div className="py-2.5 flex items-center justify-between gap-2">
                    <span className="text-[#6E6E73]">Amount</span>
                    <span className="font-mono font-semibold text-[#1D1D1F] tabular-nums">
                      {formatCurrency(total)} ({plan.name} · {billingCycle})
                    </span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between gap-2">
                    <span className="text-[#6E6E73]">Reference</span>
                    <button
                      type="button"
                      onClick={handleCopyRef}
                      className="inline-flex items-center gap-1.5 font-mono font-semibold text-[#1D1D1F] hover:underline cursor-pointer"
                    >
                      <span>{paymentReference}</span>
                      {copiedRef ? (
                        <Check className="w-3.5 h-3.5 text-[#1D1D1F]" aria-hidden="true" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#6E6E73]" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] px-4 py-2.5 flex items-center justify-center gap-2 text-xs font-medium text-[#6E6E73]">
                  <svg
                    className="animate-spin w-3.5 h-3.5 shrink-0 text-[#1D1D1F]"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-85"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
                    />
                  </svg>
                  <span>Waiting for payment confirmation…</span>
                </div>

                <div className="mt-5">
                  <RippleButton
                    variant="secondary"
                    fullWidth
                    onClick={() => setModalOpen(false)}
                  >
                    Close Instructions
                  </RippleButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
