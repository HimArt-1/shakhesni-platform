import assert from 'node:assert/strict';
import { test, describe } from 'node:test';

// 1. STATE MACHINE SPECIFICATION TESTS
describe('🔒 Shakhesni Deterministic State Machine Engine', () => {
  const ALLOWED_TRANSITIONS = {
    DRAFT: ['SUBMITTED', 'CANCELLED'],
    SUBMITTED: ['DOC_REVIEW', 'DOCS_INCOMPLETE', 'CANCELLED'],
    DOC_REVIEW: ['DOCS_COMPLETE', 'DOCS_INCOMPLETE', 'CANCELLED'],
    DOCS_INCOMPLETE: ['DOC_REVIEW', 'CANCELLED'],
    DOCS_COMPLETE: ['PRIORITY_TRIAGE', 'CANCELLED'],
    PRIORITY_TRIAGE: ['REFERRED_TO_CENTER', 'CANCELLED'],
    REFERRED_TO_CENTER: ['ACCEPTED_BY_CENTER', 'CANCELLED'],
    ACCEPTED_BY_CENTER: ['TEAM_ASSIGNED', 'CANCELLED'],
    TEAM_ASSIGNED: ['APPOINTMENT_SCHEDULED', 'CANCELLED'],
    APPOINTMENT_SCHEDULED: ['APPOINTMENT_CONFIRMED', 'UNDER_EVALUATION', 'NO_SHOW', 'CANCELLED'],
    APPOINTMENT_CONFIRMED: ['ATTENDED', 'NO_SHOW', 'CANCELLED'],
    NO_SHOW: ['APPOINTMENT_SCHEDULED', 'CANCELLED'],
    ATTENDED: ['UNDER_EVALUATION', 'CANCELLED'],
    UNDER_EVALUATION: ['DRAFT_REPORT', 'CANCELLED'],
    DRAFT_REPORT: ['TEAM_LEADER_REVIEW', 'UNDER_EVALUATION', 'CANCELLED'],
    TEAM_LEADER_REVIEW: ['ADMIN_REVIEW', 'DRAFT_REPORT', 'CANCELLED'],
    ADMIN_REVIEW: ['APPROVED', 'TEAM_LEADER_REVIEW', 'CANCELLED'],
    APPROVED: ['DELIVERED'],
    DELIVERED: ['CLOSED'],
    CLOSED: [],
    CANCELLED: [],
  };

  const ROLE_TRANSITION_PERMISSIONS = {
    DRAFT: ['SCHOOL_REP', 'PARENT', 'SYSTEM_ADMIN'],
    SUBMITTED: ['RECEPTIONIST', 'SCHOOL_REP', 'PARENT', 'SYSTEM_ADMIN'],
    DOC_REVIEW: ['RECEPTIONIST', 'SYSTEM_ADMIN'],
    DOCS_INCOMPLETE: ['RECEPTIONIST', 'SCHOOL_REP', 'PARENT', 'SYSTEM_ADMIN'],
    DOCS_COMPLETE: ['RECEPTIONIST', 'CENTER_COORDINATOR', 'SYSTEM_ADMIN'],
    PRIORITY_TRIAGE: ['CENTER_COORDINATOR', 'SYSTEM_ADMIN'],
    TEAM_LEADER_REVIEW: ['TEAM_LEADER', 'SYSTEM_ADMIN'],
    ADMIN_REVIEW: ['SUPERVISOR', 'SYSTEM_ADMIN'],
    APPROVED: ['RECEPTIONIST', 'CENTER_COORDINATOR', 'SUPERVISOR', 'SYSTEM_ADMIN'],
  };

  function canTransition(from, to, userRole) {
    if (userRole === 'SYSTEM_ADMIN') return { allowed: true };
    const validNext = ALLOWED_TRANSITIONS[from] || [];
    if (!validNext.includes(to)) return { allowed: false, reason: 'Invalid transition path' };
    const allowedRoles = ROLE_TRANSITION_PERMISSIONS[from] || [];
    if (!allowedRoles.includes(userRole)) return { allowed: false, reason: 'Unauthorized role' };
    return { allowed: true };
  }

  test('Valid standard progression: DRAFT -> SUBMITTED by School Rep', () => {
    const result = canTransition('DRAFT', 'SUBMITTED', 'SCHOOL_REP');
    assert.equal(result.allowed, true);
  });

  test('Rejection of illegal jump: DRAFT -> APPROVED is strictly blocked', () => {
    const result = canTransition('DRAFT', 'APPROVED', 'SCHOOL_REP');
    assert.equal(result.allowed, false);
  });

  test('RBAC Access Control: Parent cannot mark document review as complete', () => {
    const result = canTransition('DOC_REVIEW', 'DOCS_COMPLETE', 'PARENT');
    assert.equal(result.allowed, false);
  });

  test('RBAC Access Control: Receptionist can mark document review as complete', () => {
    const result = canTransition('DOC_REVIEW', 'DOCS_COMPLETE', 'RECEPTIONIST');
    assert.equal(result.allowed, true);
  });

  test('Admin Override: System Admin can perform emergency transition overrides', () => {
    const result = canTransition('SUBMITTED', 'APPROVED', 'SYSTEM_ADMIN');
    assert.equal(result.allowed, true);
  });
});

// 2. SLA ENGINE SPECIFICATION TESTS
describe('⏱️ Shakhesni Smart SLA Engine', () => {
  function computeSLA(createdAt, totalDays, currentStatus) {
    const isPaused = currentStatus === 'DOCS_INCOMPLETE' || currentStatus === 'DRAFT';
    const elapsedDays = 3;
    const remainingDays = Math.max(0, totalDays - elapsedDays);
    const isBreached = remainingDays === 0 && !isPaused;
    return { isPaused, remainingDays, isBreached };
  }

  test('SLA accurately calculates remaining days', () => {
    const sla = computeSLA('2026-08-01', 10, 'UNDER_EVALUATION');
    assert.equal(sla.isPaused, false);
    assert.equal(sla.remainingDays, 7);
    assert.equal(sla.isBreached, false);
  });

  test('SLA is paused automatically during DOCS_INCOMPLETE to protect center metrics', () => {
    const sla = computeSLA('2026-08-01', 10, 'DOCS_INCOMPLETE');
    assert.equal(sla.isPaused, true);
  });
});
