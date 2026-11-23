import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Lock,
  Radio,
  Search,
  Smartphone,
  Tablet,
  Watch,
  X,
} from 'lucide-react';
import type {
  ImeiValidationResult,
  UnlockOrderDraft,
  UnlockServiceType,
} from '../types';
import {
  type AppleDeviceModel,
  filterDeviceModels,
} from '../utils/deviceCatalog';
import {
  IMEI_MAX_LENGTH,
  SERVICE_METADATA,
  sanitizeDeviceIdentifier,
  validateManualDeviceIdentifier,
} from '../utils/imei';
import { getDeviceServiceQuotes } from '../utils/unlockPricing';
import { ScanToPayModal } from './ScanToPayModal';
import { RippleButton } from './ui/RippleButton';

interface ImeiCheckerCardProps {
  selectedService: UnlockServiceType;
  onSelectService: (service: UnlockServiceType) => void;
  onOpenImeiHelp: () => void;
}

export const ImeiCheckerCard: React.FC<ImeiCheckerCardProps> = ({
  selectedService,
  onSelectService,
  onOpenImeiHelp,
}) => {
  const [selectedDevice, setSelectedDevice] =
    useState<AppleDeviceModel | null>(null);
  const [serviceChosen, setServiceChosen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deviceQuery, setDeviceQuery] = useState('');

  const [imei, setImei] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [errorState, setErrorState] = useState<ImeiValidationResult | null>(
    null
  );
  const [verifiedOrder, setVerifiedOrder] = useState<UnlockOrderDraft | null>(
    null
  );
  const [scanModalOpen, setScanModalOpen] = useState(false);

  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const imeiInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [dropdownOpen]);

  useEffect(() => {
    if (dropdownOpen) {
      window.setTimeout(() => {
        searchInputRef.current?.focus();
      }, 40);
    }
  }, [dropdownOpen]);

  const filteredDevices = useMemo(
    () => filterDeviceModels(deviceQuery),
    [deviceQuery]
  );

  const quotes = useMemo(() => {
    if (!selectedDevice) return null;
    return getDeviceServiceQuotes(selectedDevice.fullName, 'Apple');
  }, [selectedDevice]);

  const activePrice = useMemo(() => {
    if (!quotes) return 0;
    return selectedService === 'icloud'
      ? quotes.icloudPrice
      : quotes.networkPrice;
  }, [quotes, selectedService]);

  const handleSelectDevice = (device: AppleDeviceModel) => {
    const categoryChanged =
      selectedDevice && selectedDevice.category !== device.category;
    setSelectedDevice(device);
    setDropdownOpen(false);
    setDeviceQuery('');
    setVerifiedOrder(null);
    setErrorState(null);
    if (categoryChanged) {
      setImei('');
    }
  };

  const handleChooseService = (serviceId: UnlockServiceType) => {
    onSelectService(serviceId);
    setServiceChosen(true);
    setVerifiedOrder(null);
    setErrorState(null);
  };

  const handleImeiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const category = selectedDevice?.category ?? 'iphone';
    const sanitized = sanitizeDeviceIdentifier(e.target.value, category);
    setImei(sanitized);
    if (errorState) setErrorState(null);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const category = selectedDevice?.category ?? 'iphone';
    const pasted = e.clipboardData.getData('text');
    const sanitized = sanitizeDeviceIdentifier(pasted, category);
    setImei(sanitized);
    if (errorState) setErrorState(null);
  };

  const handleVerifyAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDevice || !serviceChosen || !quotes) return;

    const clean = sanitizeDeviceIdentifier(imei, selectedDevice.category);
    setImei(clean);

    const validation = validateManualDeviceIdentifier(
      clean,
      selectedDevice.category
    );
    if (!validation.valid) {
      setErrorState(validation);
      return;
    }

    const price =
      selectedService === 'icloud' ? quotes.icloudPrice : quotes.networkPrice;
    setErrorState(null);
    setVerifiedOrder({
      deviceId: selectedDevice.id,
      deviceName: selectedDevice.fullName,
      deviceCategory: selectedDevice.category,
      service: selectedService,
      serviceLabel: SERVICE_METADATA[selectedService].title,
      price,
      imei: clean,
    });
  };

  const handleResetFlow = () => {
    setVerifiedOrder(null);
    setSelectedDevice(null);
    setServiceChosen(false);
    setImei('');
    setErrorState(null);
    setScanModalOpen(false);
  };

  const isWatch = selectedDevice?.category === 'apple_watch';
  const isIpad = selectedDevice?.category === 'ipad';
  const supportsSerial = isWatch || isIpad;
  const currentValidation = selectedDevice
    ? validateManualDeviceIdentifier(imei, selectedDevice.category)
    : { valid: false, digitCount: 0 };

  const services: {
    id: UnlockServiceType;
    title: string;
    description: string;
    price: number;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'icloud',
      title: SERVICE_METADATA.icloud.title,
      description: SERVICE_METADATA.icloud.description,
      price: quotes?.icloudPrice ?? 0,
      icon: (
        <Lock className="w-4 h-4 sm:w-[18px] sm:h-[18px]" aria-hidden="true" />
      ),
    },
    {
      id: 'network',
      title: SERVICE_METADATA.network.title,
      description: SERVICE_METADATA.network.description,
      price: quotes?.networkPrice ?? 0,
      icon: (
        <Radio
          className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
          aria-hidden="true"
        />
      ),
    },
  ];

  const activeStepNumber = verifiedOrder
    ? 4
    : serviceChosen
    ? 3
    : selectedDevice
    ? 2
    : 1;

  return (
    <div className="relative w-full max-w-[680px] mx-auto">
      <div className="rounded-2xl bg-[#F5F5F7] border border-[#D2D2D7] p-5 sm:p-7 text-left space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[#D2D2D7] pb-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-[#1D1D1F]">
              Unlock Your Blocked Phone
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6E73] mt-0.5">
              Select your Apple device, service needed, and 15-digit IMEI
            </p>
          </div>

          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-[#D2D2D7] font-mono text-[11px] font-semibold text-[#1D1D1F] shrink-0">
            Step {activeStepNumber} / 4
          </span>
        </div>

        {/* Step 4: "Unlock Available" + Cross-Check Alert */}
        {verifiedOrder ? (
          <div
            aria-label="Unlock Availability Confirmation"
            className="space-y-4"
          >
            <div className="rounded-2xl bg-white border border-[#D2D2D7] p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D1D1F] text-white text-xs font-semibold">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                  <span>Unlock Available</span>
                </div>

                <button
                  type="button"
                  onClick={() => setVerifiedOrder(null)}
                  className="text-xs font-medium text-[#6E6E73] hover:text-[#1D1D1F] underline underline-offset-4 cursor-pointer"
                >
                  Edit Details
                </button>
              </div>

              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold tracking-[-0.02em] text-[#1D1D1F]">
                  Unlock Available
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#6E6E73]">
                  Your device and service selection are ready for checkout.
                </p>
              </div>

              <dl className="divide-y divide-[#D2D2D7] border-t border-[#D2D2D7] text-sm">
                <div className="py-3 flex items-center justify-between gap-4">
                  <dt className="text-[#6E6E73] shrink-0">Selected Device</dt>
                  <dd className="font-semibold text-[#1D1D1F] text-right">
                    {verifiedOrder.deviceName}
                  </dd>
                </div>
                <div className="py-3 flex items-center justify-between gap-4">
                  <dt className="text-[#6E6E73] shrink-0">Chosen Service</dt>
                  <dd className="font-semibold text-[#1D1D1F] text-right">
                    {verifiedOrder.serviceLabel}
                  </dd>
                </div>
                <div className="py-3 flex items-center justify-between gap-4">
                  <dt className="text-[#6E6E73] shrink-0">Service Price</dt>
                  <dd className="font-mono font-bold text-base text-[#1D1D1F] tabular-nums">
                    ${verifiedOrder.price}
                  </dd>
                </div>
                <div className="py-3 flex items-center justify-between gap-4">
                  <dt className="text-[#6E6E73] shrink-0">
                    {verifiedOrder.deviceCategory === 'apple_watch' ||
                    verifiedOrder.deviceCategory === 'ipad'
                      ? 'IMEI / Serial'
                      : 'Device IMEI'}
                  </dt>
                  <dd className="font-mono font-semibold text-[#1D1D1F] tabular-nums">
                    {verifiedOrder.imei}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Step 4 Prominent Cross-Check Notification */}
            <div
              role="alert"
              className="rounded-xl bg-white border border-[#1D1D1F]/35 p-4 flex items-start gap-3"
            >
              <AlertTriangle
                className="w-5 h-5 text-[#1D1D1F] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-xs sm:text-sm font-medium text-[#1D1D1F] leading-relaxed">
                Please cross-check your IMEI very well before proceeding, as unlock orders cannot be reversed once submitted.
              </p>
            </div>

            <RippleButton
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setScanModalOpen(true)}
            >
              I Have Verified My IMEI — Proceed to Pay
            </RippleButton>
          </div>
        ) : (
          <form onSubmit={handleVerifyAvailability} noValidate className="space-y-5">
            {/* Step 1: Select Device (Categorized & Searchable Dropdown) */}
            <div ref={dropdownContainerRef} className="relative">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="device-select-trigger"
                  className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]"
                >
                  Step 1 · Select Device
                </label>
                {selectedDevice && (
                  <span className="text-[11px] font-medium text-[#1D1D1F]">
                    {selectedDevice.categoryLabel}
                  </span>
                )}
              </div>

              <button
                id="device-select-trigger"
                type="button"
                role="combobox"
                aria-expanded={dropdownOpen}
                aria-haspopup="listbox"
                aria-controls="device-catalog-listbox"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={`w-full rounded-[14px] bg-white border px-4 py-3.5 text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                  dropdownOpen
                    ? 'border-[#1D1D1F] ring-2 ring-[#1D1D1F]/15'
                    : selectedDevice
                    ? 'border-[#1D1D1F]'
                    : 'border-[#D2D2D7] hover:border-[#86868B]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {selectedDevice?.category === 'apple_watch' ? (
                    <Watch
                      className="w-4 h-4 text-[#1D1D1F] shrink-0"
                      aria-hidden="true"
                    />
                  ) : selectedDevice?.category === 'ipad' ? (
                    <Tablet
                      className="w-4 h-4 text-[#1D1D1F] shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <Smartphone
                      className={`w-4 h-4 shrink-0 ${
                        selectedDevice ? 'text-[#1D1D1F]' : 'text-[#6E6E73]'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`text-sm sm:text-base truncate ${
                      selectedDevice
                        ? 'font-semibold text-[#1D1D1F]'
                        : 'text-[#6E6E73]'
                    }`}
                  >
                    {selectedDevice
                      ? selectedDevice.fullName
                      : 'Select iPhone, iPad, or Apple Watch model'}
                  </span>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-[#6E6E73] shrink-0 transition-transform duration-150 ${
                    dropdownOpen ? 'rotate-180 text-[#1D1D1F]' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {dropdownOpen && (
                <div className="mt-2 rounded-2xl bg-white border border-[#D2D2D7] overflow-hidden shadow-lg">
                  <div className="p-2.5 border-b border-[#D2D2D7] bg-[#F5F5F7]">
                    <div className="relative">
                      <Search
                        className="w-4 h-4 text-[#6E6E73] absolute left-3 top-1/2 -translate-y-1/2"
                        aria-hidden="true"
                      />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={deviceQuery}
                        onChange={(e) => setDeviceQuery(e.target.value)}
                        placeholder="Search iPhone, iPad, or Apple Watch..."
                        aria-label="Search device model"
                        className="w-full rounded-xl bg-white border border-[#D2D2D7] pl-9 pr-8 py-2 text-sm text-[#1D1D1F] placeholder:text-[#6E6E73]/70 focus:outline-none focus:border-[#1D1D1F]"
                      />
                      {deviceQuery && (
                        <button
                          type="button"
                          onClick={() => setDeviceQuery('')}
                          aria-label="Clear device search"
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6E6E73] hover:text-[#1D1D1F] cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div
                    id="device-catalog-listbox"
                    role="listbox"
                    aria-label="Supported Apple devices"
                    className="max-h-[260px] overflow-y-auto divide-y divide-[#D2D2D7]/50"
                  >
                    {filteredDevices.iphones.length === 0 &&
                    filteredDevices.ipads.length === 0 &&
                    filteredDevices.watches.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-[#6E6E73]">
                        No matching iPhone, iPad, or Apple Watch models found.
                      </div>
                    ) : (
                      <>
                        {filteredDevices.iphones.length > 0 && (
                          <div>
                            <div className="sticky top-0 bg-[#F5F5F7] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73] border-b border-[#D2D2D7]">
                              iPhone Series ({filteredDevices.iphones.length})
                            </div>
                            <div className="py-1">
                              {filteredDevices.iphones.map((device) => {
                                const active =
                                  selectedDevice?.id === device.id;
                                return (
                                  <button
                                    key={device.id}
                                    type="button"
                                    role="option"
                                    aria-selected={active}
                                    onClick={() => handleSelectDevice(device)}
                                    className={`w-full px-3.5 py-2.5 text-left text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                                      active
                                        ? 'bg-[#F5F5F7] font-semibold text-[#1D1D1F]'
                                        : 'text-[#1D1D1F] hover:bg-[#F5F5F7]/70'
                                    }`}
                                  >
                                    <span>{device.label}</span>
                                    {active && (
                                      <Check
                                        className="w-4 h-4 text-[#1D1D1F] shrink-0"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {filteredDevices.ipads.length > 0 && (
                          <div>
                            <div className="sticky top-0 bg-[#F5F5F7] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73] border-y border-[#D2D2D7]">
                              iPad Series ({filteredDevices.ipads.length})
                            </div>
                            <div className="py-1">
                              {filteredDevices.ipads.map((device) => {
                                const active =
                                  selectedDevice?.id === device.id;
                                return (
                                  <button
                                    key={device.id}
                                    type="button"
                                    role="option"
                                    aria-selected={active}
                                    onClick={() => handleSelectDevice(device)}
                                    className={`w-full px-3.5 py-2.5 text-left text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                                      active
                                        ? 'bg-[#F5F5F7] font-semibold text-[#1D1D1F]'
                                        : 'text-[#1D1D1F] hover:bg-[#F5F5F7]/70'
                                    }`}
                                  >
                                    <span>{device.label}</span>
                                    {active && (
                                      <Check
                                        className="w-4 h-4 text-[#1D1D1F] shrink-0"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {filteredDevices.watches.length > 0 && (
                          <div>
                            <div className="sticky top-0 bg-[#F5F5F7] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73] border-y border-[#D2D2D7]">
                              Apple Watch Series (
                              {filteredDevices.watches.length})
                            </div>
                            <div className="py-1">
                              {filteredDevices.watches.map((device) => {
                                const active =
                                  selectedDevice?.id === device.id;
                                return (
                                  <button
                                    key={device.id}
                                    type="button"
                                    role="option"
                                    aria-selected={active}
                                    onClick={() => handleSelectDevice(device)}
                                    className={`w-full px-3.5 py-2.5 text-left text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                                      active
                                        ? 'bg-[#F5F5F7] font-semibold text-[#1D1D1F]'
                                        : 'text-[#1D1D1F] hover:bg-[#F5F5F7]/70'
                                    }`}
                                  >
                                    <span>{device.label}</span>
                                    {active && (
                                      <Check
                                        className="w-4 h-4 text-[#1D1D1F] shrink-0"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Choose Service Needed (Displayed once device is selected) */}
            {selectedDevice && quotes && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
                    Step 2 · Choose Service Needed
                  </span>
                  <span className="text-[11px] text-[#6E6E73]">
                    {quotes.tierLabel}
                  </span>
                </div>

                <div
                  role="radiogroup"
                  aria-label="Choose unlock service needed"
                  className="grid grid-cols-2 gap-2.5 sm:gap-3"
                >
                  {services.map((service) => {
                    const isSelected =
                      serviceChosen && selectedService === service.id;
                    return (
                      <button
                        key={service.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => handleChooseService(service.id)}
                        className={`relative text-left rounded-xl p-3.5 sm:p-4 border transition-all duration-150 cursor-pointer min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F] ${
                          isSelected
                            ? 'bg-white border-[#1D1D1F] ring-1 ring-[#1D1D1F]'
                            : 'bg-white/75 border-[#D2D2D7] hover:bg-white hover:border-[#86868B]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
                              isSelected
                                ? 'bg-[#1D1D1F] border-[#1D1D1F] text-white'
                                : 'bg-[#F5F5F7] border-[#D2D2D7] text-[#6E6E73]'
                            }`}
                          >
                            {service.icon}
                          </div>

                          <div
                            className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                              isSelected
                                ? 'bg-[#1D1D1F] border-[#1D1D1F] text-white'
                                : 'bg-white border-[#D2D2D7] text-transparent'
                            }`}
                            aria-hidden="true"
                          >
                            <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                          </div>
                        </div>

                        <div className="mt-2.5">
                          <div className="font-display text-xs sm:text-sm font-semibold text-[#1D1D1F] leading-tight">
                            {service.title}
                          </div>
                          <div className="mt-1 font-mono text-lg sm:text-xl font-bold text-[#1D1D1F] tabular-nums">
                            ${service.price}
                          </div>
                          <p className="hidden sm:block mt-1 text-xs text-[#6E6E73] leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Manual IMEI / Serial Input (Displayed after choosing service) */}
            {selectedDevice && serviceChosen && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label
                      htmlFor="imei-input"
                      className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]"
                    >
                      {supportsSerial
                        ? 'Step 3 · Enter 15-Digit IMEI or Serial Number'
                        : 'Step 3 · Enter 15-Digit IMEI'}
                    </label>

                    <span
                      className={`font-mono text-xs tabular-nums transition-colors ${
                        currentValidation.valid
                          ? 'text-[#1D1D1F] font-semibold'
                          : 'text-[#6E6E73]'
                      }`}
                    >
                      {imei.length}/{IMEI_MAX_LENGTH}
                    </span>
                  </div>

                  <div
                    className={`relative rounded-[14px] border transition-all duration-150 bg-white ${
                      isFocused
                        ? 'border-[#1D1D1F] ring-2 ring-[#1D1D1F]/15'
                        : currentValidation.valid
                        ? 'border-[#1D1D1F]'
                        : errorState
                        ? 'border-[#E5B8B8]'
                        : 'border-[#D2D2D7] hover:border-[#86868B]'
                    }`}
                  >
                    <input
                      ref={imeiInputRef}
                      id="imei-input"
                      type="text"
                      inputMode={supportsSerial ? 'text' : 'numeric'}
                      autoComplete="off"
                      maxLength={IMEI_MAX_LENGTH}
                      value={imei}
                      onChange={handleImeiChange}
                      onPaste={handlePaste}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder={
                        isIpad
                          ? 'Enter 15-digit IMEI or Wi-Fi iPad Serial Number'
                          : isWatch
                          ? 'Enter 15-digit IMEI or GPS Watch Serial Number'
                          : 'Enter your 15-digit IMEI number'
                      }
                      aria-describedby="imei-supporting-text"
                      className="w-full bg-transparent px-4 py-3.5 pr-12 font-mono text-base sm:text-lg tracking-wider text-[#1D1D1F] placeholder:text-[#6E6E73]/65 placeholder:font-sans placeholder:tracking-normal focus:outline-none tabular-nums"
                    />

                    {imei.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setImei('');
                          setErrorState(null);
                          imeiInputRef.current?.focus();
                        }}
                        aria-label="Clear IMEI input"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 inline-flex items-center justify-center rounded-full bg-[#F5F5F7] text-[#6E6E73] hover:text-[#1D1D1F] border border-[#D2D2D7] transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>

                  {errorState && (
                    <p
                      role="alert"
                      className="mt-2 text-xs font-medium text-[#B3261E]"
                    >
                      {errorState.errorMessage}
                    </p>
                  )}

                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span id="imei-supporting-text" className="text-[#6E6E73]">
                      Dial *#06# or check Settings &gt; General &gt; About
                    </span>

                    <button
                      type="button"
                      onClick={onOpenImeiHelp}
                      className="text-[#1D1D1F] hover:text-[#6E6E73] font-medium underline underline-offset-4 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F] rounded"
                    >
                      Where can I find my IMEI?
                    </button>
                  </div>
                </div>

                <RippleButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="font-display font-semibold tracking-wide text-sm sm:text-base"
                >
                  Check Unlock Availability · ${activePrice}
                </RippleButton>
              </div>
            )}
          </form>
        )}
      </div>

      <ScanToPayModal
        open={scanModalOpen}
        order={verifiedOrder}
        onClose={() => setScanModalOpen(false)}
        onOrderComplete={handleResetFlow}
      />
    </div>
  );
};
