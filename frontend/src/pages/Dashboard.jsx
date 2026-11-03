import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import complaintService from '../services/complaintService';
import { useAuth } from '../context/useAuth';

function Dashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const timerId = window.setTimeout(async () => {
      try {
        const data = await complaintService.getComplaints();
        if (active) {
          setComplaints(data);
          setError('');
        }
      } catch {
        if (active) {
          setError('Could not load the latest community activity.');
        }
      }
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timerId);
    };
  }, []);

  const openCount = complaints.filter((item) => item.status === 'Open').length;
  const inProgressCount = complaints.filter((item) => item.status === 'In Progress').length;
  const resolvedCount = complaints.filter((item) => item.status === 'Resolved' || item.status === 'Closed').length;

  const stats = [
    { label: 'Total reports', value: complaints.length, icon: '▤', color: 'bg-blue-100 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300' },
    { label: 'Awaiting action', value: openCount, icon: '◷', color: 'bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300' },
    { label: 'In progress', value: inProgressCount, icon: '↗', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300' },
    { label: 'Resolved', value: resolvedCount, icon: '✓', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300' },
  ];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 p-7 text-white shadow-xl sm:p-10">
        <p className="m-0 text-xs font-bold uppercase tracking-[0.18em] text-sky-300">Community dashboard</p>
        <h1 className="mb-0 mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Welcome back, {user?.name?.split(' ')[0] || 'neighbour'}.
        </h1>
        <p className="mb-0 mt-3 max-w-2xl leading-7 text-blue-100">
          Here’s the latest view of issues raised in your community. Every report brings a better neighbourhood closer.
        </p>
        <Link
          to="/add-complaint"
          className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 font-bold text-blue-950 transition hover:bg-sky-50"
        >
          Report an issue <span className="ml-2" aria-hidden="true">→</span>
        </Link>
      </section>

      {error && <p className="m-0 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200" role="alert">{error}</p>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Complaint statistics">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.label}</span>
              <span className={`grid size-10 place-items-center rounded-xl text-lg font-bold ${stat.color}`} aria-hidden="true">{stat.icon}</span>
            </div>
            <strong className="mt-4 block text-3xl font-extrabold text-slate-950 dark:text-white">{stat.value}</strong>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="m-0 text-xl font-bold text-slate-950 dark:text-white">Recent community reports</h2>
            <p className="mb-0 mt-1 text-sm text-slate-500 dark:text-slate-400">Latest issues reported by residents.</p>
          </div>
          <Link to="/complaints" className="text-sm font-bold text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200">View all reports →</Link>
        </div>

        {complaints.length === 0 && !error ? (
          <p className="mb-0 mt-6 text-sm text-slate-500 dark:text-slate-400">No community reports yet.</p>
        ) : (
          <div className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">
            {complaints.slice(0, 5).map((complaint) => (
              <div key={complaint._id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                <div>
                  <p className="m-0 font-semibold text-slate-900 dark:text-slate-100">{complaint.title}</p>
                  <p className="m-0 mt-1 text-sm text-slate-500 dark:text-slate-400">{complaint.category} · {complaint.location}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{complaint.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
