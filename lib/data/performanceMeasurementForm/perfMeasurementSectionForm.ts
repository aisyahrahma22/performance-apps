export type PerfMeasurementSec = {
  id: string;
  gradeCode: string;
  gradeName?: string;
  point?: string;
  isLabelDuplicated?: boolean;
  isValueDuplicated?: boolean;
};
export type PerfMeasurementEdit = {
  id: string;
  gradeCode: any;
  gradeName?: any;
  point?: any;
  isLabelDuplicated?: boolean;
  isValueDuplicated?: boolean;
};
export interface PerfMeasurementRequestDataProps {
  id?: string;
  templateCode: string;
  templateName: string;
  year: number | string;
  performanceType: any;
  initialSkills?: any;
  dataGrade: PerfMeasurementSec[];
}
export interface PerfMeasurementEditDataProps {
  id?: string;
  templateCode: any;
  templateName: any;
  year: any;
  performanceType: string;
  initialSkills?: any;
  dataGrade: PerfMeasurementEdit[];
}
