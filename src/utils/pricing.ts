import type { BillingCycle, PlanId, PricingPlan } from '../types';

export const SUBSCRIPTION_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For individual device checks',
    monthlyPrice: 9.99,
    yearlyMonthlyEquivalent: 7.99,
    yearlyTotal: 95.88,
    ctaLabel: 'Select Starter',
    features: [
      'Basic device information',
      'Eligibility check interface',
      'Standard support',
      'Access to the user dashboard',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For power users and resellers',
    monthlyPrice: 19.99,
    yearlyMonthlyEquivalent: 15.99,
    yearlyTotal: 191.88,
    popular: true,
    ctaLabel: 'Get Pro',
    features: [
      'Everything in Starter',
      'Priority support',
      'Multiple device records',
      'Enhanced device reports',
      'Priority processing interface',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    tagline: 'For multi-device teams and shops',
    monthlyPrice: 39.99,
    yearlyMonthlyEquivalent: 31.99,
    yearlyTotal: 383.88,
    ctaLabel: 'Choose Elite',
    features: [
      'Everything in Pro',
      'Premium support',
      'Extended device tracking',
      'Priority access',
      'Premium dashboard',
    ],
  },
];

export function getPlanById(planId: PlanId): PricingPlan {
  return (
    SUBSCRIPTION_PLANS.find((plan) => plan.id === planId) ??
    SUBSCRIPTION_PLANS[1]
  );
}

export function getPlanDisplayPrice(
  plan: PricingPlan,
  billingCycle: BillingCycle
): number {
  return billingCycle === 'yearly'
    ? plan.yearlyMonthlyEquivalent
    : plan.monthlyPrice;
}

export function getCheckoutTotal(
  plan: PricingPlan,
  billingCycle: BillingCycle
): number {
  return billingCycle === 'yearly' ? plan.yearlyTotal : plan.monthlyPrice;
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function generateDemoPaymentReference(
  planId: PlanId,
  seed: number = Date.now()
): string {
  const code = planId.slice(0, 3).toUpperCase();
  const suffix = String(seed).slice(-6).padStart(6, '0');
  return `IUNL-${code}-${suffix}`;
}
