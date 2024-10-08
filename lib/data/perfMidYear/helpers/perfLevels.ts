import { PerfEmpItemPerKPIScoreKeyEnum } from '../enum/perfEmp.enum';
import { PerfLevelEnum } from '../enum/perfForm.enum';

export const keyEmpMidItemPerKPIByLevels = [
  {
    level: PerfLevelEnum.APPRAISEE,
    key: PerfEmpItemPerKPIScoreKeyEnum.midBySelf,
    keyScore: 'scores.midBySelf.score',
    keyScoreId: 'scores.midBySelf.scoreId',
    keyWeight: 'scores.midBySelf.weightScore',
    keyComment: 'scores.midBySelf.note',
    labelScore: 'Self Score',
    labelWeight: 'Weighted Score',
    labelComment: 'Self Comment',
    type: 'scores.midBySelf.type',
  },
  {
    level: PerfLevelEnum.DIRECT_MANAGER,
    key: PerfEmpItemPerKPIScoreKeyEnum.midByDM,
    keyScore: 'scores.midByDM.score',
    keyScoreId: 'scores.midByDM.scoreId',
    keyWeight: 'scores.midByDM.weightScore',
    keyComment: 'scores.midByDM.note',
    labelScore: 'Score by Direct Manager',
    labelWeight: 'Weighted Score by Direct Manager',
    labelComment: 'Comment by Direct Manager',
    type: 'scores.midByDM.type',
  },
  {
    level: PerfLevelEnum.ABOVE_MANAGER,
    key: PerfEmpItemPerKPIScoreKeyEnum.midByAboveDM,
    keyScore: 'scores.midByAboveDM.score',
    keyScoreId: 'scores.midByAboveDM.scoreId',
    keyWeight: 'scores.midByAboveDM.weightScore',
    keyComment: 'scores.midByAboveDM.note',
    labelScore: 'Score by Above Direct Manager',
    labelWeight: 'Weighted Score by Above Direct Manager',
    labelComment: 'Comment by Above Direct Manager',
    type: 'scores.midByAboveDM.type',
  },
];

export const keyEmpEndItemPerKPIByLevels = [
  {
    level: PerfLevelEnum.APPRAISEE,
    key: PerfEmpItemPerKPIScoreKeyEnum.endBySelf,
    keyScore: 'scores.endBySelf.score',
    keyScoreId: 'scores.endBySelf.scoreId',
    keyWeight: 'scores.endBySelf.weightScore',
    keyComment: 'scores.endBySelf.note',
    labelScore: 'Self Score',
    labelWeight: 'Weighted Score',
    labelComment: 'Self Comment',
    type: 'scores.endBySelf.type',
  },
  {
    level: PerfLevelEnum.DIRECT_MANAGER,
    key: PerfEmpItemPerKPIScoreKeyEnum.endByDM,
    keyScore: 'scores.endByDM.score',
    keyScoreId: 'scores.endByDM.scoreId',
    keyWeight: 'scores.endByDM.weightScore',
    keyComment: 'scores.endByDM.note',
    labelScore: 'Score by Direct Manager',
    labelWeight: 'Weighted Score by Direct Manager',
    labelComment: 'Comment by Direct Manager',
    type: 'scores.endByDM.type',
  },
  {
    level: PerfLevelEnum.ABOVE_MANAGER,
    key: PerfEmpItemPerKPIScoreKeyEnum.endByAboveDM,
    keyScore: 'scores.endByAboveDM.score',
    keyScoreId: 'scores.endByAboveDM.scoreId',
    keyWeight: 'scores.endByAboveDM.weightScore',
    keyComment: 'scores.endByAboveDM.note',
    labelScore: 'Score by Above Direct Manager',
    labelWeight: 'Weighted Score by Above Direct Manager',
    labelComment: 'Comment by Above Direct Manager',
    type: 'scores.endByAboveDM.type',
  },
];
