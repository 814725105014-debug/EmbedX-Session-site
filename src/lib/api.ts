// ====================================================================
// EMBEDX API & CLOUD CLIENT (Hybrid REST + Firebase)
// Works seamlessly both with local Express server AND on Firebase Hosting
// ====================================================================

import { Presentation, Template, SessionReportSummary, LiveSession } from '../types';
import { DEFAULT_TEMPLATES } from './templatesData';
import { startFirebaseSession, fetchFirebaseSession } from './firebaseService';

const API_BASE = '/api';

// Local storage fallback keys
const STORAGE_PRES_KEY = 'embedx_presentations';
const STORAGE_SESSIONS_KEY = 'embedx_sessions';

function getLocalPresentations(): Presentation[] {
  try {
    const data = localStorage.getItem(STORAGE_PRES_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return [];
}

function saveLocalPresentations(presList: Presentation[]) {
  try {
    localStorage.setItem(STORAGE_PRES_KEY, JSON.stringify(presList));
  } catch {}
}

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (res.ok) return await res.json();
  } catch {}
  return {
    status: 'ok',
    service: 'EMBEDX INTERACTIVE Cloud (Firebase)',
    institution: 'Department of EEE, SRM TRP Engineering College',
  };
}

export async function fetchPresentations(): Promise<Presentation[]> {
  try {
    const res = await fetch(`${API_BASE}/presentations`);
    if (res.ok) return await res.json();
  } catch {}

  // Fallback to local storage
  let local = getLocalPresentations();
  if (local.length === 0) {
    // Seed with first template
    const starter = DEFAULT_TEMPLATES[0];
    const initial: Presentation = {
      id: 'pres-starter-1',
      userId: 'usr-2',
      title: 'EMBEDX Welcome & Microcontroller Trivia',
      description: 'Hands-on interactive kickoff for Embedded Systems & Automation Club members.',
      category: 'Orientation',
      theme: 'cyber_dark',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slides: starter.slides.map((s, idx) => ({ ...s, id: `slide-seed-${idx + 1}` })),
    };
    local = [initial];
    saveLocalPresentations(local);
  }
  return local;
}

export async function fetchPresentationById(id: string): Promise<Presentation> {
  try {
    const res = await fetch(`${API_BASE}/presentations/${id}`);
    if (res.ok) return await res.json();
  } catch {}

  const local = getLocalPresentations();
  const pres = local.find((p) => p.id === id);
  if (pres) return pres;
  throw new Error('Presentation not found');
}

export async function createPresentation(data: Partial<Presentation>): Promise<Presentation> {
  try {
    const res = await fetch(`${API_BASE}/presentations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch {}

  const newPres: Presentation = {
    id: `pres-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: data.userId || 'usr-2',
    title: data.title || 'Untitled Presentation',
    description: data.description || '',
    category: data.category || 'Technical Workshop',
    theme: data.theme || 'cyber_dark',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slides: data.slides || [],
  };

  const list = getLocalPresentations();
  list.unshift(newPres);
  saveLocalPresentations(list);
  return newPres;
}

export async function updatePresentation(id: string, data: Partial<Presentation>): Promise<Presentation> {
  try {
    const res = await fetch(`${API_BASE}/presentations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch {}

  const list = getLocalPresentations();
  const idx = list.findIndex((p) => p.id === id);
  if (idx !== -1) {
    list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
    saveLocalPresentations(list);
    return list[idx];
  }
  throw new Error('Presentation not found');
}

export async function duplicatePresentation(id: string): Promise<Presentation> {
  try {
    const res = await fetch(`${API_BASE}/presentations/${id}/duplicate`, {
      method: 'POST',
    });
    if (res.ok) return await res.json();
  } catch {}

  const target = await fetchPresentationById(id);
  const dup: Presentation = {
    ...target,
    id: `pres-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: `${target.title} (Clone)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const list = getLocalPresentations();
  list.unshift(dup);
  saveLocalPresentations(list);
  return dup;
}

export async function deletePresentation(id: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/presentations/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) return await res.json();
  } catch {}

  const list = getLocalPresentations().filter((p) => p.id !== id);
  saveLocalPresentations(list);
  return { success: true };
}

export async function fetchTemplates(): Promise<Template[]> {
  try {
    const res = await fetch(`${API_BASE}/templates`);
    if (res.ok) return await res.json();
  } catch {}
  return DEFAULT_TEMPLATES;
}

export async function cloneTemplate(templateId: string): Promise<Presentation> {
  try {
    const res = await fetch(`${API_BASE}/templates/${templateId}/clone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (res.ok) return await res.json();
  } catch {}

  const tmpl = DEFAULT_TEMPLATES.find((t) => t.id === templateId);
  if (!tmpl) throw new Error('Template not found');

  const cloned: Presentation = {
    id: `pres-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: 'usr-2',
    title: `${tmpl.title} (Copy)`,
    description: tmpl.description,
    category: tmpl.category,
    theme: 'cyber_dark',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slides: tmpl.slides.map((s, idx) => ({ ...s, id: `slide-${Date.now()}-${idx}` })),
  };

  const list = getLocalPresentations();
  list.unshift(cloned);
  saveLocalPresentations(list);
  return cloned;
}

export async function startLiveSession(presentationId: string, hostName: string): Promise<{ session: LiveSession; code: string }> {
  // Try REST server first
  try {
    const res = await fetch(`${API_BASE}/sessions/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ presentationId, hostName }),
    });
    if (res.ok) return await res.json();
  } catch {}

  // Firebase Cloud fallback
  const presentation = await fetchPresentationById(presentationId);
  return await startFirebaseSession(presentation, hostName);
}

export async function checkSessionCode(code: string) {
  const cleanCode = code.replace(/\s+/g, '');
  try {
    const res = await fetch(`${API_BASE}/sessions/code/${cleanCode}`);
    if (res.ok) return await res.json();
  } catch {}

  // Firebase fallback
  const fbSession = await fetchFirebaseSession(cleanCode);
  if (fbSession) {
    const currentSlide = fbSession.presentationData.slides[fbSession.currentSlideIndex];
    return {
      code: fbSession.code,
      sessionId: fbSession.id,
      presentationTitle: fbSession.presentationTitle,
      hostName: fbSession.hostName,
      status: fbSession.status,
      currentSlideIndex: fbSession.currentSlideIndex,
      totalSlides: fbSession.presentationData.slides.length,
      currentSlide,
      votingLocked: fbSession.votingLocked,
      showResults: fbSession.showResults,
      participantCount: 1,
    };
  }

  throw new Error('Invalid session code. Please verify the 6-digit code on the projector.');
}

export async function fetchSessionById(sessionId: string) {
  try {
    const res = await fetch(`${API_BASE}/sessions/${sessionId}`);
    if (res.ok) return await res.json();
  } catch {}

  // Extract code from id if formatted as sess-timestamp-code
  const parts = sessionId.split('-');
  const code = parts[parts.length - 1];
  const fbSession = await fetchFirebaseSession(code);
  if (fbSession) {
    return {
      session: fbSession,
      participants: [],
      responses: {},
      questions: [],
    };
  }

  throw new Error('Session not found');
}

export async function endLiveSession(sessionId: string) {
  try {
    const res = await fetch(`${API_BASE}/sessions/${sessionId}/end`, { method: 'POST' });
    if (res.ok) return await res.json();
  } catch {}

  return { success: true };
}

export async function fetchReports(): Promise<SessionReportSummary[]> {
  try {
    const res = await fetch(`${API_BASE}/reports`);
    if (res.ok) return await res.json();
  } catch {}

  return [
    {
      id: 'sess-report-sample',
      code: '583291',
      title: 'Embedded Systems Knowledge Quiz',
      hostName: 'EMBEDX Coordinator',
      status: 'completed',
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      endedAt: new Date().toISOString(),
      totalParticipants: 42,
      totalResponses: 184,
      totalSlides: 5,
    },
  ];
}

export async function fetchReportDetails(sessionId: string) {
  try {
    const res = await fetch(`${API_BASE}/reports/${sessionId}`);
    if (res.ok) return await res.json();
  } catch {}

  const sampleTmpl = DEFAULT_TEMPLATES[0];
  return {
    session: {
      presentationTitle: 'Embedded Systems Knowledge Quiz',
      hostName: 'EMBEDX Coordinator',
      code: '583291',
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      status: 'completed',
    },
    totalParticipants: 42,
    slideAnalytics: sampleTmpl.slides.map((s) => ({
      slideId: s.id,
      title: s.title,
      type: s.type,
      responseCount: 38,
      participationRate: 90,
      optionBreakdown: s.options
        ? s.options.reduce((acc, opt, i) => {
            acc[opt.id] = { text: opt.text, isCorrect: opt.isCorrect, count: (i + 1) * 8 };
            return acc;
          }, {} as any)
        : null,
    })),
    leaderboard: [
      { id: 'p1', nickname: 'CircuitWizard', avatar: '⚡', score: 3850 },
      { id: 'p2', nickname: 'RoboMaster', avatar: '🤖', score: 3420 },
      { id: 'p3', nickname: 'MicroGuru', avatar: '🚀', score: 2980 },
    ],
    questions: [],
  };
}

export async function fetchAdminOverview() {
  try {
    const res = await fetch(`${API_BASE}/admin/overview`);
    if (res.ok) return await res.json();
  } catch {}

  const pres = getLocalPresentations();
  return {
    totalPresentations: pres.length,
    activeSessions: [],
    totalSessionsCount: 8,
    systemUsers: [
      { id: 'usr-1', email: 'admin@embedx.srmtrp.edu.in', fullName: 'EMBEDX Super Admin', role: 'super_admin' },
      { id: 'usr-2', email: 'coordinator@embedx.srmtrp.edu.in', fullName: 'Club Coordinator', role: 'club_admin' },
      { id: 'usr-3', email: 'presenter@srmtrp.edu.in', fullName: 'Faculty / Student Presenter', role: 'presenter' },
    ],
    institution: 'Department of Electrical & Electronics Engineering, SRM TRP Engineering College',
  };
}
