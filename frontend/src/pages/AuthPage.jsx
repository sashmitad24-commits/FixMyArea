import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import authService from '../services/authService';
import ThemeToggle from '../components/ThemeToggle';

function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState('user');
  const [form, setForm] = useState({ name: '', email: '', password: '', adminKey: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const session = isRegister
        ? await authService.register({ ...form, role })
        : await authService.login({ email: form.email, password: form.password });
      signIn(session);
      navigate(location.state?.from || (session.user.role === 'admin' ? '/complaints' : '/'), {
        replace: true,
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Could not connect to the server. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-blue-950';

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <img
        src="/neighborhood-hero.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/75 to-blue-950/70" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/15 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden flex-col justify-between bg-gradient-to-br from-blue-950 to-slate-950 p-10 text-white lg:flex">
          <Link to="/" className="flex items-center gap-3 font-bold text-white no-underline">
            <img src="/fix-my-area-logo.svg" alt="" className="size-11" />
            Fix My Area
          </Link>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">Community action hub</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight">
              Better neighbourhoods begin with people who care.
            </h1>
            <p className="mt-4 leading-7 text-slate-300">
              Sign in to report local issues, follow progress, and help your community thrive.
            </p>
          </div>
          <p className="m-0 text-sm text-slate-400">Small reports. Big change.</p>
        </section>

        <section className="p-6 sm:p-10">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="text-sm font-bold text-blue-700 no-underline hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200">
              ← Back to home
            </Link>
            <ThemeToggle />
          </div>
          <div className="mt-8">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">
              {isRegister ? 'Join your community' : 'Welcome back'}
            </span>
            <h2 className="mb-0 mt-2 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              {isRegister ? 'Create your account' : 'Sign in to Fix My Area'}
            </h2>
            <p className="mb-0 mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {isRegister
                ? 'Choose an account type to get started.'
                : 'Use your email and password to continue.'}
            </p>
          </div>

          {isRegister && (
            <div className="mt-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              {[
                { value: 'user', label: 'Resident' },
                { value: 'admin', label: 'Administrator' },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`rounded-lg px-3 py-2.5 text-sm font-bold transition ${
                    role === item.value
                      ? 'bg-white text-blue-800 shadow-sm dark:bg-slate-700 dark:text-blue-200'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                  }`}
                  onClick={() => setRole(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {isRegister && (
              <label className="block space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Full name
                <input
                  className={inputClass}
                  type="text"
                  name="name"
                  autoComplete="name"
                  minLength="2"
                  maxLength="100"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </label>
            )}

            <label className="block space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Email address
              <input
                className={inputClass}
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="block space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Password
              <input
                className={inputClass}
                type="password"
                name="password"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                minLength="8"
                maxLength="72"
                value={form.password}
                onChange={handleChange}
                placeholder={isRegister ? 'At least 8 characters' : 'Your password'}
                required
              />
            </label>

            {isRegister && role === 'admin' && (
              <label className="block space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Admin invite key
                <input
                  className={inputClass}
                  type="password"
                  name="adminKey"
                  autoComplete="off"
                  value={form.adminKey}
                  onChange={handleChange}
                  placeholder="Provided by your system owner"
                  required
                />
                <span className="block text-xs font-normal leading-5 text-slate-500 dark:text-slate-400">
                  Admin accounts require an invite key configured by the server owner.
                </span>
              </label>
            )}

            {error && (
              <p className="m-0 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200" role="alert">
                {error}
              </p>
            )}

            <button
              className="w-full rounded-xl bg-blue-700 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <p className="mb-0 mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {isRegister ? 'Already have an account?' : 'New to Fix My Area?'}{' '}
            <Link
              className="font-bold text-blue-700 hover:text-blue-900"
              to={isRegister ? '/login' : '/register'}
            >
              {isRegister ? 'Sign in' : 'Create an account'}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default AuthPage;
