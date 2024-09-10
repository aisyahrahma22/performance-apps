import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { dateStringFormat } from '../../../components/DatePicker';
import { parse } from 'date-fns';
const API_TIMELINE_SEQ_EDIT = '/api/performance-program/timeline';
const patchEditPerfTimelineSeq = (patchEditPerfTimelineSeqBody: {
  id: string;
  sequences: any;
}) => {
  return axios
    .patch(API_TIMELINE_SEQ_EDIT, {
      ...patchEditPerfTimelineSeqBody,
      sequences: patchEditPerfTimelineSeqBody?.sequences.map((item: any) => ({
        ...item,
        startDate: parse(item.startDate, dateStringFormat, new Date()),
        endDate: parse(item.endDate, dateStringFormat, new Date()),
      })),
    })
    .then((resp) => resp.data);
};

interface UsePerfTimelineSeqEdit {
  onSuccess?: any;
}

const usePerfTimelineSeqEdit = (args: UsePerfTimelineSeqEdit = {}) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(`Timeline sequences has been updated`);
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchEditPerfTimelineSeq,
    onSuccess: _onSuccess,
    onError: _onError,
  });

  return {
    perfTimelineSeqEditPosting: fetch,
    isPerfTimelineSeqEditLoading: isLoading,
  };
};

export default usePerfTimelineSeqEdit;
