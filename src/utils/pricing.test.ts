import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatCurrency,
  generateDemoPaymentReference,
  getCheckoutTotal,
  getPlanById,
  getPlanDisplayPrice,
  SUBSCRIPTION_PLANS,
} from './pricing';

test('SUBSCRIPTION_PLANS includes Starter, Pro (popular), and Elite with expected base prices', () => {
  assert.equal(SUBSCRIPTION_PLANS.length, 3);
  assert.equal(getPlanById('starter').monthlyPrice, 9.99);
  assert.equal(getPlanById('pro').monthlyPrice, 19.99);
  assert.equal(getPlanById('pro').popular, true);
  assert.equal(getPlanById('elite').monthlyPrice, 39.99);
});

test('getPlanDisplayPrice and getCheckoutTotal switch cleanly between monthly and yearly', () => {
  const pro = getPlanById('pro');
  assert.equal(getPlanDisplayPrice(pro, 'monthly'), 19.99);
  assert.equal(getPlanDisplayPrice(pro, 'yearly'), 15.99);
  assert.equal(getCheckoutTotal(pro, 'monthly'), 19.99);
  assert.equal(getCheckoutTotal(pro, 'yearly'), 191.88);
  assert.equal(formatCurrency(19.99), '$19.99');
});

test('generateDemoPaymentReference produces deterministic readable reference codes', () => {
  assert.equal(generateDemoPaymentReference('pro', 123456), 'IUNL-PRO-123456');
  assert.equal(generateDemoPaymentReference('elite', 42), 'IUNL-ELI-000042');
});
