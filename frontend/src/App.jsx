import { BrowserRouter, Navigate, Route, Routes, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Complaints from './pages/Complaints';
import AddComplaint from './pages/AddComplaint';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="border-b border-slate-200/80 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
        <Navbar />
      </div>
      <main className="w-full pb-12">
        <Outlet />
      </main>
    </div>
  );
}

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-900 transition-colors dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100 md:flex-row">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
            </Route>
            <Route element={<AppLayout />}>
              <Route path="/complaints" element={<Complaints />} />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/add-complaint"
                element={
                  <RequireAuth>
                    <AddComplaint />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
