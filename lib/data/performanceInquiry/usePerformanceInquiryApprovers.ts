import axios from '../../axios';
import useSWR from 'swr';
import { filter } from 'lodash';
import { useMemo } from 'react';
import { PFWorkflowTypeEnum } from '../../enums/PerformanceEnum';

const API_PERFORMANCE_INQUIRY_APPROVERS = '/api/performance-inquiry/employee';

const getPerformanceInquiryApprovers = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerformanceInquiryApprovers = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_PERFORMANCE_INQUIRY_APPROVERS, id] : null,
    getPerformanceInquiryApprovers,
    {
      revalidateOnMount: true,
    },
  );

  const employee = useMemo(() => {
    return data?.employee;
  }, [data]);

  const approver = useMemo(
    () =>
      filter(
        data?.perfSuperior,
        (superior) => superior.type == PFWorkflowTypeEnum.PF_WORKFLOW_APPROVER,
      ),
    [data],
  );

  const reader = useMemo(
    () =>
      filter(
        data?.perfSuperior,
        (superior) => superior.type == PFWorkflowTypeEnum.PF_WORKFLOW_READER,
      ),
    [data],
  );
  return {
    employee,
    approver,
    reader,
    isPerformanceApproversLoading: !error && !data,
    isPerformanceApproversError: error,
  };
};

export default usePerformanceInquiryApprovers;
