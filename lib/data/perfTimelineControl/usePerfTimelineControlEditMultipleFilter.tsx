import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_TIMELINE_CONTROL_EDIT_MULTIPLE_FILTER =
  '/api/timeline-control/filter-multiple-data';

const patchEditMultipleFilterPerfTimelineControl =
  (patchEditMultipleFilterPerfTimelineControlBody: {
    filter: any;
    timelines: any;
  }) => {
    return axios
      .patch(
        API_TIMELINE_CONTROL_EDIT_MULTIPLE_FILTER,
        patchEditMultipleFilterPerfTimelineControlBody,
      )
      .then((resp) => resp.data);
  };

interface UsePerfTimelineControlEditMultipleFilter {
  onSuccess?: any;
}

const usePerfTimelineControlEditMultipleFilter = (
  args: UsePerfTimelineControlEditMultipleFilter = {},
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
    fetcher: patchEditMultipleFilterPerfTimelineControl,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    perfTimelineControlEditMultipleFilterPosting: fetch,
    isPerfTimelineControlEditMultipleFilterLoading: isLoading,
  };
};

export default usePerfTimelineControlEditMultipleFilter;
