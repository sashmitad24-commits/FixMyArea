import { useCallback, useEffect, useMemo, useState } from 'react';
import AuthContext from './AuthContextValue';
import authService from '../services/authService';
import { setAccessToken } from '../services/accessToken';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;
    authService
      .refresh()
      .then((session) => {
        if (active) {
          setAccessToken(session.accessToken);
          setUser(session.user);
        }
      })
      .catch(() => {
        if (active) {
          clearSession();
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    const handleExpiredSession = () => clearSession();
    window.addEventListener('auth:expired', handleExpiredSession);
    return () => {
      active = false;
      window.removeEventListener('auth:expired', handleExpiredSession);
    };
  }, [clearSession]);

  const value = useMemo(
    () => {
      const signIn = (session) => {
        setAccessToken(session.accessToken);
        setUser(session.user);
      };

      const signOut = async () => {
        try {
          await authService.logout();
          clearSession();
          return true;
        } catch {
          clearSession();
          return false;
        }
      };

      return {
        user,
        loading,
        signIn,
        signOut,
      };
    },
    [user, loading, clearSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
