import { atom, selector } from 'recoil';

// Auth state
export const authState = atom({
  key: 'authState',
  default: {
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
  },
});

// User role selector
export const userRoleSelector = selector({
  key: 'userRoleSelector',
  get: ({ get }) => {
    const auth = get(authState);
    return auth.user?.role || null;
  },
});

// Is admin selector
export const isAdminSelector = selector({
  key: 'isAdminSelector',
  get: ({ get }) => {
    const role = get(userRoleSelector);
    return role === 'admin' || role === 'hr';
  },
});

// Employee data state
export const employeeState = atom({
  key: 'employeeState',
  default: {
    profile: null,
    loading: false,
    error: null,
  },
});

// Dashboard stats state
export const dashboardStatsState = atom({
  key: 'dashboardStatsState',
  default: {
    stats: null,
    loading: false,
    error: null,
  },
});