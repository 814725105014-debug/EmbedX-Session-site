-- ====================================================================
-- EMBEDX INTERACTIVE - DATABASE SCHEMA MIGRATION
-- Mentimeter-Inspired Live Engagement Platform
-- Embedded Systems & Automation Club, SRM TRP Engineering College
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('super_admin', 'club_admin', 'presenter', 'participant');
CREATE TYPE question_type AS ENUM (
  'multiple_choice',
  'word_cloud',
  'quiz',
  'open_ended',
  'qa',
  'rating_scale',
  'ranking',
  'true_false',
  'survey'
);
CREATE TYPE session_status AS ENUM ('draft', 'active', 'paused', 'completed');

-- 3. PROFILES TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'presenter' NOT NULL,
  department TEXT DEFAULT 'Electrical and Electronics Engineering',
  college TEXT DEFAULT 'SRM TRP Engineering College',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRESENTATIONS TABLE
CREATE TABLE IF NOT EXISTS presentations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  theme TEXT DEFAULT 'cyber_dark',
  is_template BOOLEAN DEFAULT FALSE,
  category TEXT DEFAULT 'Technical',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SLIDES TABLE
CREATE TABLE IF NOT EXISTS slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  presentation_id UUID REFERENCES presentations(id) ON DELETE CASCADE NOT NULL,
  order_index INTEGER NOT NULL,
  type question_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  background_url TEXT,
  timer_seconds INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slide_id UUID REFERENCES slides(id) ON DELETE CASCADE NOT NULL,
  prompt TEXT NOT NULL,
  instructions TEXT,
  allow_multiple_answers BOOLEAN DEFAULT FALSE,
  points INTEGER DEFAULT 1000,
  speed_bonus BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ANSWER_OPTIONS TABLE
CREATE TABLE IF NOT EXISTS answer_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slide_id UUID REFERENCES slides(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  order_index INTEGER NOT NULL,
  color_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SESSIONS TABLE (Live presentation sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  presentation_id UUID REFERENCES presentations(id) ON DELETE CASCADE NOT NULL,
  host_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  session_code VARCHAR(6) UNIQUE NOT NULL,
  status session_status DEFAULT 'draft' NOT NULL,
  current_slide_id UUID REFERENCES slides(id),
  voting_locked BOOLEAN DEFAULT FALSE,
  show_results BOOLEAN DEFAULT TRUE,
  quiz_timer_active BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PARTICIPANTS TABLE
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  session_code VARCHAR(6) NOT NULL,
  nickname TEXT NOT NULL,
  avatar TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  total_score INTEGER DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. RESPONSES TABLE
CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  slide_id UUID REFERENCES slides(id) ON DELETE CASCADE NOT NULL,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES answer_options(id) ON DELETE SET NULL,
  text_response TEXT,
  rating_value INTEGER,
  ranked_order JSONB,
  response_time_ms INTEGER,
  is_correct BOOLEAN,
  points_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. QUIZ_SCORES TABLE
CREATE TABLE IF NOT EXISTS quiz_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE NOT NULL,
  total_points INTEGER DEFAULT 0 NOT NULL,
  correct_count INTEGER DEFAULT 0 NOT NULL,
  total_time_ms INTEGER DEFAULT 0 NOT NULL,
  rank INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PARTICIPANT_QUESTIONS TABLE (Q&A feature)
CREATE TABLE IF NOT EXISTS participant_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  upvotes_count INTEGER DEFAULT 0 NOT NULL,
  is_answered BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. QUESTION_VOTES TABLE (Audience upvotes on Q&A)
CREATE TABLE IF NOT EXISTS question_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES participant_questions(id) ON DELETE CASCADE NOT NULL,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(question_id, participant_id)
);

-- 14. TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  cover_image TEXT,
  slides_data JSONB NOT NULL,
  created_by TEXT DEFAULT 'EMBEDX Core Team',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. INDEXES FOR HIGH-THROUGHPUT REAL-TIME ACCESS
CREATE INDEX IF NOT EXISTS idx_sessions_code ON sessions(session_code);
CREATE INDEX IF NOT EXISTS idx_slides_presentation ON slides(presentation_id, order_index);
CREATE INDEX IF NOT EXISTS idx_responses_session_slide ON responses(session_id, slide_id);
CREATE INDEX IF NOT EXISTS idx_participants_session ON participants(session_id);
CREATE INDEX IF NOT EXISTS idx_participant_questions_session ON participant_questions(session_id);

-- 16. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE participant_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Allow public read on templates
CREATE POLICY "Public templates are viewable by everyone" ON templates
  FOR SELECT USING (true);

-- Allow participants to read active session metadata without auth
CREATE POLICY "Public can view active sessions by code" ON sessions
  FOR SELECT USING (true);

-- Allow public to join session and insert participant
CREATE POLICY "Participants can insert themselves" ON participants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Participants can view their session participants" ON participants
  FOR SELECT USING (true);

-- Allow participants to submit responses
CREATE POLICY "Participants can insert responses" ON responses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Responses viewable by session presenter and public aggregation" ON responses
  FOR SELECT USING (true);

-- Allow Q&A questions submission & upvoting
CREATE POLICY "Participants can ask questions" ON participant_questions
  FOR ALL USING (true);

CREATE POLICY "Participants can vote on questions" ON question_votes
  FOR ALL USING (true);

-- Presenter policies (authenticated profiles)
CREATE POLICY "Presenters can manage own presentations" ON presentations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Presenters can manage slides" ON slides
  FOR ALL USING (EXISTS (
    SELECT 1 FROM presentations
    WHERE presentations.id = slides.presentation_id
    AND presentations.user_id = auth.uid()
  ));

CREATE POLICY "Presenters can manage options" ON answer_options
  FOR ALL USING (EXISTS (
    SELECT 1 FROM slides
    JOIN presentations ON presentations.id = slides.presentation_id
    WHERE slides.id = answer_options.slide_id
    AND presentations.user_id = auth.uid()
  ));

