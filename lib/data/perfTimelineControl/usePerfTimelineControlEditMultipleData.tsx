import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_TIMELINE_CONTROL_EDIT_MULTIPLE_DATA =
  '/api/timeline-control/multiple-data';

const patchEditMultipleDataPerfTimelineControl =
  (patchEditMultipleDataPerfTimelineControlBody: {
    data: any;
    timelines: any;
  }) => {
    return axios
      .patch(
        API_TIMELINE_CONTROL_EDIT_MULTIPLE_DATA,
        patchEditMultipleDataPerfTimelineControlBody,
      )
      .then((resp) => resp.data);
  };

interface UsePerfTimelineControlEditMultipleData {
  onSuccess?: any;
}

const usePerfTimelineControlEditMultipleData = (
  args: UsePerfTimelineControlEditMultipleData = {},
) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(
    (data) => {
      onSuccess?.();
      toast.success(data);
    },
    [onSuccess],
  );

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchEditMultipleDataPerfTimelineControl,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    perfTimelineControlEditMultipleDataPosting: fetch,
    isPerfTimelineControlEditMultipleDataLoading: isLoading,
  };
};

export default usePerfTimelineControlEditMultipleData;
