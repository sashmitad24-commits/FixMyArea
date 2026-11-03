import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import NotificationBell from './NotificationBell';
import { useAuth } from '../context/useAuth';
import ThemeToggle from './ThemeToggle';

function Navbar() {
  const { user, signOut } = useAuth();
  const [logoutError, setLogoutError] = useState(false);
  const navItems = [
    { label: 'Home', to: '/' },
    ...(user ? [{ label: 'Dashboard', to: '/dashboard' }] : []),
    { label: 'Complaints', to: '/complaints' },
    { label: 'Report Issue', to: '/add-complaint' },
  ];

  return (
    <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 bg-white/70 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85 sm:px-6 lg:px-8">
      <Link to="/" className="flex shrink-0 items-center gap-3 no-underline">
        <img src="/fix-my-area-logo.svg" alt="" className="size-11 drop-shadow-sm" />
        <span className="hidden sm:block">
          <span className="block text-sm font-extrabold tracking-tight text-slate-950 dark:text-white">Fix My Area</span>
          <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">Community Action Hub</span>
        </span>
      </Link>

      <nav className="flex flex-wrap items-center gap-1" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `rounded-full px-3 py-2 text-sm font-semibold transition-colors sm:px-4 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <NotificationBell />
        {user ? (
          <>
            <span className="hidden text-right sm:block">
              <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">{user.name}</span>
              <span className="block text-xs capitalize text-slate-500 dark:text-slate-400">{user.role}</span>
            </span>
            <button
              type="button"
              onClick={async () => {
                setLogoutError(!(await signOut()));
              }}
              className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              Sign in
            </Link>
            <Link to="/register" className="rounded-full bg-blue-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-800">
              Create account
            </Link>
          </>
        )}
      </div>
      {logoutError && (
        <p className="w-full text-right text-xs text-red-600 dark:text-red-300" role="status">
          You were signed out locally, but the server could not confirm token revocation.
        </p>
      )}
    </header>
  );
}

export default Navbar;
