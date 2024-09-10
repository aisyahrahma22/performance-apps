import axios from '../../axios';
import useSWR from 'swr';

const API_PERF_GOAL_SETTING_APPROVAL_REVISION_NOTE =
  '/api/perf-superior/revise';

export const getPerfGoalSettingApprovalRevisionNote = (
  url: string,
  id: string,
) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerfGoalSettingApprovalRevisionNote = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_PERF_GOAL_SETTING_APPROVAL_REVISION_NOTE, id] : null,
    getPerfGoalSettingApprovalRevisionNote,
    {
      revalidateOnMount: true,
    },
  );
  return {
    perfGoalSettingApprovalRevisionNote: data,
    isPerfGoalSettingApprovalRevisionNoteLoading: !error && !data,
    isPerfGoalSettingApprovalRevisionNoteError: error,
  };
};

export default usePerfGoalSettingApprovalRevisionNote;
