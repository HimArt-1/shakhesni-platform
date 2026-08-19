import { PriorityLevel, RequestStatus } from '@/types/database';
import { REQUEST_STATES } from './state-machine';

export interface SLACalculation {
  totalDays: number;
  daysRemaining: number;
  hoursRemaining: number;
  isBreached: boolean;
  isPaused: boolean;
  percentageUsed: number; // 0 to 100
  urgencyStatus: 'CRITICAL' | 'WARNING' | 'HEALTHY' | 'PAUSED' | 'COMPLETED';
}

export const SLA_PRIORITY_DAYS: Record<PriorityLevel, number> = {
  EMERGENT: 2,   // عاجل جداً (48 ساعة)
  HIGH: 5,       // عالي (5 أيام)
  NORMAL: 10,    // عادي (10 أيام)
  LOW: 15,       // منخفض (15 يوم)
};

export function calculateSLA(
  createdAt: string,
  priority: PriorityLevel,
  status: RequestStatus,
  statusHistory: Array<{ timestamp: string; fromStatus: RequestStatus; toStatus: RequestStatus }>
): SLACalculation {
  const totalDays = SLA_PRIORITY_DAYS[priority] || 10;
  const stateMeta = REQUEST_STATES[status] || REQUEST_STATES['DRAFT'];

  // If completed or closed
  if (['APPROVED', 'DELIVERED', 'CLOSED', 'CANCELLED'].includes(status)) {
    return {
      totalDays,
      daysRemaining: 0,
      hoursRemaining: 0,
      isBreached: false,
      isPaused: true,
      percentageUsed: 100,
      urgencyStatus: 'COMPLETED',
    };
  }

  const createdDate = new Date(createdAt).getTime();
  const now = new Date().getTime();
  
  // Calculate total paused duration in milliseconds
  let pausedMs = 0;
  let pauseStart: number | null = null;

  // Sort history chronologically
  const sortedHistory = [...statusHistory].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Handle initial paused status (e.g., DRAFT) from creation
  if (sortedHistory.length > 0) {
    const firstEntry = sortedHistory[0];
    if (REQUEST_STATES[firstEntry.fromStatus]?.pausesSLA) {
      const firstTime = new Date(firstEntry.timestamp).getTime();
      pausedMs += Math.max(0, firstTime - createdDate);
    }
  } else if (stateMeta?.pausesSLA) {
    // No history at all, but currently in a paused state - all time is paused
    pausedMs = now - createdDate;
  }

  for (const entry of sortedHistory) {
    const entryTime = new Date(entry.timestamp).getTime();
    if (REQUEST_STATES[entry.toStatus]?.pausesSLA) {
      if (!pauseStart) pauseStart = entryTime;
    } else if (pauseStart) {
      pausedMs += entryTime - pauseStart;
      pauseStart = null;
    }
  }

  // If currently in a paused state
  if (stateMeta.pausesSLA) {
    if (!pauseStart) pauseStart = now; // paused until now
    pausedMs += now - pauseStart;
  }

  const totalAllowedMs = totalDays * 24 * 60 * 60 * 1000;
  const elapsedMs = Math.max(0, now - createdDate - pausedMs);
  const remainingMs = totalAllowedMs - elapsedMs;

  const daysRemaining = Math.max(0, Math.floor(remainingMs / (1000 * 60 * 60 * 24)));
  const hoursRemaining = Math.max(0, Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));

  const isBreached = remainingMs <= 0;
  const percentageUsed = Math.min(100, Math.max(0, Math.round((elapsedMs / totalAllowedMs) * 100)));

  let urgencyStatus: 'CRITICAL' | 'WARNING' | 'HEALTHY' | 'PAUSED' | 'COMPLETED' = 'HEALTHY';
  if (stateMeta.pausesSLA) {
    urgencyStatus = 'PAUSED';
  } else if (isBreached || percentageUsed >= 90) {
    urgencyStatus = 'CRITICAL';
  } else if (percentageUsed >= 70) {
    urgencyStatus = 'WARNING';
  }

  return {
    totalDays,
    daysRemaining,
    hoursRemaining,
    isBreached,
    isPaused: stateMeta.pausesSLA,
    percentageUsed,
    urgencyStatus,
  };
}
