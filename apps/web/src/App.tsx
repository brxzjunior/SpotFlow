import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from './layouts/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { OverviewPage } from './pages/OverviewPage';
import { StudioPage } from './pages/StudioPage';
import { LibraryPage } from './pages/LibraryPage';
import { AutomationsPage } from './pages/AutomationsPage';
import { AutomationDetailsPage } from './pages/AutomationDetailsPage';
import { InsightsPage } from './pages/InsightsPage';
import { CopilotPage } from './pages/CopilotPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Rota pública inicial */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* Área logada com Layout Unificado */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="studio" element={<StudioPage />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="automations" element={<AutomationsPage />} />
            <Route path="automations/:id" element={<AutomationDetailsPage />} />
            <Route path="insights" element={<InsightsPage />} />
            <Route path="copilot" element={<CopilotPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Rota de fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
