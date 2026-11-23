import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAutoPaymentNote,
  calculateDeviceUnlockPrice,
  generateUnlockOrderReference,
  getDeviceServiceQuotes,
  validateUnlockOrderEmail,
} from './unlockPricing';

test('getDeviceServiceQuotes preserves exact configured iCloud and Network Unlock pricing for iPhone 6 through 16 Pro Max and new 2026 models', () => {
  const cases: Array<[string, number, number]> = [
    ['iPhone (1st gen)', 12, 15],
    ['iPhone 4s', 12, 15],
    ['iPhone 5c', 12, 15],
    ['iPhone 6', 12, 15],
    ['iPhone 6 Plus', 12, 15],
    ['iPhone 6s', 15, 18],
    ['iPhone 6s Plus', 15, 18],
    ['iPhone 7', 17, 20],
    ['iPhone 7 Plus', 17, 20],
    ['iPhone 8', 20, 25],
    ['iPhone 8 Plus', 20, 25],
    ['iPhone X', 17, 30],
    ['iPhone XR', 25, 35],
    ['iPhone XS', 30, 40],
    ['iPhone XS Max', 30, 40],
    ['iPhone 11', 35, 45],
    ['iPhone 11 Pro', 40, 50],
    ['iPhone 11 Pro Max', 40, 50],
    ['iPhone 12', 45, 55],
    ['iPhone 12 mini', 45, 55],
    ['iPhone 12 Pro', 50, 60],
    ['iPhone 12 Pro Max', 50, 60],
    ['iPhone 13', 55, 65],
    ['iPhone 13 mini', 55, 65],
    ['iPhone 13 Pro', 65, 75],
    ['iPhone 13 Pro Max', 65, 75],
    ['iPhone 14', 75, 80],
    ['iPhone 14 Plus', 75, 80],
    ['iPhone 14 Pro', 85, 85],
    ['iPhone 14 Pro Max', 85, 85],
    ['iPhone 15', 100, 85],
    ['iPhone 15 Plus', 100, 85],
    ['iPhone 15 Pro', 115, 90],
    ['iPhone 15 Pro Max', 115, 90],
    ['iPhone 16', 130, 90],
    ['iPhone 16 Plus', 130, 90],
    ['iPhone 16e', 130, 90],
    ['iPhone 16 Pro', 140, 90],
    ['iPhone 16 Pro Max', 150, 90],
    ['iPhone 17', 165, 95],
    ['iPhone Air', 165, 95],
    ['iPhone 17e', 165, 95],
    ['iPhone 18', 180, 100],
    ['iPhone Duo', 180, 100],
  ];

  for (const [model, expectedIcloud, expectedNetwork] of cases) {
    const q = getDeviceServiceQuotes(model, 'Apple');
    assert.equal(q.icloudPrice, expectedIcloud, `${model} iCloud`);
    assert.equal(q.networkPrice, expectedNetwork, `${model} Network`);
    assert.equal(
      calculateDeviceUnlockPrice(model, 'Apple', '', 'icloud').price,
      expectedIcloud
    );
    assert.equal(
      calculateDeviceUnlockPrice(model, 'Apple', '', 'network').price,
      expectedNetwork
    );
  }
});

test('getDeviceServiceQuotes returns scaled dual-service prices for iPad and Apple Watch models', () => {
  const ipad1 = getDeviceServiceQuotes('iPad (1st gen)', 'Apple');
  assert.equal(ipad1.icloudPrice, 18);
  assert.equal(ipad1.networkPrice, 22);

  const ipadMiniA17 = getDeviceServiceQuotes('iPad mini (A17 Pro)', 'Apple');
  assert.equal(ipadMiniA17.icloudPrice, 80);
  assert.equal(ipadMiniA17.networkPrice, 65);

  const ipadAirM4 = getDeviceServiceQuotes('iPad Air 13-inch (M4)', 'Apple');
  assert.equal(ipadAirM4.icloudPrice, 115);
  assert.equal(ipadAirM4.networkPrice, 80);

  const ipadProM5 = getDeviceServiceQuotes('iPad Pro 13-inch (M5)', 'Apple');
  assert.equal(ipadProM5.icloudPrice, 145);
  assert.equal(ipadProM5.networkPrice, 90);

  const gen1 = getDeviceServiceQuotes('Apple Watch (1st gen)', 'Apple');
  assert.equal(gen1.icloudPrice, 15);
  assert.equal(gen1.networkPrice, 18);

  const series10 = getDeviceServiceQuotes('Apple Watch Series 10', 'Apple');
  assert.equal(series10.icloudPrice, 65);
  assert.equal(series10.networkPrice, 70);

  const ultra4 = getDeviceServiceQuotes('Apple Watch Ultra 4', 'Apple');
  assert.equal(ultra4.icloudPrice, 90);
  assert.equal(ultra4.networkPrice, 85);
});

test('buildAutoPaymentNote formats device spec, service, price, and IMEI automatically', () => {
  const iphoneIcloudNote = buildAutoPaymentNote({
    deviceName: 'iPhone 16 Pro Max',
    brand: 'Apple',
    imei: '351234567890123',
    service: 'icloud',
    price: 150,
  });
  assert.equal(
    iphoneIcloudNote,
    'iPhone 16 Pro Max · iCloud / Activation Unlock · $150 · IMEI 351234567890123'
  );
});

test('validateUnlockOrderEmail enforces valid email formatting', () => {
  const bad = validateUnlockOrderEmail('not-an-email');
  assert.equal(bad.valid, false);
  assert.ok(bad.emailError);

  const good = validateUnlockOrderEmail('user@example.com');
  assert.equal(good.valid, true);
  assert.equal(good.emailError, undefined);
});

test('generateUnlockOrderReference returns readable deterministic order ID', () => {
  assert.equal(
    generateUnlockOrderReference('351234567890123', 1234),
    'IUNL-1231234'
  );
});
