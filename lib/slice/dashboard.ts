import { createSlice } from '@reduxjs/toolkit';
import { OurStore } from '../store';
import { SliceCaseReducers } from '@reduxjs/toolkit/src/createSlice';
import { EmpStatusEnum } from '../data/employee/empStatus';

export interface DashboardSliceState {
  empWorkLocation: any;
  empWLGroupsGroup: any;
  empWLGroupsType: any;
  position: any;
  positionGroupsGroup: any;
  positionGroupsType: any;
  employmentType: any;
  gradeCode: any;
  year: string;
  box: any;
  period: string;
  status: any;
  isResetSlicer: boolean;
  isValidAccess: boolean;
  refreshData?: any;
  perfProgram?: any;
  perfFormName?: any;
  employee?: any;
  perfTerm?: any;
  perfCode?: any;
  isRequiredAccessMapping: boolean;
  termScore?: any;
  positionId: any;
  empStatus?: any;
}

const initialState = {
  empWorkLocation: [],
  empWLGroupsGroup: [],
  empWLGroupsType: [],
  position: [],
  positionGroupsGroup: [],
  positionGroupsType: [],
  employmentType: [],
  gradeCode: [],
  year: '',
  box: [],
  period: '',
  status: [],
  isResetSlicer: false,
  isValidAccess: false,
  refreshData: '',
  isRequiredAccessMapping: false,
  perfProgram: [],
  perfFormName: [],
  employee: [],
  perfTerm: [],
  perfCode: [],
  termScore: [],
  positionId: [''],
  empStatus: [EmpStatusEnum.ACTIVE],
};

export const dashboardSlice = createSlice<
  DashboardSliceState,
  SliceCaseReducers<DashboardSliceState>
>({
  name: 'dashboard',
  initialState,
  reducers: {
    updateSlicer: (state, { payload }) => {
      state.empWorkLocation = payload.empWorkLocation;
      state.empWLGroupsGroup = payload.empWLGroupsGroup;
      state.empWLGroupsType = payload.empWLGroupsType;
      state.position = payload.position;
      state.positionGroupsGroup = payload.positionGroupsGroup;
      state.positionGroupsType = payload.positionGroupsType;
      state.employmentType = payload.employmentType;
      state.gradeCode = payload.gradeCode;
      state.year = payload.year;
      state.box = payload.box;
      state.period = payload.period || '';
      state.status = payload.status || [];
      state.isValidAccess = payload.isValidAccess;
      state.refreshData = payload.refreshData;
      state.isRequiredAccessMapping = payload.isRequiredAccessMapping;
      state.perfProgram = payload.perfProgram;
      state.perfFormName = payload.perfFormName;
      state.employee = payload.employee;
      state.perfTerm = payload.perfTerm;
      state.perfCode = payload.perfCode;
      state.termScore = payload.termScore;
      state.positionId = payload.positionId;
      state.empStatus = payload.empStatus;
    },
    resetSlicer: (state, { payload }) => {
      state.empWorkLocation = [];
      state.empWLGroupsGroup = [];
      state.empWLGroupsType = [];
      state.position = payload.position;
      state.positionGroupsGroup = [];
      state.positionGroupsType = [];
      state.employmentType = [];
      state.gradeCode = [];
      state.year = '';
      state.box = [];
      state.period = '';
      state.status = [];
      state.isResetSlicer = true;
      state.isValidAccess = payload.isValidAccess;
      state.refreshData = [];
      state.perfProgram = [];
      state.perfFormName = [];
      state.perfTerm = [];
      state.perfCode = [];
      state.employee = [];
      state.isRequiredAccessMapping = payload.isRequiredAccessMapping;
      state.termScore = [];
      state.positionId = payload.positionId;
      state.empStatus = [];
    },
    updateStatusReset: (state, { payload = false }) => {
      state.isResetSlicer = payload;
    },
  },
});

export const { updateSlicer, resetSlicer, updateStatusReset } =
  dashboardSlice.actions;

export const slicerStateSelector = (state: OurStore) => {
  const {
    empWorkLocation,
    empWLGroupsGroup,
    empWLGroupsType,
    position,
    positionGroupsGroup,
    positionGroupsType,
    employmentType,
    gradeCode,
    year,
    box,
    period,
    status,
    isValidAccess,
    refreshData,
    perfProgram,
    perfFormName,
    employee,
    perfTerm,
    perfCode,
    isRequiredAccessMapping,
    termScore,
    positionId,
    empStatus,
  } = state.dashboard;

  return {
    empWorkLocation,
    empWLGroupsGroup,
    empWLGroupsType,
    position,
    positionGroupsGroup,
    positionGroupsType,
    employmentType,
    gradeCode,
    year,
    box,
    period,
    status,
    isValidAccess,
    refreshData,
    isRequiredAccessMapping,
    perfProgram,
    perfFormName,
    perfTerm,
    perfCode,
    employee,
    termScore,
    positionId,
    empStatus,
  };
};

export const statusResetSelector = (state: OurStore) => {
  const { isResetSlicer } = state.dashboard;

  return isResetSlicer;
};
