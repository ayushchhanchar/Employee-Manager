import { atom } from 'recoil';

export const payrollFiltersState = atom({
  key: 'payrollFiltersState',
  default: {
    year: new Date().getFullYear(),
    month: '',
    status: '',
    employeeId: '',
    page: 1,
    limit: 10,
  },
});

export const payrollState = atom({
  key: 'payrollState',
  default: {
    list: [],
    summary: null,
    pagination: {},
    loading: false,
    error: null,
  },
});
