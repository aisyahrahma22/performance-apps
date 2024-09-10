import axios from '../../axios';
import useFetch from '../_useFetch';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const API_PERFORMANCE_INQUIRY_APPROVERS_EDIT =
  '/api/performance-inquiry/approver';

const patchPerformanceInquiryApprovers = async (values: any) => {
  const resp = await axios.patch(
    API_PERFORMANCE_INQUIRY_APPROVERS_EDIT,
    values,
  );
  return resp.data;
};

interface UsePerformanceInquiryApproversEdit {
  onSuccess?: any;
}

const usePerformanceInquiryApproversEdit = (
  args: UsePerformanceInquiryApproversEdit = {},
) => {
  const { onSuccess } = args;

  const _onSuccess = useCallback(() => {
    onSuccess?.();
    toast.success(`Data has been updated`);
  }, [onSuccess]);

  const _onError = useCallback((e) => {
    toast.error(`${e.response?.data?.message || e}`);
  }, []);

  const { fetch, isLoading } = useFetch({
    fetcher: patchPerformanceInquiryApprovers,
    onSuccess: _onSuccess,
    onError: _onError,
  });
  return {
    performanceInquiryApproversEdit: fetch,
    isPerformanceInquiryApproversLoading: isLoading,
  };
};

export default usePerformanceInquiryApproversEdit;
