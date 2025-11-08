import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import Button from '../components/UI/Button';

export default function Login() {
  const { user, loading, error, login } = useAuth();
  const [fields, setFields] = useState({ id: '', password: '' });

  if (user) return <Navigate to="/resources" />;

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4">CampusNet</h1>
        <form onSubmit={e => { e.preventDefault(); login(fields); }} className="space-y-4">
          <input
            required
            placeholder="Student ID"
            value={fields.id}
            onChange={e => setFields(f => ({ ...f, id: e.target.value }))}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent"
          />
          <input
            required
            placeholder="Password"
            type="password"
            value={fields.password}
            onChange={e => setFields(f => ({ ...f, password: e.target.value }))}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-accent"
          />
          <div>
            <Button variant="primary" className="w-full" disabled={loading}>{loading ? 'Logging in…' : 'Login'}</Button>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
        </form>
        <div className="mt-4 text-sm text-slate-600">Don't have an account? <Link to="/register" className="text-accent hover:underline">Register</Link></div>
      </div>
    </div>
  );
}
