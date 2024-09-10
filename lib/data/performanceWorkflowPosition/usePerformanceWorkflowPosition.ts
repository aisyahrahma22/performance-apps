import axios from '../../axios';
import useSWR from 'swr';
import { filter } from 'lodash';
import { useMemo } from 'react';
import { PFWorkflowTypeEnum } from '../../enums/PerformanceEnum';

const API_PERFORMANCE_WORKFLOW_POSITION = '/api/performanceworkflow/position';

const getPerformanceWorkflowPosition = (url: string, id: string) => {
  return axios.get(`${url}/${id}`).then((resp) => resp.data);
};

const usePerformanceWorkflowPosition = (id: string) => {
  const { data, error } = useSWR(
    id ? [API_PERFORMANCE_WORKFLOW_POSITION, id] : null,
    getPerformanceWorkflowPosition,
    {
      revalidateOnMount: true,
    },
  );
  const approverWorkflows = useMemo(
    () =>
      filter(
        data?.PFWorkflowPst,
        (workflow) => workflow.type == PFWorkflowTypeEnum.PF_WORKFLOW_APPROVER,
      ),
    [data],
  );

  const readerWorkflows = useMemo(
    () =>
      filter(
        data?.PFWorkflowPst,
        (workflow) => workflow.type == PFWorkflowTypeEnum.PF_WORKFLOW_READER,
      ),
    [data],
  );
  return {
    performanceWorkflowPosition: data,
    approverWorkflows,
    readerWorkflows,
    isPerformanceWorkflowPositionLoading: !error && !data,
    isPerformanceWorkflowPositionError: error,
  };
};

export default usePerformanceWorkflowPosition;
