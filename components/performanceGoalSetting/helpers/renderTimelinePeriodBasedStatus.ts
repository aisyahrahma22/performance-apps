import { isAfter, isBefore } from 'date-fns';
import renderEnum from '../../../lib/util/renderEnum';
import { timelineEnum } from '../../../lib/enums/PerformanceEnum';

export const renderTimelinePeriodBasedStatus = (
  timelineSeq: any,
  statusTl?: string,
) => {
  const status = renderEnum(statusTl);
  if (!timelineSeq) return 'Invalid';
  const isAfterDate = isAfter(new Date(), new Date(timelineSeq?.endDate));
  const isEndDate = isBefore(new Date(), new Date(timelineSeq?.startDate));
  if (
    isAfterDate &&
    timelineSeq.timeline !== timelineEnum.PERFORMANCE_APPRAISAL_COMPLETED
  )
    return 'Expired';
  if (
    isEndDate &&
    timelineSeq.timeline !== timelineEnum.PERFORMANCE_APPRAISAL_COMPLETED
  )
    return 'Upcoming';
  return status;
};
