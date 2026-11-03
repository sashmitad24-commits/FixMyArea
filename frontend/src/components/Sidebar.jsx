import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const menuItems = [
  { label: 'Dashboard', to: '/dashboard', icon: '🏠' },
  { label: 'Complaints', to: '/complaints', icon: '📋' },
  { label: 'Report Issue', to: '/add-complaint', icon: '➕' },
];

function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="shrink-0 border-b border-slate-700 bg-slate-950 px-4 py-4 text-slate-200 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:px-5 md:py-6">
      <div className="flex items-center gap-3 border-b border-slate-800 px-2 pb-5">
        <img src="/fix-my-area-logo.svg" alt="" className="size-11 shrink-0 drop-shadow-lg" />
        <div>
          <p className="m-0 font-bold text-white">Fix My Area</p>
          <span className="text-xs text-slate-400">Community dashboard</span>
        </div>
      </div>

      <nav className="mt-5 flex flex-row gap-2 overflow-x-auto md:flex-col" aria-label="Sidebar navigation">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-blue-500/15 text-white ring-1 ring-blue-400/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      {user ? (
        <div className="mt-8 hidden rounded-2xl border border-slate-800 bg-slate-900 p-4 text-xs leading-5 text-slate-400 md:block">
          <p className="mb-1 font-semibold text-slate-200">Signed in as {user.role}</p>
          {user.role === 'admin'
            ? 'You can review and update community reports.'
            : 'Report local issues and follow the progress.'}
        </div>
      ) : (
        <div className="mt-8 hidden rounded-2xl border border-slate-800 bg-slate-900 p-4 text-xs leading-5 text-slate-400 md:block">
          <p className="mb-2 font-semibold text-slate-200">Join your community</p>
          Sign in to report issues and track progress.
          <Link to="/login" className="mt-3 block font-bold text-blue-300 hover:text-white">Sign in →</Link>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
