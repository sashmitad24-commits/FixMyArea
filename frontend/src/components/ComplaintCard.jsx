import { useState } from 'react';

const statusStyles = {
  Open: 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-amber-100 text-amber-800',
  Resolved: 'bg-emerald-100 text-emerald-800',
  Closed: 'bg-slate-200 text-slate-700',
};

const priorityStyles = {
  Low: 'bg-slate-100 text-slate-700',
  Medium: 'bg-amber-100 text-amber-800',
  High: 'bg-orange-100 text-orange-800',
  Critical: 'bg-red-100 text-red-800',
};

const availableStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

function ComplaintCard({ complaint, onStatusUpdate }) {
  const { ticketId, title, category, location, description, status, priority, reporterName, contact } = complaint;
  const [selectedStatus, setSelectedStatus] = useState(status);

  const handleUpdate = async () => {
    if (!onStatusUpdate || selectedStatus === status) {
      return;
    }

    await onStatusUpdate(complaint, selectedStatus);
  };

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-700">{category}</p>
          <h3 className="m-0 text-lg font-bold leading-snug text-slate-900 dark:text-white">{title}</h3>
          {ticketId && <p className="mb-0 mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Ticket {ticketId}</p>}
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${statusStyles[status] || 'bg-slate-100 text-slate-700'}`}>{status}</span>
      </div>

      <p className="my-3 font-semibold text-slate-700 dark:text-slate-300">📍 {location}</p>
      <p className="leading-7 text-slate-600 dark:text-slate-400">{description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${priorityStyles[priority] || 'bg-slate-100 text-slate-700'}`}>{priority}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">Reported by {reporterName}</span>
      </div>

      {contact && <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Contact: {contact}</p>}

      {onStatusUpdate && (
        <div className="mt-4 grid grid-cols-1 items-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:grid-cols-[1fr_auto]">
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Update status
            <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-950" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
              {availableStatuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <button type="button" className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-800 transition hover:bg-blue-50 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-blue-950 dark:hover:text-blue-200" onClick={handleUpdate}>
            Save
          </button>
        </div>
      )}
    </article>
  );
}

export default ComplaintCard;
