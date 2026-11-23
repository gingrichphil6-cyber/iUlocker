import type { DeviceCategory } from './utils/deviceCatalog';

export type UnlockServiceType = 'icloud' | 'network';

export type EligibilityOutcome = 'eligible' | 'not_eligible';

export type AppView = 'home' | 'checkout';

export type BillingCycle = 'monthly' | 'yearly';

export type PlanId = 'starter' | 'pro' | 'elite';

export interface PricingPlan {
  id: PlanId;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyMonthlyEquivalent: number;
  yearlyTotal: number;
  popular?: boolean;
  ctaLabel: string;
  features: string[];
}

export interface ImeiValidationResult {
  valid: boolean;
  digitCount: number;
  errorHeading?: string;
  errorMessage?: string;
}

export interface UnlockOrderDraft {
  deviceId: string;
  deviceName: string;
  deviceCategory: DeviceCategory;
  service: UnlockServiceType;
  serviceLabel: string;
  price: number;
  imei: string;
}

export interface UserProfile {
  name: string;
  email: string;
  accountType: string;
  createdAt: string;
  twoFactorEnabled: boolean;
  emailAlertsEnabled: boolean;
}

export interface AppPersistedState {
  selectedService: UnlockServiceType;
  billingCycle: BillingCycle;
  selectedPlanId: PlanId;
  activePlanId: PlanId | null;
  activePlanStatus: 'Active' | 'No Active Plan';
  user: UserProfile | null;
}
