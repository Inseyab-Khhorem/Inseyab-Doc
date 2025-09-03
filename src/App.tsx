import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { AuthPage } from './pages/AuthPage';
import { OCRPage } from './pages/OCRPage';
import { DocGenPage } from './pages/DocGenPage';
import { RecordsPage } from './pages/RecordsPage';
import { AdminPage } from './pages/AdminPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#FEF3C7',
                color: '#92400E',
                border: '1px solid #F59E0B',
              },
            }}
          />
          
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<Navigate to="/ocr" replace />} />
            <Route
              path="/ocr"
              element={
                <Layout>
                  <OCRPage />
                </Layout>
              }
            />
            <Route
              path="/docgen"
              element={
                <Layout>
                  <DocGenPage />
                </Layout>
              }
            />
            <Route
              path="/records"
              element={
                <Layout>
                  <RecordsPage />
                </Layout>
              }
            />
            <Route
              path="/admin"
              element={
                <Layout>
                  <AdminPage />
                </Layout>
              }
            />
            <Route
              path="/settings"
              element={
                <Layout>
                  <SettingsPage />
                </Layout>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;