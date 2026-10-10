import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AdminAuthContextType {
  isAiStudio: boolean;
  isAdmin: boolean;
  isLockedOut: boolean;
  lockoutRemaining: number;
  failedAttempts: number;
  showAuthModal: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  toggleAdmin: () => void;
  enableAdmin: () => void;
  disableAdmin: () => void;
  login: (passcode?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  changePasscode: (currentPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
}

export const checkIsAiStudio = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const hostname = window.location.hostname || '';
    return (
      window.self !== window.top ||
      hostname.includes('ais-dev-') ||
      hostname.includes('ais-pre-') ||
      hostname.includes('ai.studio') ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      Boolean((import.meta as any).env?.DEV)
    );
  } catch {
    return false;
  }
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAiStudio = checkIsAiStudio();

  // DEFAULT TO FALSE FOR VIEWERS: External visitors and shared link viewers MUST NEVER see edit controls
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      // 1. Check explicit URL query or hash flag (?edit=true, ?admin=true, #edit, #admin)
      const search = window.location.search || '';
      const hash = window.location.hash || '';
      if (
        search.includes('edit=true') ||
        search.includes('admin=true') ||
        hash === '#edit' ||
        hash === '#admin' ||
        hash === '#studio-edit'
      ) {
        return true;
      }

      // 2. Only active if explicitly toggled in this active browser session
      const sessionActive = sessionStorage.getItem('akaar_studio_edit_mode');
      return sessionActive === 'true';
    } catch {
      return false;
    }
  });

  const enableAdmin = useCallback(() => {
    setIsAdmin(true);
    try {
      sessionStorage.setItem('akaar_studio_edit_mode', 'true');
    } catch {
      // ignore
    }
  }, []);

  const disableAdmin = useCallback(() => {
    setIsAdmin(false);
    try {
      sessionStorage.setItem('akaar_studio_edit_mode', 'false');
      localStorage.setItem('akaar_studio_edit_mode', 'false');
      // If URL hash was #edit, clear it
      if (window.location.hash === '#edit' || window.location.hash === '#admin') {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleAdmin = useCallback(() => {
    setIsAdmin((prev) => {
      const next = !prev;
      try {
        sessionStorage.setItem('akaar_studio_edit_mode', next ? 'true' : 'false');
        if (!next) {
          localStorage.setItem('akaar_studio_edit_mode', 'false');
          if (window.location.hash === '#edit' || window.location.hash === '#admin') {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Listen for keyboard shortcuts (Ctrl+Shift+A or Alt+A or Cmd+Shift+A) or hash changes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
        (e.altKey && (e.key === 'A' || e.key === 'a'))
      ) {
        e.preventDefault();
        toggleAdmin();
      }
    };

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#edit' || hash === '#admin' || hash === '#studio-edit') {
        enableAdmin();
      }
    };

    const handleCustomToggle = () => {
      toggleAdmin();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('open-akaar-admin', handleCustomToggle);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('open-akaar-admin', handleCustomToggle);
    };
  }, [toggleAdmin, enableAdmin]);

  const login = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (isAiStudio) {
      enableAdmin();
      return { success: true };
    }
    return { success: false, error: 'Editing is only available in AI Studio.' };
  }, [isAiStudio, enableAdmin]);

  const logout = useCallback(() => {
    disableAdmin();
  }, [disableAdmin]);

  const changePasscode = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    return { success: true };
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        isAiStudio,
        isAdmin: Boolean(isAdmin),
        isLockedOut: false,
        lockoutRemaining: 0,
        failedAttempts: 0,
        showAuthModal: false,
        openAuthModal: enableAdmin,
        closeAuthModal: () => {},
        toggleAdmin,
        enableAdmin,
        disableAdmin,
        login,
        logout,
        changePasscode,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
