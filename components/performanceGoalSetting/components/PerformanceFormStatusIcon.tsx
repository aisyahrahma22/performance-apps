import React, { useMemo, useState } from 'react';
import { Icon } from 'semantic-ui-react';
import {
  PerfEmployeeStatusEnum,
  PerfSuperiorStatusEnum,
} from '../../../lib/enums/GoalSetting';
import {
  PFWorkflowTypeEnum,
  timelineEnum,
} from '../../../lib/enums/PerformanceEnum';
import { isEqual } from 'lodash';
import { isAfter, isBefore } from 'date-fns';

interface RenderIconProps {
  performanceStatus: any;
  timelineSeq: any;
  type: PFWorkflowTypeEnum;
}

function PerformanceFormStatusIcon({
  performanceStatus,
  timelineSeq,
  type,
}: RenderIconProps) {
  const [status, setStatus] = useState<any>(performanceStatus);
  const [tempTimelineSeq, setTempTimelineSeq] = useState<any>();

  if (!isEqual(tempTimelineSeq, timelineSeq)) {
    setTempTimelineSeq(timelineSeq);
    !timelineSeq
      ? setStatus(PerfEmployeeStatusEnum.INVALID)
      : isAfter(new Date(), new Date(timelineSeq?.endDate)) &&
        timelineSeq.timeline !== timelineEnum.PERFORMANCE_APPRAISAL_COMPLETED
      ? setStatus(PerfEmployeeStatusEnum.OUT_DATE)
      : isBefore(new Date(), new Date(timelineSeq?.startDate)) &&
        timelineSeq.timeline !== timelineEnum.PERFORMANCE_APPRAISAL_COMPLETED
      ? setStatus(PerfEmployeeStatusEnum.UP_COMING)
      : setStatus(performanceStatus);
  }

  const isStatusAvailable = useMemo(
    () => status === PerfEmployeeStatusEnum.AVAILABLE,
    [status],
  );

  const isStatusInProgress = useMemo(
    () => status === PerfEmployeeStatusEnum.IN_PROGRESS,
    [status],
  );

  const isStatusDraft = useMemo(
    () => status === PerfSuperiorStatusEnum.DRAFT,
    [status],
  );

  const isStatusApproved = useMemo(
    () => status === PerfSuperiorStatusEnum.APPROVED,
    [status],
  );

  const isStatusCompleted = useMemo(
    () => status === PerfEmployeeStatusEnum.COMPLETED,
    [status],
  );

  const isStatusRevised = useMemo(
    () => status === PerfSuperiorStatusEnum.REVISED,
    [status],
  );
  const isStatusRequested = useMemo(
    () => status === PerfSuperiorStatusEnum.REQUESTED,
    [status],
  );
  const isStatusPending = useMemo(
    () => status === PerfSuperiorStatusEnum.PENDING,
    [status],
  );

  const isWorkFlowReader = useMemo(
    () =>
      status === PerfEmployeeStatusEnum.NO_APPROVAL ||
      type == PFWorkflowTypeEnum.PF_WORKFLOW_READER,
    [status, type],
  );

  const isStatusOutDate = useMemo(
    () => status == PerfSuperiorStatusEnum.OUT_DATE,
    [status],
  );

  const isStatusUpcoming = useMemo(
    () => status == PerfSuperiorStatusEnum.UP_COMING,
    [status],
  );

  const isStatusInvalid = useMemo(
    () => status == PerfEmployeeStatusEnum.INVALID,
    [status],
  );
  return (
    <>
      {isWorkFlowReader && <Icon name={'close'} color={'red'} />}
      {!isWorkFlowReader && isStatusPending && (
        <Icon name={'hourglass start'} color={'violet'} />
      )}
      {!isWorkFlowReader && isStatusRequested && (
        <Icon name={'check square'} color={'blue'} />
      )}
      {!isWorkFlowReader && isStatusRevised && (
        <Icon name={'edit'} color={'violet'} />
      )}
      {!isWorkFlowReader && isStatusAvailable && (
        <Icon name={'check square'} color={'blue'} />
      )}
      {!isWorkFlowReader && isStatusInProgress && (
        <Icon name={'rocket'} color={'violet'} />
      )}
      {!isWorkFlowReader && isStatusDraft && (
        <Icon name={'save'} color={'blue'} />
      )}
      {!isWorkFlowReader && isStatusApproved && (
        <Icon name={'thumbs up'} color={'teal'} />
      )}
      {!isWorkFlowReader && isStatusCompleted && (
        <Icon name={'check circle'} color={'teal'} />
      )}
      {!isWorkFlowReader && isStatusOutDate && (
        <Icon name={'calendar times'} color={'red'} />
      )}
      {!isWorkFlowReader && isStatusInvalid && (
        <Icon name={'close'} color={'red'} />
      )}
      {!isWorkFlowReader && isStatusUpcoming && (
        <Icon name={'history'} flipped={'horizontally'} color={'teal'} />
      )}
    </>
  );
}

export default PerformanceFormStatusIcon;
