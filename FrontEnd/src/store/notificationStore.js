import { atom } from 'recoil';

export const notificationState = atom({
  key: 'notificationState',
  default: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
});

export const notificationFiltersState = atom({
  key: 'notificationFiltersState',
  default: {
    type: '',
    priority: '',
    unreadOnly: false,
  },
});