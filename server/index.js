// ====================================================================
// EMBEDX INTERACTIVE - REALTIME BACKEND SERVER
// Mentimeter-Inspired Live Engagement Platform
// Embedded Systems & Automation Club, SRM TRP Engineering College
// ====================================================================

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_TEMPLATES } from './templates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

// --------------------------------------------------------------------
// PERSISTENCE STORAGE
// --------------------------------------------------------------------
let db = {
  presentations: [],
  sessions: {},
  participants: {},
  responses: {},
  participant_questions: {},
  system_users: [
    { id: 'usr-1', email: 'admin@embedx.srmtrp.edu.in', fullName: 'EMBEDX Super Admin', role: 'super_admin' },
    { id: 'usr-2', email: 'coordinator@embedx.srmtrp.edu.in', fullName: 'Club Coordinator', role: 'club_admin' },
    { id: 'usr-3', email: 'presenter@srmtrp.edu.in', fullName: 'Faculty / Student Presenter', role: 'presenter' }
  ]
};

// Seed initial presentations if DB is empty
function seedDatabase() {
  if (db.presentations.length === 0) {
    const starter = DEFAULT_TEMPLATES[0];
    db.presentations.push({
      id: 'pres-starter-1',
      userId: 'usr-2',
      title: 'EMBEDX Welcome & Microcontroller Trivia',
      description: 'Hands-on interactive kickoff for Embedded Systems & Automation Club members.',
      category: 'Orientation',
      theme: 'cyber_dark',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slides: starter.slides.map((s, idx) => ({
        ...s,
        id: `slide-seed-${idx + 1}`
      }))
    });
    saveDb();
  }
}

function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      db = { ...db, ...JSON.parse(data) };
    } else {
      seedDatabase();
    }
  } catch (err) {
    console.error('Error loading DB, initializing fresh:', err);
    seedDatabase();
  }
}

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

loadDb();

// Generate a random 6-digit session PIN code (e.g. 583 291)
function generateSessionCode() {
  let code;
  let attempts = 0;
  do {
    code = Math.floor(100000 + Math.random() * 900000).toString();
    attempts++;
  } while (db.sessions[code] && db.sessions[code].status === 'active' && attempts < 100);
  return code;
}

// --------------------------------------------------------------------
// REST API ROUTES
// --------------------------------------------------------------------

// Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'EMBEDX INTERACTIVE Live Engine',
    institution: 'Department of EEE, SRM TRP Engineering College',
    activeSessions: Object.values(db.sessions).filter(s => s.status === 'active').length,
    timestamp: new Date().toISOString()
  });
});

// Templates
app.get('/api/templates', (req, res) => {
  res.json(DEFAULT_TEMPLATES);
});

app.post('/api/templates/:id/clone', (req, res) => {
  const template = DEFAULT_TEMPLATES.find(t => t.id === req.params.id);
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }

  const newPresentation = {
    id: `pres-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: req.body.userId || 'usr-2',
    title: `${template.title} (Copy)`,
    description: template.description,
    category: template.category,
    theme: 'cyber_dark',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slides: template.slides.map((s, idx) => ({
      ...s,
      id: `slide-${Date.now()}-${idx}`
    }))
  };

  db.presentations.unshift(newPresentation);
  saveDb();
  res.status(201).json(newPresentation);
});

// Presentations CRUD
app.get('/api/presentations', (req, res) => {
  res.json(db.presentations);
});

app.post('/api/presentations', (req, res) => {
  const { title, description, category, theme, slides } = req.body;
  const newPresentation = {
    id: `pres-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: req.body.userId || 'usr-2',
    title: title || 'Untitled Presentation',
    description: description || '',
    category: category || 'Technical Workshop',
    theme: theme || 'cyber_dark',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slides: slides || [
      {
        id: `slide-${Date.now()}-0`,
        orderIndex: 0,
        type: 'multiple_choice',
        title: 'Welcome to EMBEDX Interactive!',
        description: 'What embedded domain are you most interested in?',
        options: [
          { id: 'opt-1', text: 'Microcontroller Architecture & Firmware' },
          { id: 'opt-2', text: 'Robotics & Autonomous Rovers' },
          { id: 'opt-3', text: 'IoT & Wireless Sensor Networks' },
          { id: 'opt-4', text: 'Circuit Design & PCB Fabrication' }
        ]
      }
    ]
  };

  db.presentations.unshift(newPresentation);
  saveDb();
  res.status(201).json(newPresentation);
});

app.get('/api/presentations/:id', (req, res) => {
  const pres = db.presentations.find(p => p.id === req.params.id);
  if (!pres) return res.status(404).json({ error: 'Presentation not found' });
  res.json(pres);
});

app.put('/api/presentations/:id', (req, res) => {
  const index = db.presentations.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Presentation not found' });

  const updated = {
    ...db.presentations[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  db.presentations[index] = updated;
  saveDb();
  res.json(updated);
});

app.post('/api/presentations/:id/duplicate', (req, res) => {
  const pres = db.presentations.find(p => p.id === req.params.id);
  if (!pres) return res.status(404).json({ error: 'Presentation not found' });

  const duplicate = {
    ...pres,
    id: `pres-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: `${pres.title} (Clone)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slides: pres.slides.map(s => ({
      ...s,
      id: `slide-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    }))
  };

  db.presentations.unshift(duplicate);
  saveDb();
  res.status(201).json(duplicate);
});

app.delete('/api/presentations/:id', (req, res) => {
  db.presentations = db.presentations.filter(p => p.id !== req.params.id);
  saveDb();
  res.json({ success: true, message: 'Presentation deleted successfully' });
});

// Live Sessions
app.post('/api/sessions/start', (req, res) => {
  const { presentationId, hostName } = req.body;
  const presentation = db.presentations.find(p => p.id === presentationId);
  if (!presentation) {
    return res.status(404).json({ error: 'Presentation not found' });
  }

  const code = generateSessionCode();
  const sessionId = `sess-${Date.now()}-${code}`;

  const session = {
    id: sessionId,
    code,
    presentationId,
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
    presentationData: presentation // Snapshot for immutability during live event
  };

  db.sessions[code] = session;
  db.participants[code] = [];
  db.responses[code] = {};
  db.participant_questions[code] = [];
  saveDb();

  res.status(201).json({ session, code });
});

// Check session code (Participant Join)
app.get('/api/sessions/code/:code', (req, res) => {
  const code = req.params.code.replace(/\s+/g, '');
  const session = db.sessions[code];

  if (!session) {
    return res.status(404).json({ error: 'Session code not found. Please check the 6-digit code on the presenter screen.' });
  }

  if (session.status !== 'active') {
    return res.status(400).json({ error: 'This session has already concluded or is paused.' });
  }

  const currentSlide = session.presentationData.slides[session.currentSlideIndex];

  res.json({
    code: session.code,
    sessionId: session.id,
    presentationTitle: session.presentationTitle,
    hostName: session.hostName,
    status: session.status,
    currentSlideIndex: session.currentSlideIndex,
    totalSlides: session.presentationData.slides.length,
    currentSlide,
    votingLocked: session.votingLocked,
    showResults: session.showResults,
    participantCount: (db.participants[code] || []).length
  });
});

// Get session status by ID (Presenter view)
app.get('/api/sessions/:id', (req, res) => {
  const session = Object.values(db.sessions).find(s => s.id === req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  const code = session.code;
  const participants = db.participants[code] || [];
  const responses = db.responses[code] || {};
  const questions = db.participant_questions[code] || [];

  res.json({
    session,
    participants,
    responses,
    questions
  });
});

// End session
app.post('/api/sessions/:id/end', (req, res) => {
  const session = Object.values(db.sessions).find(s => s.id === req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  session.status = 'completed';
  session.endedAt = new Date().toISOString();
  saveDb();

  io.to(`session_${session.code}`).emit('session_ended', {
    message: 'The presentation has finished. Thank you for participating with EMBEDX!'
  });

  res.json({ success: true, session });
});

// --------------------------------------------------------------------
// REPORTS & ANALYTICS
// --------------------------------------------------------------------
app.get('/api/reports', (req, res) => {
  const allSessions = Object.values(db.sessions).map(s => {
    const code = s.code;
    const participants = db.participants[code] || [];
    const responsesMap = db.responses[code] || {};
    let totalResponses = 0;
    Object.values(responsesMap).forEach(slideResp => {
      totalResponses += Object.keys(slideResp).length;
    });

    return {
      id: s.id,
      code: s.code,
      title: s.presentationTitle,
      hostName: s.hostName,
      status: s.status,
      startedAt: s.startedAt,
      endedAt: s.endedAt,
      totalParticipants: participants.length,
      totalResponses,
      totalSlides: s.presentationData?.slides?.length || 0
    };
  });

  // Sort newest first
  allSessions.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  res.json(allSessions);
});

app.get('/api/reports/:sessionId', (req, res) => {
  const session = Object.values(db.sessions).find(s => s.id === req.params.sessionId);
  if (!session) return res.status(404).json({ error: 'Report not found' });

  const code = session.code;
  const participants = db.participants[code] || [];
  const responses = db.responses[code] || {};
  const questions = db.participant_questions[code] || [];
  const slides = session.presentationData.slides || [];

  // Calculate question-by-question breakdown
  const slideAnalytics = slides.map(slide => {
    const slideResponses = Object.values(responses[slide.id] || {});
    const count = slideResponses.length;

    let analysis = {
      slideId: slide.id,
      title: slide.title,
      type: slide.type,
      responseCount: count,
      participationRate: participants.length ? Math.round((count / participants.length) * 100) : 0
    };

    if (slide.type === 'multiple_choice' || slide.type === 'quiz' || slide.type === 'true_false') {
      const optionCounts = {};
      (slide.options || []).forEach(opt => {
        optionCounts[opt.id] = { text: opt.text, isCorrect: opt.isCorrect, count: 0 };
      });
      slideResponses.forEach(r => {
        if (optionCounts[r.optionId]) {
          optionCounts[r.optionId].count++;
        }
      });
      analysis.optionBreakdown = optionCounts;
    } else if (slide.type === 'word_cloud') {
      const words = {};
      slideResponses.forEach(r => {
        const text = (r.text || '').toLowerCase().trim();
        if (text) {
          words[text] = (words[text] || 0) + 1;
        }
      });
      analysis.wordFrequency = words;
    } else if (slide.type === 'rating_scale') {
      const ratings = slideResponses.map(r => Number(r.rating) || 0).filter(v => v > 0);
      const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 0;
      analysis.averageRating = avg;
      analysis.ratingCount = ratings.length;
    } else if (slide.type === 'ranking') {
      analysis.rankings = slideResponses.map(r => r.ranks);
    } else if (slide.type === 'open_ended') {
      analysis.textSubmissions = slideResponses.map(r => ({
        participantName: r.nickname || 'Anonymous',
        text: r.text,
        time: r.timestamp
      }));
    }

    return analysis;
  });

  // Quiz Leaderboard
  const leaderboard = [...participants]
    .map(p => ({
      id: p.id,
      nickname: p.nickname,
      avatar: p.avatar,
      score: p.score || 0
    }))
    .sort((a, b) => b.score - a.score);

  res.json({
    session,
    participants,
    totalParticipants: participants.length,
    slideAnalytics,
    leaderboard,
    questions
  });
});

// CSV Export
app.get('/api/reports/:sessionId/export', (req, res) => {
  const session = Object.values(db.sessions).find(s => s.id === req.params.sessionId);
  if (!session) return res.status(404).send('Session not found');

  const code = session.code;
  const participants = db.participants[code] || [];
  const responses = db.responses[code] || {};
  const slides = session.presentationData.slides || [];

  let csv = `EMBEDX INTERACTIVE SESSION REPORT\n`;
  csv += `Title,${session.presentationTitle}\n`;
  csv += `Session Code,${session.code}\n`;
  csv += `Host,${session.hostName}\n`;
  csv += `Started At,${session.startedAt}\n`;
  csv += `Ended At,${session.endedAt || 'Active'}\n`;
  csv += `Total Participants,${participants.length}\n\n`;

  csv += `--- PARTICIPANT LEADERBOARD ---\n`;
  csv += `Rank,Nickname,Score,Joined At\n`;
  const sortedParticipants = [...participants].sort((a, b) => (b.score || 0) - (a.score || 0));
  sortedParticipants.forEach((p, idx) => {
    csv += `${idx + 1},"${p.nickname}",${p.score || 0},${p.joinedAt}\n`;
  });
  csv += `\n`;

  csv += `--- QUESTION RESPONSES BREAKDOWN ---\n`;
  slides.forEach((slide, sIdx) => {
    csv += `Slide ${sIdx + 1}: [${slide.type.toUpperCase()}] "${slide.title}"\n`;
    const slideResponses = Object.values(responses[slide.id] || {});
    csv += `Total Responses,${slideResponses.length}\n`;

    if (slide.options && slide.options.length) {
      slide.options.forEach(opt => {
        const count = slideResponses.filter(r => r.optionId === opt.id).length;
        csv += `Option: "${opt.text}",${count} votes,${opt.isCorrect ? '(Correct)' : ''}\n`;
      });
    } else {
      slideResponses.forEach(r => {
        csv += `Participant: "${r.nickname || 'Anonymous'}",Response: "${r.text || r.rating || ''}"\n`;
      });
    }
    csv += `\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=embedx-report-${session.code}.csv`);
  res.send(csv);
});

// Admin overview & actions
app.get('/api/admin/overview', (req, res) => {
  res.json({
    totalPresentations: db.presentations.length,
    activeSessions: Object.values(db.sessions).filter(s => s.status === 'active'),
    totalSessionsCount: Object.values(db.sessions).length,
    systemUsers: db.system_users,
    institution: 'Department of Electrical & Electronics Engineering, SRM TRP Engineering College'
  });
});

app.post('/api/admin/clear-session/:code', (req, res) => {
  const code = req.params.code;
  if (db.sessions[code]) {
    db.sessions[code].status = 'completed';
    saveDb();
  }
  res.json({ success: true });
});

// --------------------------------------------------------------------
// REALTIME SOCKET.IO ENGINE
// --------------------------------------------------------------------
io.on('connection', (socket) => {
  let currentSessionCode = null;
  let participantInfo = null;

  // Participant Joins
  socket.on('join_session', ({ sessionCode, nickname, avatar, participantId }) => {
    const cleanCode = (sessionCode || '').replace(/\s+/g, '');
    const session = db.sessions[cleanCode];

    if (!session || session.status !== 'active') {
      socket.emit('error_message', { message: 'Invalid or inactive session code.' });
      return;
    }

    currentSessionCode = cleanCode;
    socket.join(`session_${cleanCode}`);

    if (!db.participants[cleanCode]) {
      db.participants[cleanCode] = [];
    }

    // Check if participant already exists in session
    let existing = db.participants[cleanCode].find(p => p.id === participantId);
    if (!existing) {
      existing = {
        id: participantId || `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        nickname: nickname || `Student #${Math.floor(100 + Math.random() * 900)}`,
        avatar: avatar || '⚡',
        score: 0,
        joinedAt: new Date().toISOString(),
        socketId: socket.id
      };
      db.participants[cleanCode].push(existing);
      saveDb();
    } else {
      existing.socketId = socket.id;
    }

    participantInfo = existing;

    // Send state to joined participant
    const currentSlide = session.presentationData.slides[session.currentSlideIndex];
    const userSlideResponse = db.responses[cleanCode]?.[currentSlide?.id]?.[existing.id] || null;

    socket.emit('session_state', {
      sessionCode: cleanCode,
      presentationTitle: session.presentationTitle,
      hostName: session.hostName,
      currentSlideIndex: session.currentSlideIndex,
      totalSlides: session.presentationData.slides.length,
      currentSlide,
      votingLocked: session.votingLocked,
      showResults: session.showResults,
      userResponse: userSlideResponse,
      participant: existing,
      quizTimerSeconds: session.quizTimerSeconds
    });

    // Notify room of participant count & list update
    io.to(`session_${cleanCode}`).emit('participant_joined', {
      participant: existing,
      totalCount: db.participants[cleanCode].length,
      participantsList: db.participants[cleanCode]
    });
  });

  // Presenter Joins Host Room
  socket.on('host_join', ({ sessionCode }) => {
    const cleanCode = (sessionCode || '').replace(/\s+/g, '');
    const session = db.sessions[cleanCode];
    if (!session) return;

    currentSessionCode = cleanCode;
    socket.join(`session_${cleanCode}`);
    socket.join(`host_${cleanCode}`);

    const currentSlide = session.presentationData.slides[session.currentSlideIndex];
    const currentResponses = db.responses[cleanCode]?.[currentSlide?.id] || {};
    const questions = db.participant_questions[cleanCode] || [];

    socket.emit('host_synced', {
      session,
      participants: db.participants[cleanCode] || [],
      responses: currentResponses,
      questions
    });
  });

  // Slide Change by Presenter
  socket.on('change_slide', ({ sessionCode, slideIndex }) => {
    const cleanCode = (sessionCode || '').replace(/\s+/g, '');
    const session = db.sessions[cleanCode];
    if (!session) return;

    if (slideIndex >= 0 && slideIndex < session.presentationData.slides.length) {
      session.currentSlideIndex = slideIndex;
      session.currentSlideId = session.presentationData.slides[slideIndex].id;
      session.votingLocked = false;
      session.quizTimerSeconds = null;
      saveDb();

      const newSlide = session.presentationData.slides[slideIndex];

      // Broadcast slide change to all participants and host
      io.to(`session_${cleanCode}`).emit('slide_changed', {
        slideIndex,
        totalSlides: session.presentationData.slides.length,
        currentSlide: newSlide,
        votingLocked: session.votingLocked,
        showResults: session.showResults
      });
    }
  });

  // Toggle Voting Lock
  socket.on('set_voting_locked', ({ sessionCode, locked }) => {
    const cleanCode = (sessionCode || '').replace(/\s+/g, '');
    const session = db.sessions[cleanCode];
    if (!session) return;

    session.votingLocked = locked;
    saveDb();

    io.to(`session_${cleanCode}`).emit('voting_state_changed', {
      locked: session.votingLocked
    });
  });

  // Toggle Results Visibility
  socket.on('set_show_results', ({ sessionCode, show }) => {
    const cleanCode = (sessionCode || '').replace(/\s+/g, '');
    const session = db.sessions[cleanCode];
    if (!session) return;

    session.showResults = show;
    saveDb();

    io.to(`session_${cleanCode}`).emit('results_visibility_changed', {
      show: session.showResults
    });
  });

  // Quiz Countdown Timer Trigger
  socket.on('start_quiz_timer', ({ sessionCode, seconds }) => {
    const cleanCode = (sessionCode || '').replace(/\s+/g, '');
    const session = db.sessions[cleanCode];
    if (!session) return;

    session.quizTimerSeconds = seconds;
    io.to(`session_${cleanCode}`).emit('quiz_timer_tick', { seconds });
  });

  // Reset current question responses
  socket.on('reset_slide_responses', ({ sessionCode, slideId }) => {
    const cleanCode = (sessionCode || '').replace(/\s+/g, '');
    if (db.responses[cleanCode] && db.responses[cleanCode][slideId]) {
      delete db.responses[cleanCode][slideId];
      saveDb();

      io.to(`session_${cleanCode}`).emit('responses_reset', { slideId });
    }
  });

  // Participant Submits Response
  socket.on('submit_response', ({ sessionCode, participantId, slideId, responseData }) => {
    const cleanCode = (sessionCode || '').replace(/\s+/g, '');
    const session = db.sessions[cleanCode];
    if (!session) return;

    if (session.votingLocked) {
      socket.emit('error_message', { message: 'Voting is currently closed for this slide.' });
      return;
    }

    if (!db.responses[cleanCode]) db.responses[cleanCode] = {};
    if (!db.responses[cleanCode][slideId]) db.responses[cleanCode][slideId] = {};

    const currentSlide = session.presentationData.slides.find(s => s.id === slideId);
    if (!currentSlide) return;

    // Quiz scoring logic
    let pointsAwarded = 0;
    let isCorrect = false;

    if (currentSlide.type === 'quiz') {
      const correctOption = (currentSlide.options || []).find(o => o.isCorrect);
      if (correctOption && responseData.optionId === correctOption.id) {
        isCorrect = true;
        const basePoints = currentSlide.points || 1000;
        // Speed bonus: up to 500 points depending on response time
        const responseTime = responseData.responseTimeMs || 5000;
        const timerMs = (currentSlide.timerSeconds || 20) * 1000;
        const timeFraction = Math.max(0, 1 - (responseTime / timerMs));
        const speedBonus = currentSlide.speedBonus ? Math.round(500 * timeFraction) : 0;
        pointsAwarded = basePoints + speedBonus;

        // Update participant score in memory & DB
        const participant = (db.participants[cleanCode] || []).find(p => p.id === participantId);
        if (participant) {
          participant.score = (participant.score || 0) + pointsAwarded;
        }
      }
    }

    const recorded = {
      participantId,
      nickname: responseData.nickname || participantInfo?.nickname || 'Participant',
      timestamp: new Date().toISOString(),
      pointsAwarded,
      isCorrect,
      ...responseData
    };

    db.responses[cleanCode][slideId][participantId] = recorded;
    saveDb();

    // Confirm submission to participant
    socket.emit('response_confirmed', {
      slideId,
      response: recorded,
      pointsAwarded,
      isCorrect
    });

    // Broadcast updated responses to host and session room
    const allSlideResponses = Object.values(db.responses[cleanCode][slideId]);
    io.to(`session_${cleanCode}`).emit('response_received', {
      slideId,
      totalResponses: allSlideResponses.length,
      allResponses: allSlideResponses,
      latestResponse: recorded
    });

    // If quiz, emit updated leaderboard
    if (currentSlide.type === 'quiz') {
      const leaderboard = [...(db.participants[cleanCode] || [])]
        .map(p => ({
          id: p.id,
          nickname: p.nickname,
          avatar: p.avatar,
          score: p.score || 0
        }))
        .sort((a, b) => b.score - a.score);

      io.to(`session_${cleanCode}`).emit('leaderboard_update', { leaderboard });
    }
  });

  // Q&A Question Submitted
  socket.on('submit_question', ({ sessionCode, participantId, nickname, questionText }) => {
    const cleanCode = (sessionCode || '').replace(/\s+/g, '');
    if (!db.participant_questions[cleanCode]) db.participant_questions[cleanCode] = [];

    const newQ = {
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      participantId,
      nickname: nickname || 'Student',
      text: questionText,
      upvotes: 1,
      voters: [participantId],
      isAnswered: false,
      isPinned: false,
      createdAt: new Date().toISOString()
    };

    db.participant_questions[cleanCode].push(newQ);
    saveDb();

    io.to(`session_${cleanCode}`).emit('question_added', {
      question: newQ,
      allQuestions: db.participant_questions[cleanCode]
    });
  });

  // Q&A Upvote Question
  socket.on('upvote_question', ({ sessionCode, questionId, participantId }) => {
    const cleanCode = (sessionCode || '').replace(/\s+/g, '');
    const questions = db.participant_questions[cleanCode] || [];
    const target = questions.find(q => q.id === questionId);

    if (target) {
      if (!target.voters) target.voters = [];
      const hasVoted = target.voters.includes(participantId);

      if (hasVoted) {
        target.voters = target.voters.filter(v => v !== participantId);
        target.upvotes = Math.max(0, target.upvotes - 1);
      } else {
        target.voters.push(participantId);
        target.upvotes++;
      }

      saveDb();
      io.to(`session_${cleanCode}`).emit('question_updated', {
        question: target,
        allQuestions: questions
      });
    }
  });

  // Presenter Moderate Question
  socket.on('moderate_question', ({ sessionCode, questionId, action }) => {
    const cleanCode = (sessionCode || '').replace(/\s+/g, '');
    const questions = db.participant_questions[cleanCode] || [];
    const target = questions.find(q => q.id === questionId);

    if (target) {
      if (action === 'answer') target.isAnswered = !target.isAnswered;
      if (action === 'pin') target.isPinned = !target.isPinned;
      if (action === 'delete') {
        db.participant_questions[cleanCode] = questions.filter(q => q.id !== questionId);
      }
      saveDb();

      io.to(`session_${cleanCode}`).emit('question_updated', {
        allQuestions: db.participant_questions[cleanCode]
      });
    }
  });

  // Realtime Live Emoji Reactions (Floating on Presenter Screen!)
  socket.on('send_reaction', ({ sessionCode, reaction }) => {
    const cleanCode = (sessionCode || '').replace(/\s+/g, '');
    io.to(`session_${cleanCode}`).emit('reaction_received', {
      reaction,
      id: `rx-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`
    });
  });

  // Disconnection handler
  socket.on('disconnect', () => {
    if (currentSessionCode && participantInfo) {
      // Don't remove participant score or presence history, but update socket status
    }
  });
});

// Static production files serving if dist exists
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start Server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 EMBEDX INTERACTIVE Server Running on port ${PORT}`);
  console.log(`🏫 Embedded Systems & Automation Club`);
  console.log(`⚡ Department of EEE, SRM TRP Engineering College`);
  console.log(`📡 Realtime Socket.IO Engine: ACTIVE`);
  console.log(`====================================================`);
});
