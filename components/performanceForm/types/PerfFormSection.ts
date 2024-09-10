import { PerfFormEnum } from '../../../lib/enums/PerfForm';

export interface PerfFormSectionPageInfoProps {
  pageNumber: number;
  title: string;
  isFirst: boolean;
  isLast: boolean;
  requiredFields: string[];
}

// export interface LearningSuggestionsRequestProps {
//   id: string;
//   title?: string;
//   position?: string;
//   positionGroupIds?: any;
//   learnings?: any;
//   initialPositions?: any;
//   initialLearnings?: any;
// }

// export type LNAConfiguration = {
//   id: string;
//   label: string;
//   description?: string;
//   value?: number | string;
//   isLabelDuplicated?: boolean;
//   isValueDuplicated?: boolean;
// };

export interface PerfFormRequestDataProps {
  items: any;
  performanceTypeId: any;
  finalResultCalc?: PerfFormEnum;
  employeeId: any;
  positionId: any;
  isMidYearScore: boolean;
  dataPerfType: any;
}
