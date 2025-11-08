import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Resources from './pages/Resources';
import ResourceDetail from './pages/ResourceDetail';
import MyUploads from './pages/MyUploads';
import Upload from './pages/Upload';
import Comments from './components/Comments';
import Dashboard from './pages/Dashboard';
import Chat from './components/Chat';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// Header and Footer components provide the top navigation and footer.

function AppShell() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="container py-8 flex-1">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/chat/:category" element={user ? <Chat /> : <Navigate to="/login" />} />
          <Route path="/resources" element={user ? <Resources /> : <Navigate to="/login" />} />
          <Route path="/resource/:id" element={user ? <ResourceDetail /> : <Navigate to="/login" />} />
          <Route path="/upload" element={user ? <Upload /> : <Navigate to="/login" />} />
          <Route path="/myuploads" element={user ? <MyUploads /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/comments/:resourceId" element={user ? <Comments /> : <Navigate to="/login" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppShell />
      </Router>
    </AuthProvider>
  );
}
