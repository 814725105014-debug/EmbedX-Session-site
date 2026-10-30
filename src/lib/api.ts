// ====================================================================
// EMBEDX REST API CLIENT
// ====================================================================

import { Presentation, Template, SessionReportSummary, LiveSession } from '../types';

const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchPresentations(): Promise<Presentation[]> {
  const res = await fetch(`${API_BASE}/presentations`);
  if (!res.ok) throw new Error('Failed to fetch presentations');
  return res.json();
}

export async function fetchPresentationById(id: string): Promise<Presentation> {
  const res = await fetch(`${API_BASE}/presentations/${id}`);
  if (!res.ok) throw new Error('Presentation not found');
  return res.json();
}

export async function createPresentation(data: Partial<Presentation>): Promise<Presentation> {
  const res = await fetch(`${API_BASE}/presentations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create presentation');
  return res.json();
}

export async function updatePresentation(id: string, data: Partial<Presentation>): Promise<Presentation> {
  const res = await fetch(`${API_BASE}/presentations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update presentation');
  return res.json();
}

export async function duplicatePresentation(id: string): Promise<Presentation> {
  const res = await fetch(`${API_BASE}/presentations/${id}/duplicate`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to duplicate presentation');
  return res.json();
}

export async function deletePresentation(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/presentations/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete presentation');
  return res.json();
}

export async function fetchTemplates(): Promise<Template[]> {
  const res = await fetch(`${API_BASE}/templates`);
  if (!res.ok) throw new Error('Failed to load templates');
  return res.json();
}

export async function cloneTemplate(templateId: string): Promise<Presentation> {
  const res = await fetch(`${API_BASE}/templates/${templateId}/clone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error('Failed to clone template');
  return res.json();
}

export async function startLiveSession(presentationId: string, hostName: string): Promise<{ session: LiveSession; code: string }> {
  const res = await fetch(`${API_BASE}/sessions/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ presentationId, hostName }),
  });
  if (!res.ok) throw new Error('Failed to start live session');
  return res.json();
}

export async function checkSessionCode(code: string) {
  const cleanCode = code.replace(/\s+/g, '');
  const res = await fetch(`${API_BASE}/sessions/code/${cleanCode}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Invalid session code. Please verify the 6-digit code on the projector.');
  }
  return res.json();
}

export async function fetchSessionById(sessionId: string) {
  const res = await fetch(`${API_BASE}/sessions/${sessionId}`);
  if (!res.ok) throw new Error('Session not found');
  return res.json();
}

export async function endLiveSession(sessionId: string) {
  const res = await fetch(`${API_BASE}/sessions/${sessionId}/end`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to end session');
  return res.json();
}

export async function fetchReports(): Promise<SessionReportSummary[]> {
  const res = await fetch(`${API_BASE}/reports`);
  if (!res.ok) throw new Error('Failed to fetch reports');
  return res.json();
}

export async function fetchReportDetails(sessionId: string) {
  const res = await fetch(`${API_BASE}/reports/${sessionId}`);
  if (!res.ok) throw new Error('Failed to load report analytics');
  return res.json();
}

export async function fetchAdminOverview() {
  const res = await fetch(`${API_BASE}/admin/overview`);
  if (!res.ok) throw new Error('Failed to load admin overview');
  return res.json();
}
