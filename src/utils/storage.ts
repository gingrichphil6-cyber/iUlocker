import type {
  AppPersistedState,
  BillingCycle,
  PlanId,
  UnlockServiceType,
  UserProfile,
} from '../types';

const STORAGE_KEY = 'iunlocker_state_v4';

export const DEFAULT_APP_STATE: AppPersistedState = {
  selectedService: 'icloud',
  billingCycle: 'monthly',
  selectedPlanId: 'pro',
  activePlanId: 'pro',
  activePlanStatus: 'Active',
  user: null,
};

export function loadAppState(): AppPersistedState {
  if (typeof window === 'undefined') {
    return DEFAULT_APP_STATE;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_APP_STATE;
    }
    const parsed = JSON.parse(raw) as Partial<AppPersistedState>;
    return {
      selectedService: parsed.selectedService ?? DEFAULT_APP_STATE.selectedService,
      billingCycle: parsed.billingCycle ?? DEFAULT_APP_STATE.billingCycle,
      selectedPlanId: parsed.selectedPlanId ?? DEFAULT_APP_STATE.selectedPlanId,
      activePlanId:
        parsed.activePlanId !== undefined
          ? parsed.activePlanId
          : DEFAULT_APP_STATE.activePlanId,
      activePlanStatus:
        parsed.activePlanStatus ?? DEFAULT_APP_STATE.activePlanStatus,
      user: parsed.user ?? null,
    };
  } catch {
    return DEFAULT_APP_STATE;
  }
}

export function saveAppState(state: AppPersistedState): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors in restricted sandboxes
  }
}

export function createUserProfile(name: string, email: string): UserProfile {
  return {
    name: name.trim() || 'Alex Morgan',
    email: email.trim().toLowerCase(),
    accountType: 'Standard Account',
    createdAt: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    twoFactorEnabled: false,
    emailAlertsEnabled: true,
  };
}

export type { BillingCycle, PlanId, UnlockServiceType };
