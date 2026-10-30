# ⚡ EMBEDX INTERACTIVE
### Mentimeter-Inspired Live Audience Engagement Platform
**EMBEDX – Embedded Systems & Automation Club**  
Department of Electrical and Electronics Engineering  
**SRM TRP Engineering College**, Tiruchirappalli, Tamil Nadu  
Existing Club Website: [https://embedx.neocities.org/](https://embedx.neocities.org/)

---

## 🎯 Platform Overview

**EMBEDX Interactive** is a production-grade, real-time live audience engagement SaaS platform custom-engineered for engineering college technical workshops, hackathons, seminars, symposiums (such as **EMBEDNOVA**), and club orientation programs.

Inspired by industry leaders like Mentimeter, it provides a seamless live engagement experience where club coordinators and faculty can present interactive slides, and students can join instantly from their smartphones using a 6-digit session PIN or QR code—**with zero account registration or app downloads required**.

---

## 🚀 Key Features

### 1. 9 Rich Question & Slide Types
- **Multiple Choice Polls**: 2 to 8 customizable options with animated bar charts, percentage breakdowns, and instant vote count.
- **Dynamic Word Clouds**: Participants submit keywords or short phrases; popular terms dynamically scale and animate in real time.
- **Quiz Competitions**: High-stakes timed quizzes with speed-based bonus scoring, real-time rank shifts, top-3 winner podiums, and victory confetti.
- **Audience Live Q&A**: Students ask questions from their phones during guest lectures and upvote peer inquiries, with presenter moderation (Pin / Mark Answered / Delete).
- **Open-Ended Brainstorms**: Free-form idea collection rendered in a responsive, modern card wall.
- **Rating Scales**: 1–5 stars or 1–10 scale slider inputs with real-time average calculation and distribution curves.
- **Community Ranking**: Participants drag and rank preferences; aggregated using the **Borda Count** algorithm.
- **True or False**: Rapid binary knowledge check with instant correctness statistics.
- **Feedback Surveys**: Multi-aspect surveys for post-event sentiment analysis and club review.

### 2. Live Full-Screen Presentation Mode (`/present/:id`)
- Generates a unique, high-entropy **6-digit session PIN** (e.g. `583 291`).
- Displays a high-contrast **QR code modal** (`qrcode.react`) and direct URL instructions.
- Real-time participant counter with active connection heartbeat.
- Presenter toolbar with keyboard shortcuts:
  - `→` / `Space`: Next slide
  - `←`: Previous slide
  - `L`: Lock / unlock voting
  - `R`: Show / hide results
  - `F`: Toggle full screen
  - `Q`: Toggle QR code modal
  - `M`: Mute / unmute audio effects
- **Procedural Sound Synthesizer**: Web Audio API generated sound FX (vote chime, countdown ticks, buzzer, trumpet fanfare) with zero external audio assets.
- **Floating Emoji Reactions**: Mobile participants tap ❤️, 👍, 💡, 🔥, 🚀 to float live animated particles across the projector screen.

### 3. Participant Experience (`/join` & `/session/:code`)
- Mobile-first, responsive interface.
- 6-digit numeric input with automatic chunking.
- Avatar and nickname selector (🤖, ⚡, 🚀, 💻, 🔬, 🎯, 🛠️, 💡).
- Real-time WebSocket synchronization with presenter's slides.
- Instant submission confirmations and duplicate voting prevention.

### 4. 10 Pre-Loaded Club Technical Templates
1. **Embedded Systems Knowledge Quiz** (Harvard vs. Von Neumann, Watchdog timers, I2C vs. SPI)
2. **Electronics Fundamentals & Circuitry** (NTC thermistors, Op-Amp golden rules, parallel resistance)
3. **Microcontroller & Architecture Challenge** (8051, AVR ATmega328P, STM32 ARM Cortex-M, PIC)
4. **Arduino & ESP32 IoT Live Poll** (MQTT protocol, FreeRTOS dual-core multitasking)
5. **Robotics & Autonomous Rovers Challenge** (H-Bridge motor drivers, PID line-follower tuning)
6. **EMBEDX Workshop Hands-on Feedback** (Hardware debugging, peer mentoring, future topic suggestions)
7. **EMBEDNOVA National Symposium Engagement** (Competition track distribution, chief guest Q&A)
8. **EEE Department Technical Orientation** (Engineering curiosity poll, domain prioritization)
9. **IoT & Smart Automation Awareness Poll** (Zigbee/Matter wireless mesh, campus automation needs)
10. **Hardware Circuit Debugging Competition** (Oscilloscope 10X attenuation, multimeter safety rules)

### 5. Post-Event Reports & Exporting (`/reports` & `/reports/:sessionId`)
- Detailed question-by-question response breakdown.
- Participation rate and engagement percentages.
- Final quiz leaderboard rankings.
- Direct **CSV export** for spreadsheet processing.
- Clean **Print / PDF layout** for official club records.

### 6. User Roles & Access Control
- **Super Admin**: Department faculty advisors with platform oversight, active broadcast termination, and user role management.
- **Club Admin**: EMBEDX student leads managing presentations, templates, and event schedules.
- **Presenter / Coordinator**: Club members hosting interactive sessions.
- **Participant**: Student attendees joining anonymously via 6-digit PIN.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti |
| **Realtime Engine** | Socket.IO (WebSockets with polling fallback), Express.js |
| **Persistence** | File-backed ACID store (`server/db.json`) + Supabase SQL schema (`supabase/migrations/001_initial_schema.sql`) |
| **Audio** | Procedural Web Audio API sound synthesis |
| **QR Code** | `qrcode.react` vector SVG renderer |

---

## 📂 Route Directory

| Route | Description |
|---|---|
| `/` | Modern SaaS Landing Page with hero, live poll demo, and feature showcases |
| `/login` | Authentication & fast 1-click role switcher |
| `/dashboard` | Presenter dashboard with stats, recent presentations, and quick actions |
| `/presentations` | Complete presentation library with search and category filtering |
| `/editor/:id` | Drag-and-drop presentation editor with live preview and settings panel |
| `/present/:id` | Fullscreen projector presentation mode with live controls and QR code |
| `/join` | Clean, mobile-friendly 6-digit PIN and nickname entry |
| `/session/:code` | Mobile live interaction interface for students |
| `/reports` | Session reports library |
| `/reports/:sessionId` | Detailed analytics breakdown with CSV & Print/PDF export |
| `/templates` | 10 ready-to-use technical templates |
| `/admin` | Administration dashboard and moderation controls |

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### 1. Installation
```bash
npm install
```

### 2. Run in Development Mode
Starts the backend Socket.IO engine on port 3001 and the Vite frontend on port 5173 with proxy:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build & Unified Server
Builds the optimized React bundle and serves both frontend and backend through a single unified Express server:
```bash
npm run build
npm start
```
Access the application at [http://localhost:3001](http://localhost:3001).

### 4. Run Automated End-to-End Test Suite
Validates health, template cloning, live session initiation, WebSocket connections, participant voting, slide transitions, emoji reactions, and report generation:
```bash
npm run test:e2e
```

---

## 🗄️ Supabase Cloud Integration (Optional)

The application includes a production-grade database migration file:
`supabase/migrations/001_initial_schema.sql`

To connect to Supabase Cloud:
1. Create a project at [supabase.com](https://supabase.com).
2. Execute `supabase/migrations/001_initial_schema.sql` in the Supabase SQL Editor.
3. Copy `.env.example` to `.env` and fill in:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. When configured, EMBEDX Interactive will automatically synchronize presentations and sessions with Supabase.

---

## 🏫 Institutional Metadata

- **Organization**: EMBEDX – Embedded Systems & Automation Club
- **Department**: Department of Electrical and Electronics Engineering
- **Institution**: SRM TRP Engineering College, Tiruchirappalli, Tamil Nadu
- **Annual Flagship Event**: EMBEDNOVA National Symposium
- **Existing Website**: [https://embedx.neocities.org/](https://embedx.neocities.org/)

