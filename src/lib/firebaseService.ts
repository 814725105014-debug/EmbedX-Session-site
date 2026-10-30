// ====================================================================
// FIREBASE CLOUD REALTIME SERVICE
// Enables 100% cloud hosting on Firebase Hosting & Firestore
// ====================================================================

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  where,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Presentation, LiveSession, Participant, ResponseRecord, QAQuestion } from '../types';

// Collection references
const SESSIONS_COLLECTION = 'sessions';
const PRESENTATIONS_COLLECTION = 'presentations';

// Generate 6-digit PIN code
export function generateFirebaseCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 1. Start a Live Session in Firestore
export async function startFirebaseSession(presentation: Presentation, hostName: string): Promise<{ session: LiveSession; code: string }> {
  const code = generateFirebaseCode();
  const sessionId = `sess-${Date.now()}-${code}`;

  const sessionData: any = {
    id: sessionId,
    code,
    presentationId: presentation.id,
    presentationTitle: presentation.title,
    hostName: hostName || 'EMBEDX Coordinator',
    status: 'active',
    currentSlideIndex: 0,
    currentSlideId: presentation.slides[0]?.id || '',
    votingLocked: false,
    showResults: true,
    quizTimerSeconds: null,
    startedAt: new Date().toISOString(),
    endedAt: null,
    presentationData: presentation,
    createdAt: serverTimestamp(),
  };

  const sessionRef = doc(db, SESSIONS_COLLECTION, code);
  await setDoc(sessionRef, sessionData);

  return { session: sessionData as LiveSession, code };
}

// 2. Fetch Session by 6-digit code
export async function fetchFirebaseSession(code: string): Promise<LiveSession | null> {
  const cleanCode = code.replace(/\s+/g, '');
  const sessionRef = doc(db, SESSIONS_COLLECTION, cleanCode);
  const snap = await getDoc(sessionRef);
  if (!snap.exists()) return null;
  return snap.data() as LiveSession;
}

// 3. Realtime Listener for Live Session State
export function subscribeToSession(code: string, callback: (session: LiveSession | null) => void) {
  const cleanCode = code.replace(/\s+/g, '');
  const sessionRef = doc(db, SESSIONS_COLLECTION, cleanCode);
  return onSnapshot(sessionRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as LiveSession);
    } else {
      callback(null);
    }
  });
}

// 4. Update Current Slide by Presenter
export async function updateFirebaseSlide(code: string, slideIndex: number, slideId: string) {
  const cleanCode = code.replace(/\s+/g, '');
  const sessionRef = doc(db, SESSIONS_COLLECTION, cleanCode);
  await updateDoc(sessionRef, {
    currentSlideIndex: slideIndex,
    currentSlideId: slideId,
    votingLocked: false,
    quizTimerSeconds: null,
  });
}

// 5. Toggle Voting Lock
export async function setFirebaseVotingLock(code: string, locked: boolean) {
  const cleanCode = code.replace(/\s+/g, '');
  const sessionRef = doc(db, SESSIONS_COLLECTION, cleanCode);
  await updateDoc(sessionRef, { votingLocked: locked });
}

// 6. Toggle Show Results
export async function setFirebaseShowResults(code: string, show: boolean) {
  const cleanCode = code.replace(/\s+/g, '');
  const sessionRef = doc(db, SESSIONS_COLLECTION, cleanCode);
  await updateDoc(sessionRef, { showResults: show });
}

// 7. Join Session as Participant
export async function joinFirebaseSession(code: string, participant: Participant) {
  const cleanCode = code.replace(/\s+/g, '');
  const participantRef = doc(db, SESSIONS_COLLECTION, cleanCode, 'participants', participant.id);
  await setDoc(participantRef, {
    ...participant,
    joinedAt: new Date().toISOString(),
  });
}

// 8. Listen to Participants in Session
export function subscribeToParticipants(code: string, callback: (participants: Participant[]) => void) {
  const cleanCode = code.replace(/\s+/g, '');
  const participantsRef = collection(db, SESSIONS_COLLECTION, cleanCode, 'participants');
  return onSnapshot(participantsRef, (snapshot) => {
    const list: Participant[] = [];
    snapshot.forEach((d) => list.push(d.data() as Participant));
    callback(list);
  });
}

// 9. Submit Participant Response
export async function submitFirebaseResponse(
  code: string,
  slideId: string,
  participantId: string,
  responseData: Partial<ResponseRecord>
) {
  const cleanCode = code.replace(/\s+/g, '');
  const respRef = doc(db, SESSIONS_COLLECTION, cleanCode, 'responses', `${slideId}_${participantId}`);
  await setDoc(respRef, {
    participantId,
    slideId,
    timestamp: new Date().toISOString(),
    ...responseData,
  });
}

// 10. Listen to Slide Responses
export function subscribeToResponses(code: string, callback: (responses: Record<string, ResponseRecord>) => void) {
  const cleanCode = code.replace(/\s+/g, '');
  const respCollection = collection(db, SESSIONS_COLLECTION, cleanCode, 'responses');
  return onSnapshot(respCollection, (snapshot) => {
    const map: Record<string, ResponseRecord> = {};
    snapshot.forEach((d) => {
      const data = d.data() as ResponseRecord & { slideId: string };
      map[data.participantId] = data;
    });
    callback(map);
  });
}

// 11. Send Floating Reaction
export async function sendFirebaseReaction(code: string, reaction: string) {
  const cleanCode = code.replace(/\s+/g, '');
  const rxId = `rx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const rxRef = doc(db, SESSIONS_COLLECTION, cleanCode, 'reactions', rxId);
  await setDoc(rxRef, {
    id: rxId,
    reaction,
    createdAt: Date.now(),
  });
}

// 12. Listen to Floating Reactions
export function subscribeToReactions(code: string, callback: (reactions: Array<{ id: string; reaction: string }>) => void) {
  const cleanCode = code.replace(/\s+/g, '');
  const rxCollection = collection(db, SESSIONS_COLLECTION, cleanCode, 'reactions');
  return onSnapshot(rxCollection, (snapshot) => {
    const list: Array<{ id: string; reaction: string }> = [];
    snapshot.forEach((d) => list.push(d.data() as { id: string; reaction: string }));
    callback(list);
  });
}
