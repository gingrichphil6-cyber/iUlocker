import React, { useState } from 'react';
import { CheckCircle2, Mail, MessageCircle, Send } from 'lucide-react';
import { sanitizeImeiInput } from '../utils/imei';
import { RippleButton } from './ui/RippleButton';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [serviceType, setServiceType] = useState('Unlock Your Blocked Phone');
  const [imei, setImei] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!message.trim() || message.trim().length < 8) {
      setErrorMsg('Please enter a brief support message (at least 8 characters).');
      return;
    }

    setSubmitted(true);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setImei('');
    setMessage('');
    setSubmitted(false);
    setErrorMsg(null);
  };

  return (
    <section
      id="support"
      className="py-16 sm:py-20 px-4 sm:px-6 border-t border-[#D2D2D7] bg-white"
    >
      <div className="max-w-[680px] mx-auto space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.025em] text-[#1D1D1F]">
            Contact & Support
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-[#6E6E73] leading-relaxed">
            Have questions about unlocking your device? Reach out directly or send us a message below.
          </p>
        </div>

        {/* Support channels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white border border-[#D2D2D7] flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#1D1D1F]">
                Email Support
              </div>
              <div className="text-xs text-[#6E6E73] truncate">
                support@iunlocker.io
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white border border-[#D2D2D7] flex items-center justify-center shrink-0">
              <Send className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#1D1D1F]">
                Telegram
              </div>
              <div className="text-xs text-[#6E6E73] truncate">
                @iUnlockerSupport
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white border border-[#D2D2D7] flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4 text-[#1D1D1F]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#1D1D1F]">
                WhatsApp
              </div>
              <div className="text-xs text-[#6E6E73] truncate">
                +1 (936) 332 3841
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-2xl bg-[#F5F5F7] border border-[#D2D2D7] p-5 sm:p-7">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#1D1D1F] flex items-center justify-center text-white">
                <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
                Support Request Received
              </h3>
              <p className="text-sm text-[#6E6E73] max-w-md mx-auto leading-relaxed">
                Thank you, <span className="text-[#1D1D1F] font-medium">{name}</span>. Your support inquiry for{' '}
                <span className="text-[#1D1D1F] font-medium">{serviceType}</span> has been submitted.
              </p>
              <div className="pt-2">
                <RippleButton variant="secondary" onClick={resetForm}>
                  Send Another Message
                </RippleButton>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {errorMsg && (
                <div
                  role="alert"
                  className="rounded-xl bg-[#FFF2F2] border border-[#F5C2C0] px-4 py-3 text-xs sm:text-sm text-[#B3261E]"
                >
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-medium text-[#6E6E73] mb-1.5"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-[12px] bg-white border border-[#D2D2D7] px-3.5 py-2.5 text-sm text-[#1D1D1F] placeholder:text-[#6E6E73]/60 transition-all focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/15"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-medium text-[#6E6E73] mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-[12px] bg-white border border-[#D2D2D7] px-3.5 py-2.5 text-sm text-[#1D1D1F] placeholder:text-[#6E6E73]/60 transition-all focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-service"
                    className="block text-xs font-medium text-[#6E6E73] mb-1.5"
                  >
                    Service type
                  </label>
                  <select
                    id="contact-service"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full rounded-[12px] bg-white border border-[#D2D2D7] px-3.5 py-2.5 text-sm text-[#1D1D1F] transition-all focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/15"
                  >
                    <option value="Unlock Your Blocked Phone">
                      Unlock Your Blocked Phone
                    </option>
                    <option value="Unlock Network Lock">
                      Unlock Network Lock
                    </option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-imei"
                    className="block text-xs font-medium text-[#6E6E73] mb-1.5"
                  >
                    IMEI (optional)
                  </label>
                  <input
                    id="contact-imei"
                    type="text"
                    inputMode="numeric"
                    maxLength={15}
                    value={imei}
                    onChange={(e) => setImei(sanitizeImeiInput(e.target.value))}
                    placeholder="14 or 15 digit IMEI"
                    className="w-full rounded-[12px] bg-white border border-[#D2D2D7] px-3.5 py-2.5 font-mono text-sm text-[#1D1D1F] placeholder:font-sans placeholder:text-[#6E6E73]/60 transition-all focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/15 tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-medium text-[#6E6E73] mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your device question or support request…"
                  className="w-full rounded-[12px] bg-white border border-[#D2D2D7] px-3.5 py-2.5 text-sm text-[#1D1D1F] placeholder:text-[#6E6E73]/60 transition-all focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/15 resize-y"
                />
              </div>

              <div className="pt-1">
                <RippleButton type="submit" variant="primary" size="lg" fullWidth>
                  Submit Support Request
                </RippleButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
