// ====================================================================
// AUTOMATED END-TO-END VERIFICATION SUITE
// EMBEDX INTERACTIVE PLATFORM
// ====================================================================

import http from 'http';
import { io } from 'socket.io-client';

const BASE_URL = 'http://localhost:3001';

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting EMBEDX Interactive Automated Test Suite...\n');

  try {
    // 1. Health check
    console.log('1️⃣ Checking /api/health...');
    const health = await request('GET', '/api/health');
    console.log('   Status:', health.status);
    console.log('   Service:', health.body.service);
    console.log('   Institution:', health.body.institution);
    if (health.status !== 200) throw new Error('Health check failed');

    // 2. Templates
    console.log('\n2️⃣ Testing /api/templates...');
    const templates = await request('GET', '/api/templates');
    console.log('   Templates loaded count:', templates.body.length);
    if (templates.body.length < 10) throw new Error('Expected at least 10 templates');

    // 3. Clone template
    console.log('\n3️⃣ Testing Template Cloning...');
    const firstTemplate = templates.body[0];
    const cloned = await request('POST', `/api/templates/${firstTemplate.id}/clone`, {});
    console.log('   Cloned presentation ID:', cloned.body.id);
    console.log('   Title:', cloned.body.title);
    console.log('   Slides count:', cloned.body.slides.length);
    if (!cloned.body.id) throw new Error('Failed to clone template');

    // 4. Start Live Session
    console.log('\n4️⃣ Starting Live Session...');
    const sessionRes = await request('POST', '/api/sessions/start', {
      presentationId: cloned.body.id,
      hostName: 'Prof. EEE Coordinator'
    });
    const session = sessionRes.body.session;
    const sessionCode = sessionRes.body.code;
    console.log('   Live Session ID:', session.id);
    console.log('   Generated 6-Digit PIN:', sessionCode);
    if (sessionCode.length !== 6) throw new Error('Session code must be 6 digits');

    // 5. Check session by PIN code (Participant view)
    console.log('\n5️⃣ Verifying Session Code /api/sessions/code/' + sessionCode + '...');
    const checkRes = await request('GET', `/api/sessions/code/${sessionCode}`);
    console.log('   Presentation Title:', checkRes.body.presentationTitle);
    console.log('   Current Slide:', checkRes.body.currentSlide.title);
    if (checkRes.status !== 200) throw new Error('Session code verification failed');

    // 6. Realtime Socket.IO Connection (Presenter and Student)
    console.log('\n6️⃣ Testing Realtime WebSockets Join & Vote...');
    const hostSocket = io(BASE_URL);
    const studentSocket = io(BASE_URL);

    await new Promise((resolve) => {
      let hostReady = false;
      let studentReady = false;

      hostSocket.on('connect', () => {
        hostSocket.emit('host_join', { sessionCode });
        hostReady = true;
        if (studentReady) resolve();
      });

      studentSocket.on('connect', () => {
        studentSocket.emit('join_session', {
          sessionCode,
          nickname: 'Priya (Roll 2026)',
          avatar: '⚡',
          participantId: 'student-test-1'
        });
      });

      hostSocket.on('participant_joined', (data) => {
        console.log('   Host received participant join event! Total Count:', data.totalCount);
        studentReady = true;
        if (hostReady) resolve();
      });
    });

    // 7. Student Submits a Response
    console.log('\n7️⃣ Testing Realtime Answer Submission & Scoring...');
    const currentSlide = checkRes.body.currentSlide;
    const firstOption = currentSlide.options[0];

    await new Promise((resolve, reject) => {
      hostSocket.on('response_received', (data) => {
        console.log('   Host received live response event!');
        console.log('   Total Slide Responses:', data.totalResponses);
        console.log('   Points Awarded:', data.latestResponse.pointsAwarded);
        resolve();
      });

      studentSocket.emit('submit_response', {
        sessionCode,
        participantId: 'student-test-1',
        slideId: currentSlide.id,
        responseData: {
          optionId: firstOption.id,
          nickname: 'Priya (Roll 2026)',
          responseTimeMs: 3200
        }
      });
    });

    // 8. Presenter changes slide
    console.log('\n8️⃣ Testing Presenter Slide Navigation...');
    await new Promise((resolve) => {
      studentSocket.on('slide_changed', (data) => {
        console.log('   Student received slide_changed event to slide index:', data.slideIndex);
        resolve();
      });

      hostSocket.emit('change_slide', {
        sessionCode,
        slideIndex: 1
      });
    });

    // 9. Send Reaction
    console.log('\n9️⃣ Testing Live Floating Reactions...');
    await new Promise((resolve) => {
      hostSocket.on('reaction_received', (data) => {
        console.log('   Host received floating reaction on screen:', data.reaction);
        resolve();
      });

      studentSocket.emit('send_reaction', {
        sessionCode,
        reaction: '🚀'
      });
    });

    // 10. End Session & Check Report
    console.log('\n🔟 Ending Live Session & Generating Analytics Report...');
    const endRes = await request('POST', `/api/sessions/${session.id}/end`, {});
    console.log('   Session status:', endRes.body.session.status);

    const reportRes = await request('GET', `/api/reports/${session.id}`);
    console.log('   Report Total Participants:', reportRes.body.totalParticipants);
    console.log('   Question Breakdowns count:', reportRes.body.slideAnalytics.length);

    const csvExport = await request('GET', `/api/reports/${session.id}/export`);
    console.log('   CSV Export Header:', csvExport.body.split('\n')[0]);

    hostSocket.disconnect();
    studentSocket.disconnect();

    console.log('\n✅ ALL 10 TEST SUITES PASSED FLAWLESSLY!');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Test failed:', err);
    process.exit(1);
  }
}

// Run test against running server
runTests();
