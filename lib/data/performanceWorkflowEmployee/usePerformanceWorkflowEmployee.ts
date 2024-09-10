import axios from '../../axios';
import useSWR from 'swr';
import { filter } from 'lodash';
import { useMemo } from 'react';
import { PFWorkflowTypeEnum } from '../../enums/PerformanceEnum';

const API_PERFORMANCE_WORKFLOW_EMPLOYEE = '/api/performanceworkflow/employee';

const getPerformanceWorkflowEmployee = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerformanceWorkflowEmployee = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_PERFORMANCE_WORKFLOW_EMPLOYEE, id] : null,
    getPerformanceWorkflowEmployee,
    {
      revalidateOnMount: true,
    },
  );
  const approverWorkflows = useMemo(
    () =>
      filter(
        data?.PFWorkflowEmp,
        (workflow) => workflow.type == PFWorkflowTypeEnum.PF_WORKFLOW_APPROVER,
      ),
    [data],
  );

  const readerWorkflows = useMemo(
    () =>
      filter(
        data?.PFWorkflowEmp,
        (workflow) => workflow.type == PFWorkflowTypeEnum.PF_WORKFLOW_READER,
      ),
    [data],
  );
  return {
    performanceWorkflowEmployee: data,
    approverWorkflows,
    readerWorkflows,
    isPerformanceWorkflowEmployeeLoading: !error && !data,
    isPerformanceWorkflowEmployeeError: error,
  };
};

export default usePerformanceWorkflowEmployee;
