import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_TIMELINE_CONTROL_EDIT = '/api/timeline-control';
const patchEditPerfTimelineControl = (patchEditPerfTimelineControlBody: {
  id: string;
  timelines: string;
}) => {
  return axios
    .patch(API_TIMELINE_CONTROL_EDIT, patchEditPerfTimelineControlBody)
    .then((resp) => resp.data);
};

interface UsePerfTimelineControlEdit {
  onSuccess?: any;
}

const usePerfTimelineControlEdit = (args: UsePerfTimelineControlEdit = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(`Timeline has been updated`);
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchEditPerfTimelineControl,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    perfTimelineControlEditPosting: fetch,
    isPerfTimelineControlEditLoading: isLoading,
  };
};

export default usePerfTimelineControlEdit;
