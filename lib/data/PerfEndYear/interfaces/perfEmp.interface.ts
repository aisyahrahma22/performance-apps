import {
  PerfSuperiorStatusEnum,
  PFWorkflowTypeEnum,
} from '../../../enums/PerformanceEnum';
import { PerfEmployeeStatusEnum } from '../../../enums/TimelineStatusEnum';
import { PerfEmpItemPerKPIScoreTypeEnum } from '../../perfMidYear/enum/perfEmp.enum';
// import { PerfLevelEnum } from '../../perfMidYear/enum/perfForm.enum';
import {
  PerfFormProps,
  PerfProgramTimelineSeqProps,
} from './perfForm.interface';

export type PerfEmpProps = {
  id: string;
  perfForm: PerfFormProps;
  timelineSeq?: PerfProgramTimelineSeqProps;
  employee?: EmployeeProps;
  status: PerfEmployeeStatusEnum;
  // perfEmpItemTypes: PerfEmpItemTypeProps[]
  perfEmpItems: {
    [perfFormTypeId: string]: PerfEmpItemProps[];
  };
  perfTypeScores: {
    [perfFormTypeId: string]: PerfTypeScoreProps;
  };
  notes?: string;
  deletedPerfEmpItemKPIs: string[];
  perfSup?: PerfSupProps;
};

export type PerfSupProps = {
  id: string;
  status: PerfSuperiorStatusEnum;
  level: number;
  type: PFWorkflowTypeEnum;
};

export type EmployeeProps = {
  id: string;
  fullName: string;
  positionId: string;
  positionName: string;
  profilePath?: string;
};

export type PerfEmpItemProps = {
  id: string;
  perfEmpItemTypeId?: string;
  perfFormTypeItemId?: string;
  perfFormTypeKRAId?: string;
  perfFormTypeKPIId?: string;
  perfFormTypeTargetId?: string;
  perfEmpItemPerKPIs: PerfEmpItemPerKPIProps[];
  totalWeight?: number;
};

export type PerfEmpItemPerKPIProps = {
  id: string;
  kra?: string;
  kpi?: string;
  target?: string;
  weight?: number;
  isErrorWeight?: boolean;
  achievement?: string;
  lastVersion?: number;
  perfEmpItemId?: string;
  perfKRAId?: string;
  perfKPIId?: string;
  perfTargetId?: string;
  isShowComment: boolean;
  code?: string;
  scores: {
    midBySelf?: PerfEmpItemPerKPIScoreProps;
    midByDM?: PerfEmpItemPerKPIScoreProps;
    midByAboveDM?: PerfEmpItemPerKPIScoreProps;
    endBySelf?: PerfEmpItemPerKPIScoreProps;
    endByDM?: PerfEmpItemPerKPIScoreProps;
    endByAboveDM?: PerfEmpItemPerKPIScoreProps;
  };
};

export type PerfTypeScoreProps = {
  midScoreBySelf?: number;
  midScoreByDM?: number;
  midScoreByAboveDM?: number;
  endScoreBySelf?: number;
  endScoreByDM?: number;
  endScoreByAboveDM?: number;
};

export type PerfEmpItemPerKPIScoreProps = {
  id: string;
  score?: number;
  scoreId: string;
  note: string;
  type: PerfEmpItemPerKPIScoreTypeEnum;
  isEndYear: boolean;
  weightScore: number;
};
