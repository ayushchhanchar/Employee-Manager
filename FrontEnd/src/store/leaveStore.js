import { atom } from 'recoil';

export const leaveState = atom({
  key: 'leaveState',
  default: {
    leaves: [],
    balance: null,
    statistics: null,
    loading: false,
    error: null,
  },
});

export const leaveFiltersState = atom({
  key: 'leaveFiltersState',
  default: {
    status: '',
    leaveType: '',
    startDate: null,
    endDate: null,
    employeeId: '',
  },
});