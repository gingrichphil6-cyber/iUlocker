import type { UnlockServiceType } from '../types';

export interface DeviceUnlockQuote {
  icloudPrice: number;
  networkPrice: number;
  price: number;
  tierLabel: string;
}

interface DualServiceRule {
  pattern: RegExp;
  icloudPrice: number;
  networkPrice: number;
  tierLabel: string;
}

const IPHONE_PRICE_RULES: DualServiceRule[] = [
  {
    pattern: /\biphone\s*(?:18(?:\s*(?:air|pro(?:\s*max)?|plus))?|duo)\b/i,
    icloudPrice: 180,
    networkPrice: 100,
    tierLabel: 'Apple Flagship Tier (iPhone 18 Series)',
  },
  {
    pattern: /\biphone\s*(?:17(?:\s*(?:air|pro(?:\s*max)?|plus|e))?|air)\b/i,
    icloudPrice: 165,
    networkPrice: 95,
    tierLabel: 'Apple Flagship Tier (iPhone 17 Series)',
  },
  {
    pattern: /\biphone\s*16\s*pro\s*max\b/i,
    icloudPrice: 150,
    networkPrice: 90,
    tierLabel: 'Apple Flagship Tier (iPhone 16 Pro Max)',
  },
  {
    pattern: /\biphone\s*16\s*pro\b/i,
    icloudPrice: 140,
    networkPrice: 90,
    tierLabel: 'Apple Pro Tier (iPhone 16 Pro)',
  },
  {
    pattern: /\biphone\s*16(?:\s*(?:plus|e)|e)?\b/i,
    icloudPrice: 130,
    networkPrice: 90,
    tierLabel: 'Apple Standard Tier (iPhone 16 / Plus / 16e)',
  },
  {
    pattern: /\biphone\s*15\s*pro(?:\s*max)?\b/i,
    icloudPrice: 115,
    networkPrice: 90,
    tierLabel: 'Apple Pro Tier (iPhone 15 Pro / Max)',
  },
  {
    pattern: /\biphone\s*15(?:\s*plus)?\b/i,
    icloudPrice: 100,
    networkPrice: 85,
    tierLabel: 'Apple Standard Tier (iPhone 15 / Plus)',
  },
  {
    pattern: /\biphone\s*14\s*pro(?:\s*max)?\b/i,
    icloudPrice: 85,
    networkPrice: 85,
    tierLabel: 'Apple Pro Tier (iPhone 14 Pro / Max)',
  },
  {
    pattern: /\biphone\s*14(?:\s*plus)?\b/i,
    icloudPrice: 75,
    networkPrice: 80,
    tierLabel: 'Apple Modern Tier (iPhone 14 / Plus)',
  },
  {
    pattern: /\biphone\s*13\s*pro(?:\s*max)?\b/i,
    icloudPrice: 65,
    networkPrice: 75,
    tierLabel: 'Apple Pro Tier (iPhone 13 Pro / Max)',
  },
  {
    pattern: /\biphone\s*se\s*\(?(?:3rd(?:\s*gen)?|2022)\)?\b/i,
    icloudPrice: 55,
    networkPrice: 65,
    tierLabel: 'Apple Modern Tier (iPhone SE 3rd Gen)',
  },
  {
    pattern: /\biphone\s*13(?:\s*mini)?\b/i,
    icloudPrice: 55,
    networkPrice: 65,
    tierLabel: 'Apple Modern Tier (iPhone 13 / mini)',
  },
  {
    pattern: /\biphone\s*12\s*pro(?:\s*max)?\b/i,
    icloudPrice: 50,
    networkPrice: 60,
    tierLabel: 'Apple Core Tier (iPhone 12 Pro / Max)',
  },
  {
    pattern: /\biphone\s*12(?:\s*mini)?\b/i,
    icloudPrice: 45,
    networkPrice: 55,
    tierLabel: 'Apple Core Tier (iPhone 12 / mini)',
  },
  {
    pattern: /\biphone\s*11\s*pro(?:\s*max)?\b/i,
    icloudPrice: 40,
    networkPrice: 50,
    tierLabel: 'Apple Core Tier (iPhone 11 Pro / Max)',
  },
  {
    pattern: /\biphone\s*se\s*\(?(?:2nd(?:\s*gen)?|2020)\)?\b/i,
    icloudPrice: 35,
    networkPrice: 45,
    tierLabel: 'Apple Core Tier (iPhone SE 2nd Gen)',
  },
  {
    pattern: /\biphone\s*11\b/i,
    icloudPrice: 35,
    networkPrice: 45,
    tierLabel: 'Apple Core Tier (iPhone 11)',
  },
  {
    pattern: /\biphone\s*xs(?:\s*max)?\b/i,
    icloudPrice: 30,
    networkPrice: 40,
    tierLabel: 'Apple A12 Bionic Tier (iPhone XS / XS Max)',
  },
  {
    pattern: /\biphone\s*xr\b/i,
    icloudPrice: 25,
    networkPrice: 35,
    tierLabel: 'Apple A12 Bionic Tier (iPhone XR)',
  },
  {
    pattern: /\biphone\s*8(?:\s*plus)?\b/i,
    icloudPrice: 20,
    networkPrice: 25,
    tierLabel: 'Pre-A12 Budget Tier (iPhone 8 / 8 Plus)',
  },
  {
    pattern: /\biphone\s*x\b/i,
    icloudPrice: 17,
    networkPrice: 30,
    tierLabel: 'Pre-A12 Classic Tier (iPhone X)',
  },
  {
    pattern: /\biphone\s*7(?:\s*plus)?\b/i,
    icloudPrice: 17,
    networkPrice: 20,
    tierLabel: 'Pre-A12 Budget Tier (iPhone 7 / 7 Plus)',
  },
  {
    pattern: /\biphone\s*6s(?:\s*plus)?\b/i,
    icloudPrice: 15,
    networkPrice: 18,
    tierLabel: 'Pre-A12 Budget Tier (iPhone 6s / 6s Plus)',
  },
  {
    pattern: /\biphone\s*(?:6(?:\s*plus)?|se(?:\s*\(?1st(?:\s*gen)?\)?)?)\b/i,
    icloudPrice: 12,
    networkPrice: 15,
    tierLabel: 'Pre-A12 Budget Tier (iPhone 6 / SE 1st Gen)',
  },
  {
    pattern:
      /\biphone\s*(?:\(?1st(?:\s*gen)?\)?|3gs?|4s?|5[cs]?)\b/i,
    icloudPrice: 12,
    networkPrice: 15,
    tierLabel: 'Pre-A12 Classic Tier',
  },
];

const IPAD_PRICE_RULES: DualServiceRule[] = [
  {
    pattern: /\bipad\s*pro\b.*\bm[45]\b/i,
    icloudPrice: 145,
    networkPrice: 90,
    tierLabel: 'iPad Pro Flagship Tier (M4 / M5)',
  },
  {
    pattern:
      /\bipad\s*pro\b.*(?:11-inch\s*\((?:3rd|4th)\s*gen\)|12\.9-inch\s*\((?:5th|6th)\s*gen\))/i,
    icloudPrice: 105,
    networkPrice: 80,
    tierLabel: 'iPad Pro Apple Silicon Tier',
  },
  {
    pattern:
      /\bipad\s*pro\b.*(?:10\.5-inch|11-inch\s*\((?:1st|2nd)\s*gen\)|12\.9-inch\s*\((?:2nd|3rd|4th)\s*gen\))/i,
    icloudPrice: 75,
    networkPrice: 65,
    tierLabel: 'iPad Pro Core Tier',
  },
  {
    pattern: /\bipad\s*pro\b.*(?:9\.7-inch|12\.9-inch\s*\(1st\s*gen\))/i,
    icloudPrice: 45,
    networkPrice: 50,
    tierLabel: 'iPad Pro Classic Tier',
  },
  {
    pattern: /\bipad\s*air\b.*\bm[234]\b/i,
    icloudPrice: 115,
    networkPrice: 80,
    tierLabel: 'iPad Air Apple Silicon Tier (M2–M4)',
  },
  {
    pattern: /\bipad\s*air\b.*\((?:4th|5th)\s*gen\)/i,
    icloudPrice: 75,
    networkPrice: 65,
    tierLabel: 'iPad Air Modern Tier',
  },
  {
    pattern: /\bipad\s*air\b/i,
    icloudPrice: 35,
    networkPrice: 40,
    tierLabel: 'iPad Air Classic Tier',
  },
  {
    pattern: /\bipad\s*mini\b.*(?:6th\s*gen|a17\s*pro)/i,
    icloudPrice: 80,
    networkPrice: 65,
    tierLabel: 'iPad mini Modern Tier',
  },
  {
    pattern: /\bipad\s*mini\b.*(?:4|5th\s*gen)/i,
    icloudPrice: 40,
    networkPrice: 45,
    tierLabel: 'iPad mini Core Tier',
  },
  {
    pattern: /\bipad\s*mini\b/i,
    icloudPrice: 20,
    networkPrice: 25,
    tierLabel: 'iPad mini Classic Tier',
  },
  {
    pattern: /\bipad\b.*(?:10th\s*gen|a16|12th\s*gen)/i,
    icloudPrice: 75,
    networkPrice: 65,
    tierLabel: 'iPad Modern Tier',
  },
  {
    pattern: /\bipad\b.*\((?:7th|8th|9th)\s*gen\)/i,
    icloudPrice: 45,
    networkPrice: 50,
    tierLabel: 'iPad Core Tier',
  },
  {
    pattern: /\bipad\b.*\((?:5th|6th)\s*gen\)/i,
    icloudPrice: 28,
    networkPrice: 35,
    tierLabel: 'iPad Standard Tier',
  },
  {
    pattern: /\bipad\b/i,
    icloudPrice: 18,
    networkPrice: 22,
    tierLabel: 'iPad Classic Tier',
  },
];

const APPLE_WATCH_PRICE_RULES: DualServiceRule[] = [
  {
    pattern: /\bultra\s*4\b/i,
    icloudPrice: 90,
    networkPrice: 85,
    tierLabel: 'Apple Watch Flagship Tier (Ultra 4)',
  },
  {
    pattern: /\bseries\s*12\b/i,
    icloudPrice: 80,
    networkPrice: 80,
    tierLabel: 'Apple Watch Series 12 Tier',
  },
  {
    pattern: /\bultra\s*[23]\b/i,
    icloudPrice: 75,
    networkPrice: 80,
    tierLabel: 'Apple Watch Ultra Tier',
  },
  {
    pattern: /\bseries\s*1[01]\b/i,
    icloudPrice: 65,
    networkPrice: 70,
    tierLabel: 'Apple Watch Modern Tier',
  },
  {
    pattern: /\bultra\b/i,
    icloudPrice: 60,
    networkPrice: 65,
    tierLabel: 'Apple Watch Ultra Tier',
  },
  {
    pattern: /\b(?:series\s*[89]|se\s*\(?3rd(?:\s*gen)?\)?)\b/i,
    icloudPrice: 45,
    networkPrice: 50,
    tierLabel: 'Apple Watch Core Tier',
  },
  {
    pattern: /\b(?:series\s*[67]|se\s*\(?2nd(?:\s*gen)?\)?)\b/i,
    icloudPrice: 32,
    networkPrice: 35,
    tierLabel: 'Apple Watch Standard Tier',
  },
  {
    pattern: /\b(?:series\s*[45]|se\s*\(?1st(?:\s*gen)?\)?)\b/i,
    icloudPrice: 22,
    networkPrice: 25,
    tierLabel: 'Apple Watch Classic Tier',
  },
  {
    pattern: /\b(?:series\s*[123]|\(?1st(?:\s*gen)?\)?)\b/i,
    icloudPrice: 15,
    networkPrice: 18,
    tierLabel: 'Apple Watch Legacy Tier',
  },
];

/**
 * Returns dual-service prices (iCloud / Activation Unlock & Carrier / Network Unlock)
 * for any supported Apple iPhone, iPad, or Apple Watch model.
 */
export function getDeviceServiceQuotes(
  deviceName: string,
  brand: string = 'Apple',
  modelNumber: string = ''
): { icloudPrice: number; networkPrice: number; tierLabel: string } {
  const normalizedDevice = `${deviceName} ${modelNumber}`.trim();
  const normalizedAll = `${brand} ${deviceName} ${modelNumber}`.toLowerCase();

  if (normalizedAll.includes('ipad')) {
    for (const rule of IPAD_PRICE_RULES) {
      if (rule.pattern.test(normalizedDevice)) {
        return {
          icloudPrice: rule.icloudPrice,
          networkPrice: rule.networkPrice,
          tierLabel: rule.tierLabel,
        };
      }
    }
    return {
      icloudPrice: 45,
      networkPrice: 50,
      tierLabel: 'iPad Standard Tier',
    };
  }

  for (const rule of IPHONE_PRICE_RULES) {
    if (rule.pattern.test(normalizedDevice)) {
      return {
        icloudPrice: rule.icloudPrice,
        networkPrice: rule.networkPrice,
        tierLabel: rule.tierLabel,
      };
    }
  }

  if (
    normalizedAll.includes('watch') ||
    /\b(?:series\s*\d+|ultra(?:\s*\d+)?|se\s*\()/i.test(normalizedDevice)
  ) {
    for (const rule of APPLE_WATCH_PRICE_RULES) {
      if (rule.pattern.test(normalizedDevice)) {
        return {
          icloudPrice: rule.icloudPrice,
          networkPrice: rule.networkPrice,
          tierLabel: rule.tierLabel,
        };
      }
    }
    return {
      icloudPrice: 35,
      networkPrice: 40,
      tierLabel: 'Apple Watch Standard Tier',
    };
  }

  return {
    icloudPrice: 35,
    networkPrice: 45,
    tierLabel: 'Apple Standard Tier',
  };
}

/**
 * Computes the active unlock quote for the selected service ('icloud' | 'network').
 */
export function calculateDeviceUnlockPrice(
  deviceName: string,
  brand: string = 'Apple',
  modelNumber: string = '',
  service: UnlockServiceType = 'network'
): DeviceUnlockQuote {
  const quotes = getDeviceServiceQuotes(deviceName, brand, modelNumber);
  return {
    ...quotes,
    price: service === 'icloud' ? quotes.icloudPrice : quotes.networkPrice,
  };
}

export interface AutoPaymentNoteParams {
  deviceName: string;
  brand?: string;
  modelNumber?: string;
  imei: string;
  service: UnlockServiceType;
  price: number;
}

/**
 * Generates an automatic Binance Pay payment note tied to the selected device spec, IMEI, service, and price.
 */
export function buildAutoPaymentNote({
  deviceName,
  brand = '',
  modelNumber = '',
  imei,
  service,
  price,
}: AutoPaymentNoteParams): string {
  const cleanDevice = deviceName.trim() || brand.trim() || 'Apple Device';
  const cleanModel = modelNumber.trim();
  const hasDistinctModel =
    cleanModel.length > 0 &&
    cleanModel.toLowerCase() !== 'unknown' &&
    !cleanDevice.toLowerCase().includes(cleanModel.toLowerCase());

  const deviceSpec = hasDistinctModel
    ? `${cleanDevice} (${cleanModel})`
    : cleanDevice;
  const serviceLabel =
    service === 'icloud'
      ? 'iCloud / Activation Unlock'
      : 'Carrier / Network Unlock';
  const cleanImei = imei.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  return `${deviceSpec} · ${serviceLabel} · $${price} · IMEI ${cleanImei}`;
}

export function validateUnlockOrderEmail(email: string): {
  valid: boolean;
  emailError?: string;
} {
  const trimmedEmail = email.trim();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

  return {
    valid: emailValid,
    emailError: emailValid
      ? undefined
      : 'Enter a valid email address for unlock updates.',
  };
}

export function generateUnlockOrderReference(
  imei: string,
  seed: number = Date.now()
): string {
  const imeiSuffix = imei
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(-3)
    .padStart(3, '0');
  const timeSuffix = String(seed).slice(-4).padStart(4, '0');
  return `IUNL-${imeiSuffix}${timeSuffix}`;
}
