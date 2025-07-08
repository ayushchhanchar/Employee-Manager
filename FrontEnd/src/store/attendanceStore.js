import { atom } from 'recoil';

export const attendanceState = atom({
  key: 'attendanceState',
  default: {
    todayAttendance: null,
    attendanceList: [],
    summary: null,
    loading: false,
    error: null,
  },
});

export const attendanceFiltersState = atom({
  key: 'attendanceFiltersState',
  default: {
    startDate: null,
    endDate: null,
    status: '',
    employeeId: '',
  },
});