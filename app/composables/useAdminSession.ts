import { ref, computed, onMounted, onUnmounted } from 'vue';

const STORAGE_LAST_ACTIVITY = 'cozmic_admin_last_activity';
const STORAGE_TIMEOUT_HOURS = 'cozmic_admin_timeout_hours';
const STORAGE_LOGOUT_EVENT = 'cozmic_admin_logout_signal';

export const useAdminSession = () => {
  const authUser = useState<any>('authUser');
  const router = useRouter();

  // Configured duration in hours (defaults to 2)
  const timeoutHours = useState<number>('adminSessionTimeoutHours', () => 2);
  const isSuperAdmin = computed(() => authUser.value?.role === 'SuperAdmin');

  // Inactivity tracking state
  const lastActivity = ref<number>(Date.now());
  const showWarning = ref<boolean>(false);
  const remainingSeconds = ref<number>(120);
  const isLoggingOut = ref<boolean>(false);

  let checkTimer: any = null;
  let throttleTimer: any = null;
  let isListening = false;

  const timeoutMs = computed(() => timeoutHours.value * 60 * 60 * 1000);

  // Record user activity
  const recordActivity = (syncStorage = true) => {
    const now = Date.now();
    lastActivity.value = now;
    showWarning.value = false;

    if (syncStorage && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_LAST_ACTIVITY, String(now));
      } catch (e) {
        // Storage might be blocked or full
      }
    }
  };

  // Throttled activity listener for window events (max once every 3s)
  const onUserActivity = () => {
    if (throttleTimer) return;
    recordActivity(true);
    throttleTimer = setTimeout(() => {
      throttleTimer = null;
    }, 3000);
  };

  // Explicit session extension (e.g., clicking "Stay Logged In")
  const extendSession = () => {
    recordActivity(true);
    showWarning.value = false;
  };

  // Core logout function
  const logout = async (isAutoLogout = false) => {
    if (isLoggingOut.value) return;
    isLoggingOut.value = true;

    // Notify other tabs in same browser
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_LOGOUT_EVENT, String(Date.now()));
        localStorage.removeItem(STORAGE_LAST_ACTIVITY);
      } catch (e) {
        // Ignore storage errors
      }
    }

    try {
      await $fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout API failed or session already expired:', e);
    } finally {
      authUser.value = null;
      if (typeof window !== 'undefined') {
        const target = isAutoLogout ? '/admin/login?reason=timeout' : '/admin/login';
        router.push(target);
      }
    }
  };

  // Cross-tab synchronization via StorageEvent
  const onStorageChange = (e: StorageEvent) => {
    if (e.key === STORAGE_LOGOUT_EVENT && e.newValue) {
      // Another tab logged out
      authUser.value = null;
      router.push('/admin/login');
    } else if (e.key === STORAGE_LAST_ACTIVITY && e.newValue) {
      const remoteActivity = parseInt(e.newValue, 10);
      if (!isNaN(remoteActivity) && remoteActivity > lastActivity.value) {
        lastActivity.value = remoteActivity;
        showWarning.value = false;
      }
    } else if (e.key === STORAGE_TIMEOUT_HOURS && e.newValue) {
      const parsedHours = parseInt(e.newValue, 10);
      if (!isNaN(parsedHours) && [1, 2, 6, 12, 24].includes(parsedHours)) {
        timeoutHours.value = parsedHours;
      }
    }
  };

  // Periodic session checker
  const checkSession = () => {
    if (!authUser.value || isLoggingOut.value) return;

    if (typeof window !== 'undefined') {
      const storedActivity = localStorage.getItem(STORAGE_LAST_ACTIVITY);
      if (storedActivity) {
        const parsed = parseInt(storedActivity, 10);
        if (!isNaN(parsed) && parsed > lastActivity.value) {
          lastActivity.value = parsed;
        }
      }
    }

    const elapsed = Date.now() - lastActivity.value;
    const remaining = timeoutMs.value - elapsed;

    if (remaining <= 0) {
      showWarning.value = false;
      logout(true);
    } else if (remaining <= 60000) {
      // 60 seconds warning before auto-logout
      showWarning.value = true;
      remainingSeconds.value = Math.max(1, Math.ceil(remaining / 1000));
    } else {
      showWarning.value = false;
    }
  };

  // Check on tab visibility restoration
  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      checkSession();
    }
  };

  // Fetch current setting from server
  const fetchTimeoutSetting = async () => {
    try {
      const res = await $fetch<any>('/api/admin/session-timeout');
      if (res?.success && res.timeoutHours) {
        timeoutHours.value = res.timeoutHours;
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_TIMEOUT_HOURS, String(res.timeoutHours));
        }
      }
    } catch (err) {
      // If error (e.g. not logged in), use fallback
    }
  };

  // Start watching session
  const initSessionWatcher = () => {
    if (typeof window === 'undefined' || isListening) return;
    isListening = true;

    // Load any persisted activity timestamp
    const stored = localStorage.getItem(STORAGE_LAST_ACTIVITY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) {
        lastActivity.value = parsed;
      }
    } else {
      recordActivity(true);
    }

    // Attach DOM interaction listeners
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, onUserActivity, { passive: true });
    });

    window.addEventListener('storage', onStorageChange);
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Initial check & setting retrieval
    fetchTimeoutSetting();
    checkSession();

    // Check interval every 1 second for precise warning countdown
    checkTimer = setInterval(checkSession, 1000);
  };

  const cleanupSessionWatcher = () => {
    if (typeof window === 'undefined' || !isListening) return;
    isListening = false;

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.removeEventListener(event, onUserActivity);
    });

    window.removeEventListener('storage', onStorageChange);
    document.removeEventListener('visibilitychange', onVisibilityChange);

    if (checkTimer) clearInterval(checkTimer);
    if (throttleTimer) clearTimeout(throttleTimer);
  };

  // Update session timeout (Super Admin)
  const updateTimeout = async (newHours: number) => {
    const res = await $fetch<any>('/api/admin/session-timeout', {
      method: 'POST',
      body: { timeoutHours: newHours }
    });

    if (res?.success) {
      timeoutHours.value = newHours;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_TIMEOUT_HOURS, String(newHours));
      }
      recordActivity(true);
    }
    return res;
  };

  return {
    timeoutHours,
    isSuperAdmin,
    lastActivity,
    showWarning,
    remainingSeconds,
    timeoutMs,
    extendSession,
    logout,
    updateTimeout,
    fetchTimeoutSetting,
    initSessionWatcher,
    cleanupSessionWatcher
  };
};
