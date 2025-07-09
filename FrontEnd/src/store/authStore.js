import { atom, selector } from 'recoil';

export const authState = atom({
  key: 'authState',
  default: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  },
});

export const userRoleSelector = selector({
  key: 'userRoleSelector',
  get: ({ get }) => {
    const auth = get(authState);
    return auth.user?.role || 'employee';
  },
});

export const isAdminSelector = selector({
  key: 'isAdminSelector',
  get: ({ get }) => {
    const role = get(userRoleSelector);
    return ['admin', 'hr'].includes(role);
  },
});

export const dashboardStatsState = atom({
  key: 'dashboardStatsState',
  default: {
    stats: null,
    loading: true,
    error: null,
  },
});
