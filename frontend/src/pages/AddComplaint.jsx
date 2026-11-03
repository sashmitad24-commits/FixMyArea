import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import complaintService from '../services/complaintService';

const initialForm = {
  title: '',
  category: 'Roads',
  location: '',
  description: '',
  priority: 'Medium',
  reporterName: '',
  contact: '',
};

const categories = ['Roads', 'Water Supply', 'Street Lights', 'Garbage', 'Drainage', 'Public Safety'];
const priorities = ['Low', 'Medium', 'High', 'Critical'];

function AddComplaint() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback('');

    try {
      await complaintService.createComplaint(formData);
      setFeedback('Complaint submitted successfully.');
      setFormData(initialForm);
      setTimeout(() => navigate('/complaints'), 900);
    } catch (error) {
      setFeedback('Something went wrong. Please check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="py-3">
        <div>
          <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700">Report an issue</span>
          <h1 className="mb-0 mt-3 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Submit a complaint</h1>
        </div>
      </section>

      <form className="max-w-4xl space-y-5 rounded-3xl border border-slate-200/80 bg-white/85 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900 sm:p-8" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Issue title
            <input
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-blue-950"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Broken streetlight near bus stop"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Category
            <select className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-950" name="category" value={formData.category} onChange={handleChange}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Location
            <input
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-blue-950"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ward 12, Market Road"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Priority
            <select className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-950" name="priority" value={formData.priority} onChange={handleChange}>
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Reporter name
            <input
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-blue-950"
              type="text"
              name="reporterName"
              value={formData.reporterName}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Contact details
            <input
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-blue-950"
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Phone or email"
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Description
          <textarea
            className="min-h-36 resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-blue-950"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            placeholder="Explain the issue, its effect on the community, and any urgency details."
            required
          />
        </label>

        {feedback && <div className={`rounded-xl border px-4 py-3 text-sm ${feedback.includes('success') ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200'}`} role="status">{feedback}</div>}

        <button type="submit" className="rounded-xl bg-gradient-to-r from-blue-700 to-sky-500 px-5 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit complaint'}
        </button>
      </form>
    </div>
  );
}

export default AddComplaint;
