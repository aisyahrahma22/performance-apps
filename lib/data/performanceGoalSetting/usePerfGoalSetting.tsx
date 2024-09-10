import axios from '../../axios';
import useSWR from 'swr';
import { PerfTypeConfiguration } from '../../../components/performanceForm/types/perfForm';

const API_PERFORMANCE_GOAL_SETTING = '/api/perf-employee/one';
const API_PERF_GOAL_SETTING_STATUS = '/api/perf-employee/status';

export const getPerfGoalSetStatus = (
  url: string = API_PERF_GOAL_SETTING_STATUS,
) => {
  return axios.get(`${url}`).then((resp) => resp.data);
};

export const getPerfGoalSetting = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerfGoalSetting = (id: string) => {
  const { data, error } = useSWR<SinglePerfGoalSetting>(
    id ? [API_PERFORMANCE_GOAL_SETTING, id] : null,
    getPerfGoalSetting,
    {
      revalidateOnMount: true,
    },
  );
  return {
    perfGoalSetting: data,
    isPerfGoalSettingLoading: !error && !data,
    isPerfGoalSettingError: error,
  };
};

type SinglePerfGoalSetting = {
  id: string;
  status: string;
  perfForm: {
    id: string;
    performanceFormCode: string;
    finalResultCalc: string;
    status: string;
    perfProgram: {
      id: string;
      code: string;
      name: string;
      formTerm: 'MID_END_YEAR' | 'END_YEAR';
      finalResultMethod: 'MULTIPLE' | 'SINGLE';
      formMember: 'EMPLOYEE' | 'POSITION';
      startDate: string;
      endDate: string;
    };
    dataPerfType: PerfTypeConfiguration[];
  };
};

export default usePerfGoalSetting;
