export type DeviceCategory = 'iphone' | 'ipad' | 'apple_watch';

export interface AppleDeviceModel {
  id: string;
  label: string;
  fullName: string;
  category: DeviceCategory;
  categoryLabel: string;
}

const IPHONE_MODEL_NAMES: string[] = [
  'iPhone (1st gen)',
  'iPhone 3G',
  'iPhone 3GS',
  'iPhone 4',
  'iPhone 4s',
  'iPhone 5',
  'iPhone 5c',
  'iPhone 5s',
  'iPhone 6',
  'iPhone 6 Plus',
  'iPhone 6s',
  'iPhone 6s Plus',
  'iPhone SE (1st gen)',
  'iPhone 7',
  'iPhone 7 Plus',
  'iPhone 8',
  'iPhone 8 Plus',
  'iPhone X',
  'iPhone XR',
  'iPhone XS',
  'iPhone XS Max',
  'iPhone 11',
  'iPhone 11 Pro',
  'iPhone 11 Pro Max',
  'iPhone SE (2nd gen)',
  'iPhone 12 mini',
  'iPhone 12',
  'iPhone 12 Pro',
  'iPhone 12 Pro Max',
  'iPhone 13 mini',
  'iPhone 13',
  'iPhone 13 Pro',
  'iPhone 13 Pro Max',
  'iPhone SE (3rd gen)',
  'iPhone 14',
  'iPhone 14 Plus',
  'iPhone 14 Pro',
  'iPhone 14 Pro Max',
  'iPhone 15',
  'iPhone 15 Plus',
  'iPhone 15 Pro',
  'iPhone 15 Pro Max',
  'iPhone 16',
  'iPhone 16 Plus',
  'iPhone 16 Pro',
  'iPhone 16 Pro Max',
  'iPhone 16e',
  'iPhone 17',
  'iPhone Air',
  'iPhone 17 Pro',
  'iPhone 17 Pro Max',
  'iPhone 17e',
  'iPhone 18',
  'iPhone 18 Pro',
  'iPhone 18 Pro Max',
  'iPhone Duo',
];

const IPAD_MODEL_NAMES: string[] = [
  // Standard iPad
  'iPad (1st gen)',
  'iPad 2',
  'iPad (3rd gen)',
  'iPad (4th gen)',
  'iPad (5th gen)',
  'iPad (6th gen)',
  'iPad (7th gen)',
  'iPad (8th gen)',
  'iPad (9th gen)',
  'iPad (10th gen)',
  'iPad (A16)',
  'iPad (12th gen)',
  // iPad mini
  'iPad mini (1st gen)',
  'iPad mini 2',
  'iPad mini 3',
  'iPad mini 4',
  'iPad mini (5th gen)',
  'iPad mini (6th gen)',
  'iPad mini (A17 Pro)',
  // iPad Air
  'iPad Air (1st gen)',
  'iPad Air 2',
  'iPad Air (3rd gen)',
  'iPad Air (4th gen)',
  'iPad Air (5th gen)',
  'iPad Air 11-inch (M2)',
  'iPad Air 13-inch (M2)',
  'iPad Air 11-inch (M3)',
  'iPad Air 13-inch (M3)',
  'iPad Air 11-inch (M4)',
  'iPad Air 13-inch (M4)',
  // iPad Pro
  'iPad Pro 12.9-inch (1st gen)',
  'iPad Pro 9.7-inch',
  'iPad Pro 12.9-inch (2nd gen)',
  'iPad Pro 10.5-inch',
  'iPad Pro 11-inch (1st gen)',
  'iPad Pro 12.9-inch (3rd gen)',
  'iPad Pro 11-inch (2nd gen)',
  'iPad Pro 12.9-inch (4th gen)',
  'iPad Pro 11-inch (3rd gen)',
  'iPad Pro 12.9-inch (5th gen)',
  'iPad Pro 11-inch (4th gen)',
  'iPad Pro 12.9-inch (6th gen)',
  'iPad Pro 11-inch (M4)',
  'iPad Pro 13-inch (M4)',
  'iPad Pro 11-inch (M5)',
  'iPad Pro 13-inch (M5)',
];

const APPLE_WATCH_MODEL_NAMES: string[] = [
  'Apple Watch (1st gen)',
  'Series 1',
  'Series 2',
  'Series 3',
  'Series 4',
  'Series 5',
  'SE (1st gen)',
  'Series 6',
  'Series 7',
  'SE (2nd gen)',
  'Series 8',
  'Ultra',
  'Series 9',
  'Ultra 2',
  'Series 10',
  'Series 11',
  'Ultra 3',
  'SE (3rd gen)',
  'Series 12',
  'Ultra 4',
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const IPHONE_MODELS: AppleDeviceModel[] = IPHONE_MODEL_NAMES.map(
  (name) => ({
    id: `iphone-${slugify(name)}`,
    label: name,
    fullName: name,
    category: 'iphone',
    categoryLabel: 'iPhone Series',
  })
);

export const IPAD_MODELS: AppleDeviceModel[] = IPAD_MODEL_NAMES.map(
  (name) => ({
    id: `ipad-${slugify(name)}`,
    label: name,
    fullName: name,
    category: 'ipad',
    categoryLabel: 'iPad Series',
  })
);

export const APPLE_WATCH_MODELS: AppleDeviceModel[] =
  APPLE_WATCH_MODEL_NAMES.map((name) => {
    const fullName = name.startsWith('Apple Watch')
      ? name
      : `Apple Watch ${name}`;
    return {
      id: `watch-${slugify(name)}`,
      label: name,
      fullName,
      category: 'apple_watch',
      categoryLabel: 'Apple Watch Series',
    };
  });

export const ALL_SUPPORTED_DEVICES: AppleDeviceModel[] = [
  ...IPHONE_MODELS,
  ...IPAD_MODELS,
  ...APPLE_WATCH_MODELS,
];

export function findDeviceById(
  deviceId: string | null | undefined
): AppleDeviceModel | null {
  if (!deviceId) return null;
  return ALL_SUPPORTED_DEVICES.find((d) => d.id === deviceId) ?? null;
}

export function filterDeviceModels(query: string): {
  iphones: AppleDeviceModel[];
  ipads: AppleDeviceModel[];
  watches: AppleDeviceModel[];
} {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return {
      iphones: IPHONE_MODELS,
      ipads: IPAD_MODELS,
      watches: APPLE_WATCH_MODELS,
    };
  }

  const matches = (device: AppleDeviceModel) =>
    device.label.toLowerCase().includes(normalized) ||
    device.fullName.toLowerCase().includes(normalized) ||
    device.categoryLabel.toLowerCase().includes(normalized);

  return {
    iphones: IPHONE_MODELS.filter(matches),
    ipads: IPAD_MODELS.filter(matches),
    watches: APPLE_WATCH_MODELS.filter(matches),
  };
}
