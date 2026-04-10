import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from './unAuth/LandingPage';
import Dashboard from './pages/Dashboard';
import VideoDetail from './pages/VideoDetail';
import Library from './pages/Library';
import Login from './pages/Login';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, refetchOnWindowFocus: false },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/library" element={<Library />} />
          <Route path="/app/video/:jobId" element={<VideoDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
