import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AcademicCapIcon, UserIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../auth/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur sticky top-0 z-40 border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-md">
            <AcademicCapIcon className="w-5 h-5" aria-hidden="true" />
            <span className="sr-only">CampusNet</span>
          </div>
          <div className="hidden sm:block">
            <div className="font-semibold text-lg">CampusNet</div>
            <div className="text-xs text-slate-500">Community resources & chat</div>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/resources" className="text-sm text-slate-700 hover:text-slate-900">Resources</Link>
          <Link to="/dashboard" className="text-sm text-slate-700 hover:text-slate-900">Dashboard</Link>
          <Link to="/wifi" className="text-sm text-slate-700 hover:text-slate-900">WiFi</Link>
          {user ? (
            <div className="relative">
              <UserMenu user={user} logout={logout} />
            </div>
          ) : (
            <Link to="/login" className="btn btn-sm btn-primary">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function UserMenu({ user, logout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const initial = (user?.username || user?.email || '').trim()[0]?.toUpperCase() || null;

  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleLogoutClick() {
    // open in-app confirmation modal instead of browser confirm()
    setConfirmOpen(true);
  }

  function confirmLogout() {
    setConfirmOpen(false);
    setOpen(false);
    logout();
  }

  function cancelLogout() {
    setConfirmOpen(false);
  }

  return (
    <div ref={ref} className="flex items-center">
      <button
        type="button"
        aria-label="User menu"
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-md"
      >
        {initial ? (
          <span className="uppercase">{initial}</span>
        ) : (
          <UserIcon className="w-5 h-5" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
          <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Profile</Link>
          <button onClick={handleLogoutClick} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50">Logout</button>
        </div>
      )}

      {/* Confirmation modal */}
      {confirmOpen && typeof document !== 'undefined' ? createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
          <div role="dialog" aria-modal="true" className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-5">
            <div className="text-lg font-semibold">Confirm logout</div>
            <div className="mt-2 text-sm text-slate-600">Are you sure you want to log out?</div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={cancelLogout} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">No</button>
              <button onClick={confirmLogout} className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700">Yes</button>
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </div>
  );
}
