import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { OurState, OurStore } from '../store';
import { SliceCaseReducers } from '@reduxjs/toolkit/src/createSlice';
import axios from '../axios';
import { toast } from 'react-toastify';

export interface DataAccessMapSliceState {
  dataAccessMapping?: any;
  isFetchingDataAccess: boolean;
}
export const API_DATA_ACCESS_MAPPING = '/api/auth/data-access-mapping';

export type AuthMapping = void;
export const fetchAuthAccessMapping = createAsyncThunk<
  any,
  AuthMapping,
  OurState
>('dataAccessMapping', async (_payload, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(API_DATA_ACCESS_MAPPING);
    return {
      data,
    };
  } catch (err: any) {
    return rejectWithValue(err.response?.message || err.toString());
  }
});

const initialState = {
  dataAccessMapping: [],
  isFetchingDataAccess: false,
};

export const dataAccessMappingSlice = createSlice<
  DataAccessMapSliceState,
  SliceCaseReducers<DataAccessMapSliceState>
>({
  name: 'dataAccessMapping',
  initialState: initialState,
  reducers: {
    updateAuthDataMapping: (state, { payload }) => {
      state.isFetchingDataAccess = false;
      state.dataAccessMapping = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthAccessMapping.pending, (state) => {
        state.isFetchingDataAccess = true;
        state.dataAccessMapping = false;
      })
      .addCase(
        fetchAuthAccessMapping.fulfilled,
        (state: DataAccessMapSliceState, { payload }) => {
          state.isFetchingDataAccess = false;
          state.dataAccessMapping = payload.data;
        },
      )
      .addCase(fetchAuthAccessMapping.rejected, (state, action) => {
        state.isFetchingDataAccess = false;
        state.dataAccessMapping = false;
        toast.error(action.payload as string, {
          toastId: 'error-dataAccessMapping',
        });
      });
  },
});

export const { updateAuthDataMapping } = dataAccessMappingSlice.actions;

export const dataAccessSelector = (state: OurStore) => {
  return state.dataAccessMapping.dataAccessMapping || [];
};
