import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PresentationsPage } from './pages/PresentationsPage';
import { EditorPage } from './pages/EditorPage';
import { PresentationModePage } from './pages/PresentationModePage';
import { JoinPage } from './pages/JoinPage';
import { ParticipantSessionPage } from './pages/ParticipantSessionPage';
import { ReportsPage } from './pages/ReportsPage';
import { SessionReportPage } from './pages/SessionReportPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { AdminPage } from './pages/AdminPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/presentations" element={<PresentationsPage />} />
          <Route path="/editor/:id" element={<EditorPage />} />
          <Route path="/present/:id" element={<PresentationModePage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/session/:code" element={<ParticipantSessionPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/:sessionId" element={<SessionReportPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

