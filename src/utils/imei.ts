import type { ImeiValidationResult, UnlockServiceType } from '../types';
import type { DeviceCategory } from './deviceCatalog';

export const IMEI_REQUIRED_LENGTH = 15;
export const IMEI_MIN_LENGTH = 14;
export const IMEI_MAX_LENGTH = 15;

export const SERVICE_METADATA: Record<
  UnlockServiceType,
  {
    id: UnlockServiceType;
    title: string;
    shortTitle: string;
    description: string;
  }
> = {
  icloud: {
    id: 'icloud',
    title: 'iCloud / Activation Unlock',
    shortTitle: 'iCloud Unlock',
    description: 'Remove iCloud Activation Lock for your selected Apple device.',
  },
  network: {
    id: 'network',
    title: 'Carrier / Network Unlock',
    shortTitle: 'Network Unlock',
    description: 'Unlock carrier SIM restrictions for worldwide network compatibility.',
  },
};

/**
 * Strips any non-numeric characters and limits IMEI strings to 15 digits.
 */
export function sanitizeImeiInput(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, IMEI_MAX_LENGTH);
}

/**
 * Sanitizes manual device identifier input:
 * - iPhone: 15-digit numeric IMEI only
 * - iPad / Apple Watch: 15-digit numeric IMEI or 10–12 char alphanumeric serial number
 */
export function sanitizeDeviceIdentifier(
  raw: string,
  category: DeviceCategory = 'iphone'
): string {
  if (category === 'apple_watch' || category === 'ipad') {
    return raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, IMEI_MAX_LENGTH);
  }
  return sanitizeImeiInput(raw);
}

/**
 * Validates that an iPhone has a 14 or 15-digit IMEI, or an iPad / Apple Watch has either
 * a 14 or 15-digit numeric IMEI (Cellular) or a 10–12 char alphanumeric Serial Number (Wi-Fi / GPS).
 */
export function validateManualDeviceIdentifier(
  identifier: string,
  category: DeviceCategory = 'iphone'
): ImeiValidationResult {
  const cleaned = sanitizeDeviceIdentifier(identifier, category);

  if (category === 'apple_watch' || category === 'ipad') {
    const isValidImei = /^\d{14,15}$/.test(cleaned);
    const isAppleSerial = /^[A-Z0-9]{10,12}$/.test(cleaned);
    if (isValidImei || isAppleSerial) {
      return {
        valid: true,
        digitCount: cleaned.length,
      };
    }

    const deviceLabel = category === 'ipad' ? 'iPad' : 'Apple Watch';
    return {
      valid: false,
      digitCount: cleaned.length,
      errorHeading: 'INVALID IMEI OR SERIAL',
      errorMessage:
        `Enter a valid 14 or 15-digit IMEI or 10–12 character ${deviceLabel} Serial Number (Dial *#06# or check Settings > General > About).`,
    };
  }

  const digitsOnly = cleaned.replace(/\D/g, '');
  if (!/^\d{14,15}$/.test(digitsOnly)) {
    return {
      valid: false,
      digitCount: digitsOnly.length,
      errorHeading: 'INVALID IMEI',
      errorMessage:
        'Enter a valid 14 or 15-digit IMEI number (Dial *#06# or check Settings > General > About).',
    };
  }

  return {
    valid: true,
    digitCount: digitsOnly.length,
  };
}

/**
 * Partially masks an IMEI/serial for summary displays.
 */
export function maskImei(imei: string): string {
  const clean = imei.trim();
  if (clean.length <= 8) {
    return clean;
  }
  const head = clean.slice(0, 6);
  const tail = clean.slice(-4);
  const maskedLength = Math.max(2, clean.length - 10);
  return `${head}${'•'.repeat(maskedLength)}${tail}`;
}
