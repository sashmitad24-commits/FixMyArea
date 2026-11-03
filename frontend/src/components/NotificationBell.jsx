import { useCallback, useEffect, useRef, useState } from 'react';
import notificationService from '../services/notificationService';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const dropdownRef = useRef(null);
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const refreshNotifications = useCallback(async () => {
    try {
      setNotifications(await notificationService.getNotifications());
      setError('');
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          'Notifications are temporarily unavailable.',
      );
    }
  }, []);

  useEffect(() => {
    const initialFetchId = window.setTimeout(refreshNotifications, 0);
    const intervalId = window.setInterval(refreshNotifications, 30000);
    return () => {
      window.clearTimeout(initialFetchId);
      window.clearInterval(intervalId);
    };
  }, [refreshNotifications]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const refreshId = window.setTimeout(refreshNotifications, 0);
    return () => window.clearTimeout(refreshId);
  }, [isOpen, refreshNotifications]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleMarkRead = async (notification) => {
    if (notification.read) {
      return;
    }

    try {
      const updated = await notificationService.markRead(notification._id);
      setNotifications((current) =>
        current.map((item) => (item._id === updated._id ? updated : item)),
      );
    } catch {
      setError('Could not mark this notification as read.');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((current) => current.map((item) => ({ ...item, read: true })));
      setError('');
    } catch {
      setError('Could not mark notifications as read.');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="relative grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-xl text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span aria-hidden="true">🔔</span>
        {unreadCount > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full border-2 border-white bg-red-500 px-1 text-center text-xs font-bold text-white">{unreadCount}</span>}
      </button>

      {isOpen && (
        <section className="absolute right-0 z-20 mt-3 max-h-[30rem] w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 dark:border-slate-700 dark:bg-slate-900" aria-label="Notifications">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-4 dark:border-slate-800">
            <div className="flex flex-col gap-1">
              <strong className="text-slate-900 dark:text-white">Notifications</strong>
              <span className="text-xs text-slate-500 dark:text-slate-400">{unreadCount} unread</span>
            </div>
            {unreadCount > 0 && (
              <button type="button" className="text-xs font-bold text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200" onClick={handleMarkAllRead}>
                Mark all read
              </button>
            )}
          </div>

          {error && <p className="m-0 p-4 text-sm text-red-700 dark:text-red-300" role="alert">{error}</p>}
          {notifications.length === 0 && !error ? (
            <p className="m-0 p-5 text-sm text-slate-500 dark:text-slate-400">You’re all caught up.</p>
          ) : (
            <ul className="m-0 max-h-[24rem] list-none overflow-y-auto p-0">
              {notifications.map((notification) => (
                <li key={notification._id}>
                  <button
                    type="button"
                    className={`grid w-full grid-cols-[8px_1fr] gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 ${
                      notification.read ? 'bg-white dark:bg-slate-900' : 'bg-blue-50 dark:bg-blue-950/60'
                    }`}
                    onClick={() => handleMarkRead(notification)}
                  >
                    <span className={`mt-1.5 size-2 rounded-full ${notification.read ? 'bg-transparent' : 'bg-blue-600'}`} aria-hidden="true" />
                    <span className="flex flex-col gap-1">
                      <strong className="text-sm text-slate-900 dark:text-slate-100">{notification.title}</strong>
                      <span className="text-sm leading-5 text-slate-600 dark:text-slate-300">{notification.message}</span>
                      <time className="text-xs text-slate-400 dark:text-slate-500" dateTime={notification.createdAt}>
                        {new Date(notification.createdAt).toLocaleString()}
                      </time>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

export default NotificationBell;
