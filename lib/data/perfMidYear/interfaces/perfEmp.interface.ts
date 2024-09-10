import {
  PerfEmpNoteObj,
  PerfGoalSettingRevisionNote,
} from '../../../../components/performanceGoalSetting/types/goalSettingTypes';
import {
  PerfSuperiorStatusEnum,
  PFWorkflowTypeEnum,
} from '../../../enums/PerformanceEnum';
import { PerfEmployeeStatusEnum } from '../../../enums/TimelineStatusEnum';
import {
  PerfEmpItemPerKPIScoreKeyEnum,
  PerfEmpItemPerKPIScoreTypeEnum,
} from '../enum/perfEmp.enum';
import { PerfLevelEnum } from '../enum/perfForm.enum';
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
  notes?: PerfEmpNoteObj;
  deletedPerfEmpItemKPIs: string[];
  perfSup?: PerfSupProps;
  siloamValue: SiloamValueProps[];
  demostrateKPISiloamValueDM: DemostrateKPISiloamValueProps[];
  demostrateKPISiloamValueADM: DemostrateKPISiloamValueProps[];
  revise: PerfGoalSettingRevisionNote;
  perfEmpItemPerKPI?: any;
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
  perfEmpItemId: string;
  perfKRAId?: string | null;
  perfKPIId?: string | null;
  perfTargetId?: string | null;
  isShowComment: boolean;
  code?: string;
  isDeleted?: boolean;
  scores: {
    [PerfEmpItemPerKPIScoreKeyEnum.midBySelf]?: PerfEmpItemPerKPIScoreProps;
    [PerfEmpItemPerKPIScoreKeyEnum.midByDM]?: PerfEmpItemPerKPIScoreProps;
    [PerfEmpItemPerKPIScoreKeyEnum.midByAboveDM]?: PerfEmpItemPerKPIScoreProps;
    [PerfEmpItemPerKPIScoreKeyEnum.endBySelf]?: PerfEmpItemPerKPIScoreProps;
    [PerfEmpItemPerKPIScoreKeyEnum.endByDM]?: PerfEmpItemPerKPIScoreProps;
    [PerfEmpItemPerKPIScoreKeyEnum.endByAboveDM]?: PerfEmpItemPerKPIScoreProps;
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
  id?: string;
  score?: number;
  scoreId: string;
  note: string;
  type: PerfEmpItemPerKPIScoreTypeEnum;
  isMidYear: boolean;
  weightScore: number;
  isAbsoluteScore: boolean;
};

export type SiloamValueProps = {
  description: string;
  id: string;
  name: string;
};

export type DemostrateKPISiloamValueProps = {
  id?: string;
  siloamValueId: string;
  score?: number;
  perfSuperiorId?: string;
  perfEmployeeId: string;
  type: PerfLevelEnum.ABOVE_MANAGER | PerfLevelEnum.DIRECT_MANAGER;
  order?: number;
};
