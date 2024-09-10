import { IconProps } from 'semantic-ui-react';
import { PerfSuperiorStatusEnum } from '../../../enums/PerformanceEnum';
import { PerfEmployeeStatusEnum } from '../../../enums/TimelineStatusEnum';

export const getReadinessStatusPerfEmp = (status: PerfEmployeeStatusEnum) => {
  const icon: IconProps = {};

  switch (status) {
    case PerfEmployeeStatusEnum.AVAILABLE:
      icon.name = 'edit outline';
      icon.color = 'green';
      break;
    case PerfEmployeeStatusEnum.DRAFT:
      icon.name = 'save';
      icon.color = 'blue';
      break;
    case PerfEmployeeStatusEnum.REVISED:
      icon.name = 'edit';
      icon.color = 'blue';
      break;
    case PerfEmployeeStatusEnum.IN_PROGRESS:
      icon.name = 'hourglass start';
      icon.color = 'violet';
      break;
    case PerfEmployeeStatusEnum.COMPLETED:
      icon.name = 'check circle';
      icon.color = 'teal';
      break;
    case PerfEmployeeStatusEnum.APPROVED:
      icon.name = 'thumbs up';
      icon.color = 'teal';
      break;
    default:
      break;
  }

  return icon;
};

export const getReadinessStatusPerfSup = (status?: PerfSuperiorStatusEnum) => {
  const icon: IconProps = {};

  switch (status) {
    case PerfSuperiorStatusEnum.PENDING:
      icon.name = 'hourglass start';
      icon.color = 'purple';
      break;
    case PerfSuperiorStatusEnum.REQUESTED:
      icon.name = 'paper plane';
      icon.color = 'violet';
      break;
    case PerfSuperiorStatusEnum.DRAFT:
      icon.name = 'save';
      icon.color = 'blue';
      break;
    case PerfSuperiorStatusEnum.APPROVED:
      icon.name = 'thumbs up';
      icon.color = 'blue';
      break;
    case PerfSuperiorStatusEnum.REVISED:
      icon.name = 'edit';
      icon.color = 'blue';
      break;
    case PerfSuperiorStatusEnum.PASSED:
      icon.name = 'check circle';
      icon.color = 'teal';
      break;
    case PerfSuperiorStatusEnum.NO_APPROVAL:
      icon.name = 'close';
      icon.color = 'red';
      break;
    default:
      break;
  }

  return icon;
};
