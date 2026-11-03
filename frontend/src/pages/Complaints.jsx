import { useEffect, useMemo, useState } from 'react';
import ComplaintCard from '../components/ComplaintCard';
import complaintService from '../services/complaintService';
import { useAuth } from '../context/useAuth';

function Complaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintService.getComplaints();
      setComplaints(data || []);
      setError('');
    } catch (err) {
      setError('Unable to load complaints right now. Please try again later.');
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (complaint, nextStatus) => {
    try {
      const response = await complaintService.updateComplaint(complaint._id, {
        ...complaint,
        status: nextStatus,
      });

      setComplaints((current) =>
        current.map((item) =>
          item._id === complaint._id ? { ...item, status: response.status || nextStatus } : item,
        ),
      );
    } catch (err) {
      setError('Unable to update the complaint status. Please try again.');
    }
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesQuery =
        !search ||
        [complaint.title, complaint.location, complaint.category, complaint.reporterName, complaint.description]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'All' || complaint.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || complaint.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'All' || complaint.category === categoryFilter;

      return matchesQuery && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [complaints, search, statusFilter, priorityFilter, categoryFilter]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="space-y-5">
      <section className="flex flex-col justify-between gap-4 py-3 sm:flex-row sm:items-center">
        <div>
          <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700">Community reports</span>
          <h1 className="mb-0 mt-3 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Latest complaints</h1>
        </div>
        <button type="button" className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-800" onClick={fetchComplaints}>
          Refresh list
        </button>
      </section>

      <div className="grid gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr]">
        <input
          className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-blue-950"
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search complaints, locations, reporters..."
        />

        <select className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-950" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="All">All statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <select className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-950" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
          <option value="All">All priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>

        <select className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-950" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
          <option value="All">All categories</option>
          {Array.from(new Set(complaints.map((item) => item.category))).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200" role="alert">{error}</div>}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">Loading complaints...</div>
      ) : filteredComplaints.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="m-0 text-lg font-bold text-slate-900 dark:text-white">No complaints match your filters</h3>
          <p className="mb-0 mt-2 text-slate-500 dark:text-slate-400">Try adjusting the search or category selection.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint._id || complaint.id}
              complaint={complaint}
              onStatusUpdate={user?.role === 'admin' ? handleStatusUpdate : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Complaints;
