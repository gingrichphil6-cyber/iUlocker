import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  Copy,
  ImagePlus,
  Loader2,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import type { UnlockOrderDraft } from '../types';
import {
  buildAutoPaymentNote,
  validateUnlockOrderEmail,
} from '../utils/unlockPricing';
import { RippleButton } from './ui/RippleButton';

interface ScanToPayModalProps {
  open: boolean;
  order: UnlockOrderDraft | null;
  onClose: () => void;
  onOrderComplete: () => void;
}

interface SubmittedReceiptState {
  orderRef: string;
  customerEmail: string;
  recipient: string;
}

const BINANCE_QR_IMAGE_PATH =
  '/assets/aistudio/qr-image-1795458884188_0ae744d2.png';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export const ScanToPayModal: React.FC<ScanToPayModalProps> = ({
  open,
  order,
  onClose,
  onOrderComplete,
}) => {
  const [copiedNote, setCopiedNote] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<SubmittedReceiptState | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, isSubmitting, onClose]);

  useEffect(() => {
    if (!open) {
      setCopiedNote(false);
      setCustomerEmail('');
      setReceiptFile(null);
      setSubmitError(null);
      setSubmitted(null);
      setIsSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    if (!receiptFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(receiptFile);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [receiptFile]);

  const autoPaymentNote = useMemo(() => {
    if (!order) return '';
    return buildAutoPaymentNote({
      deviceName: order.deviceName,
      brand: 'Apple',
      imei: order.imei,
      service: order.service,
      price: order.price,
    });
  }, [order]);

  const emailCheck = useMemo(
    () => validateUnlockOrderEmail(customerEmail),
    [customerEmail]
  );

  const canSubmit =
    Boolean(order) && emailCheck.valid && Boolean(receiptFile) && !isSubmitting;

  const handleCopyNote = async () => {
    if (!autoPaymentNote) return;
    try {
      await navigator.clipboard.writeText(autoPaymentNote);
      setCopiedNote(true);
      window.setTimeout(() => setCopiedNote(false), 2000);
    } catch {
      setCopiedNote(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSubmitError(null);
    if (!file) {
      setReceiptFile(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setSubmitError(
        'Please upload a valid image screenshot (PNG, JPG, JPEG, or WEBP).'
      );
      setReceiptFile(null);
      return;
    }
    setReceiptFile(file);
  };

  const handleRemoveFile = () => {
    setReceiptFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !canSubmit || !receiptFile) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append('device', order.deviceName);
      formData.append('service', order.serviceLabel);
      formData.append('price', String(order.price));
      formData.append('imei', order.imei);
      formData.append('customerEmail', customerEmail.trim());
      formData.append('screenshot', receiptFile);

      const res = await fetch('/api/submit-order', {
        method: 'POST',
        body: formData,
      });

      const data = (await res.json().catch(() => null)) as {
        success?: boolean;
        orderRef?: string;
        recipient?: string;
        error?: string;
      } | null;

      if (!res.ok || !data?.success) {
        throw new Error(
          data?.error || 'Unable to submit order. Please check your details and try again.'
        );
      }

      setSubmitted({
        orderRef: data.orderRef || 'IUNL-ORDER',
        customerEmail: customerEmail.trim(),
        recipient: data.recipient || 'Binancecareplus@gmail.com',
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Unable to submit order. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open || !order) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="scan-to-pay-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/55 backdrop-blur-sm overflow-y-auto"
      onClick={() => {
        if (!isSubmitting) onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[580px] max-h-[92vh] overflow-y-auto rounded-2xl bg-white border border-[#D2D2D7] shadow-2xl p-5 sm:p-6 my-auto text-left"
      >
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              aria-label="Close Scan to Pay modal"
              className="absolute top-4 right-4 w-9 h-9 inline-flex items-center justify-center rounded-full bg-[#F5F5F7] border border-[#D2D2D7] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer disabled:opacity-50"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>

            {submitted ? (
              <div
                aria-label="Order Confirmation"
                className="py-4 text-center space-y-5"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#1D1D1F] text-white flex items-center justify-center">
                  <Check className="w-7 h-7 stroke-[2.5]" aria-hidden="true" />
                </div>

                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F5F5F7] border border-[#D2D2D7] text-[11px] font-semibold text-[#1D1D1F] uppercase tracking-wider mb-3">
                    {order.serviceLabel}
                  </span>
                  <h2
                    id="scan-to-pay-title"
                    className="font-display text-xl sm:text-2xl font-bold tracking-[-0.02em] text-[#1D1D1F]"
                  >
                    Order Confirmed
                  </h2>
                  <p className="mt-2.5 text-sm sm:text-base text-[#1D1D1F] leading-relaxed max-w-md mx-auto">
                    Order Submitted! Your payment proof and device details have been forwarded. Updates will be sent to{' '}
                    <span className="font-semibold underline underline-offset-2">
                      {submitted.customerEmail}
                    </span>
                    .
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F5F5F7] border border-[#D2D2D7] overflow-hidden text-left">
                  <div className="px-5 py-3.5 border-b border-[#D2D2D7] flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1D1D1F]">
                      Forwarded Order Summary
                    </span>
                    <span className="font-mono text-[#6E6E73] tabular-nums">
                      {submitted.orderRef}
                    </span>
                  </div>
                  <dl className="divide-y divide-[#D2D2D7] px-5 text-xs sm:text-sm">
                    <div className="py-3 flex items-center justify-between gap-4">
                      <dt className="text-[#6E6E73]">Selected Device</dt>
                      <dd className="font-semibold text-[#1D1D1F] text-right">
                        {order.deviceName}
                      </dd>
                    </div>
                    <div className="py-3 flex items-center justify-between gap-4">
                      <dt className="text-[#6E6E73]">Selected Service</dt>
                      <dd className="font-semibold text-[#1D1D1F] text-right">
                        {order.serviceLabel}
                      </dd>
                    </div>
                    <div className="py-3 flex items-center justify-between gap-4">
                      <dt className="text-[#6E6E73]">Price Paid</dt>
                      <dd className="font-mono font-bold text-[#1D1D1F] tabular-nums">
                        ${order.price}
                      </dd>
                    </div>
                    <div className="py-3 flex items-center justify-between gap-4">
                      <dt className="text-[#6E6E73]">Device IMEI / Serial</dt>
                      <dd className="font-mono font-semibold text-[#1D1D1F] tabular-nums">
                        {order.imei}
                      </dd>
                    </div>
                    <div className="py-3 flex items-center justify-between gap-4">
                      <dt className="text-[#6E6E73]">Customer Email</dt>
                      <dd className="font-semibold text-[#1D1D1F] text-right break-words">
                        {submitted.customerEmail}
                      </dd>
                    </div>
                    <div className="py-3 flex items-center justify-between gap-4">
                      <dt className="text-[#6E6E73]">Forwarded To</dt>
                      <dd className="font-mono text-xs font-semibold text-[#1D1D1F] text-right">
                        {submitted.recipient}
                      </dd>
                    </div>
                  </dl>
                </div>

                <RippleButton
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={onOrderComplete}
                >
                  Done &amp; Return to Checker
                </RippleButton>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Modal Header */}
                <div className="pr-10">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#F5F5F7] border border-[#D2D2D7] text-[11px] font-semibold text-[#6E6E73] uppercase tracking-wider">
                    Scan to Pay
                  </span>
                  <h2
                    id="scan-to-pay-title"
                    className="mt-1.5 font-display text-xl sm:text-2xl font-bold tracking-[-0.025em] text-[#1D1D1F]"
                  >
                    Complete Payment for {order.deviceName}
                  </h2>
                  <p className="mt-0.5 text-xs sm:text-sm text-[#6E6E73]">
                    {order.serviceLabel} ·{' '}
                    <span className="font-mono text-[#1D1D1F]">{order.imei}</span>
                  </p>
                </div>

                {/* QR Code & Auto Payment Note */}
                <div className="rounded-2xl bg-[#F5F5F7] border border-[#D2D2D7] p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-[176px_1fr] gap-4 items-start">
                    <div className="w-full max-w-[180px] mx-auto sm:mx-0 rounded-2xl overflow-hidden border border-[#D2D2D7] bg-[#1E2329]">
                      <img
                        src={BINANCE_QR_IMAGE_PATH}
                        alt="Scan with Binance App to pay"
                        className="w-full h-auto block"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-xl bg-white border border-[#D2D2D7] px-4 py-3 flex items-center justify-between gap-3">
                        <span className="text-xs font-medium text-[#6E6E73]">
                          Amount Due
                        </span>
                        <span className="font-mono text-xl font-bold text-[#1D1D1F] tabular-nums">
                          ${order.price}
                        </span>
                      </div>

                      <div className="rounded-xl bg-white border border-[#D2D2D7] p-3.5 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6E6E73]">
                            Auto Payment Note
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyNote}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F5F5F7] border border-[#D2D2D7] text-[11px] font-semibold text-[#1D1D1F] hover:border-[#1D1D1F] transition-colors cursor-pointer"
                          >
                            {copiedNote ? (
                              <>
                                <Check className="w-3 h-3" aria-hidden="true" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" aria-hidden="true" />
                                <span>Copy Note</span>
                              </>
                            )}
                          </button>
                        </div>

                        <p
                          data-testid="modal-auto-payment-note"
                          className="font-mono text-[11px] sm:text-xs text-[#1D1D1F] bg-[#F5F5F7] border border-[#D2D2D7] rounded-lg px-2.5 py-2 select-all break-words leading-relaxed"
                        >
                          {autoPaymentNote}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 5: Confirm Payment & Submit Order */}
                <form
                  onSubmit={handleSubmitOrder}
                  encType="multipart/form-data"
                  noValidate
                  className="rounded-2xl bg-[#F5F5F7] border border-[#D2D2D7] p-4 sm:p-5 space-y-4"
                >
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-[#1D1D1F]">
                      Confirm Payment &amp; Submit Order
                    </h3>
                    <p className="mt-0.5 text-xs text-[#6E6E73]">
                      Enter your email and upload your payment receipt screenshot to submit your unlock order.
                    </p>
                  </div>

                  {/* Customer Email */}
                  <div>
                    <label
                      htmlFor="order-customer-email"
                      className="block text-xs font-semibold text-[#1D1D1F] mb-1.5"
                    >
                      Customer Email
                    </label>
                    <input
                      id="order-customer-email"
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => {
                        setCustomerEmail(e.target.value);
                        if (submitError) setSubmitError(null);
                      }}
                      placeholder="Enter your email address for unlock updates"
                      className="w-full rounded-[12px] bg-white border border-[#D2D2D7] px-3.5 py-2.5 text-sm text-[#1D1D1F] placeholder:text-[#6E6E73]/65 transition-all focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/15"
                    />
                  </div>

                  {/* Transaction Receipt / Screenshot Upload */}
                  <div>
                    <label
                      htmlFor="order-receipt-upload"
                      className="block text-xs font-semibold text-[#1D1D1F] mb-1.5"
                    >
                      Transaction Receipt / Screenshot
                    </label>

                    <input
                      ref={fileInputRef}
                      id="order-receipt-upload"
                      name="screenshot"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp,image/*"
                      required
                      onChange={handleFileChange}
                      className="sr-only"
                    />

                    {receiptFile && previewUrl ? (
                      <div className="rounded-[12px] bg-white border border-[#D2D2D7] p-3 flex items-center gap-3.5">
                        <img
                          src={previewUrl}
                          alt="Payment receipt preview"
                          className="w-16 h-16 rounded-lg object-cover border border-[#D2D2D7] shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-[#1D1D1F] truncate">
                            {receiptFile.name}
                          </div>
                          <div className="text-[11px] text-[#6E6E73] mt-0.5 tabular-nums">
                            {formatFileSize(receiptFile.size)}
                          </div>
                          <div className="mt-1.5 flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-[11px] font-semibold text-[#1D1D1F] underline underline-offset-2 cursor-pointer"
                            >
                              Replace image
                            </button>
                            <button
                              type="button"
                              onClick={handleRemoveFile}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#B3261E] hover:underline cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" aria-hidden="true" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full rounded-[12px] bg-white border border-dashed border-[#D2D2D7] hover:border-[#1D1D1F] px-4 py-5 text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-1.5"
                      >
                        <ImagePlus
                          className="w-6 h-6 text-[#6E6E73]"
                          aria-hidden="true"
                        />
                        <span className="text-xs font-semibold text-[#1D1D1F]">
                          Upload payment screenshot (PNG, JPG, JPEG, WEBP)
                        </span>
                        <span className="text-[11px] text-[#6E6E73]">
                          Click to browse your device files
                        </span>
                      </button>
                    )}
                  </div>

                  {submitError && (
                    <p
                      role="alert"
                      className="text-xs font-medium text-[#B3261E] bg-[#FFF2F2] border border-[#E5B8B8] rounded-xl px-3.5 py-2.5"
                    >
                      {submitError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full min-h-[50px] rounded-full bg-[#1D1D1F] text-white font-display text-sm font-semibold px-6 py-3 flex items-center justify-center gap-2 transition-all cursor-pointer hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F5F7]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2
                          className="w-4 h-4 animate-spin"
                          aria-hidden="true"
                        />
                        <span>Submitting order...</span>
                      </>
                    ) : (
                      <span>Submit Order</span>
                    )}
                  </button>

                  <p className="text-[11px] text-[#6E6E73] flex items-center justify-center gap-1.5">
                    <ShieldCheck
                      className="w-3.5 h-3.5 text-[#1D1D1F]"
                      aria-hidden="true"
                    />
                    <span>Encrypted payment confirmation</span>
                  </p>
                </form>
              </div>
            )}
      </div>
    </div>
  );
};
