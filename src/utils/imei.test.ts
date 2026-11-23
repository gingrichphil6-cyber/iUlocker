import test from 'node:test';
import assert from 'node:assert/strict';
import {
  maskImei,
  sanitizeDeviceIdentifier,
  sanitizeImeiInput,
  validateManualDeviceIdentifier,
} from './imei';
import {
  ALL_SUPPORTED_DEVICES,
  APPLE_WATCH_MODELS,
  IPAD_MODELS,
  IPHONE_MODELS,
  filterDeviceModels,
} from './deviceCatalog';

test('deviceCatalog includes all required iPhone (1st gen through 18/Duo), iPad (1st gen through M5/12th gen), and Apple Watch (1st gen through Ultra 4) models', () => {
  assert.equal(IPHONE_MODELS.length, 56);
  assert.equal(IPAD_MODELS.length, 46);
  assert.equal(APPLE_WATCH_MODELS.length, 20);
  assert.equal(ALL_SUPPORTED_DEVICES.length, 122);

  const requiredIphones = [
    'iPhone (1st gen)',
    'iPhone 5c',
    'iPhone SE (1st gen)',
    'iPhone X',
    'iPhone 16 Pro Max',
    'iPhone 16e',
    'iPhone Air',
    'iPhone 17e',
    'iPhone 18 Pro Max',
    'iPhone Duo',
  ];
  for (const name of requiredIphones) {
    assert.ok(
      IPHONE_MODELS.some((m) => m.label === name),
      `Missing iPhone model: ${name}`
    );
  }

  const requiredIpads = [
    'iPad (1st gen)',
    'iPad (10th gen)',
    'iPad (A16)',
    'iPad (12th gen)',
    'iPad mini (1st gen)',
    'iPad mini (A17 Pro)',
    'iPad Air (1st gen)',
    'iPad Air 13-inch (M4)',
    'iPad Pro 12.9-inch (1st gen)',
    'iPad Pro 13-inch (M4)',
    'iPad Pro 13-inch (M5)',
  ];
  for (const name of requiredIpads) {
    assert.ok(
      IPAD_MODELS.some((m) => m.label === name),
      `Missing iPad model: ${name}`
    );
  }

  const requiredWatches = [
    'Apple Watch (1st gen)',
    'Series 1',
    'SE (1st gen)',
    'Ultra',
    'Ultra 2',
    'Series 10',
    'Ultra 3',
    'SE (3rd gen)',
    'Series 12',
    'Ultra 4',
  ];
  for (const name of requiredWatches) {
    assert.ok(
      APPLE_WATCH_MODELS.some((m) => m.label === name),
      `Missing Apple Watch model: ${name}`
    );
  }
});

test('filterDeviceModels filters iPhone, iPad, and Apple Watch categories cleanly', () => {
  const all = filterDeviceModels('');
  assert.equal(all.iphones.length, 56);
  assert.equal(all.ipads.length, 46);
  assert.equal(all.watches.length, 20);

  const ultraSearch = filterDeviceModels('ultra 4');
  assert.equal(ultraSearch.iphones.length, 0);
  assert.equal(ultraSearch.ipads.length, 0);
  assert.equal(ultraSearch.watches.length, 1);
  assert.equal(ultraSearch.watches[0].fullName, 'Apple Watch Ultra 4');

  const ipadProSearch = filterDeviceModels('iPad Pro 13-inch (M5)');
  assert.equal(ipadProSearch.iphones.length, 0);
  assert.equal(ipadProSearch.watches.length, 0);
  assert.equal(ipadProSearch.ipads.length, 1);
  assert.equal(ipadProSearch.ipads[0].fullName, 'iPad Pro 13-inch (M5)');

  const sixteenSearch = filterDeviceModels('16 Pro Max');
  assert.equal(sixteenSearch.iphones.length, 1);
  assert.equal(sixteenSearch.iphones[0].label, 'iPhone 16 Pro Max');
});

test('sanitizeImeiInput and sanitizeDeviceIdentifier normalize input per device category', () => {
  assert.equal(sanitizeImeiInput('35-1234-5678-9012-3abc'), '351234567890123');
  assert.equal(sanitizeDeviceIdentifier('c02x91abc123', 'apple_watch'), 'C02X91ABC123');
  assert.equal(sanitizeDeviceIdentifier('dlx-q91abc12', 'ipad'), 'DLXQ91ABC12');
  assert.equal(sanitizeDeviceIdentifier('35-1234-5678-9012-3', 'iphone'), '351234567890123');
});

test('validateManualDeviceIdentifier enforces 15-digit IMEI for iPhones and 15-digit IMEI or 10–12 char Serial for iPad and Apple Watch', () => {
  const shortIphone = validateManualDeviceIdentifier('35123456789012', 'iphone');
  assert.equal(shortIphone.valid, false);
  assert.equal(shortIphone.digitCount, 14);

  const validIphone = validateManualDeviceIdentifier('351234567890123', 'iphone');
  assert.equal(validIphone.valid, true);
  assert.equal(validIphone.digitCount, 15);

  const validIpadSerial = validateManualDeviceIdentifier('DLXQ91ABC123', 'ipad');
  assert.equal(validIpadSerial.valid, true);

  const validIpadImei = validateManualDeviceIdentifier('351234567890123', 'ipad');
  assert.equal(validIpadImei.valid, true);

  const badIpadSerial = validateManualDeviceIdentifier('ABC12', 'ipad');
  assert.equal(badIpadSerial.valid, false);

  const validWatchSerial = validateManualDeviceIdentifier('G99ABC123DEF', 'apple_watch');
  assert.equal(validWatchSerial.valid, true);

  const validWatchImei = validateManualDeviceIdentifier('351234567890123', 'apple_watch');
  assert.equal(validWatchImei.valid, true);

  const badWatchSerial = validateManualDeviceIdentifier('ABC123', 'apple_watch');
  assert.equal(badWatchSerial.valid, false);
});

test('maskImei partially masks middle digits while preserving prefix and suffix', () => {
  assert.equal(maskImei('351234567890123'), '351234•••••0123');
});
