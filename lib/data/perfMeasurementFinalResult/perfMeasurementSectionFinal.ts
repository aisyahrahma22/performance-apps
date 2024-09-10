export type PerfMeasurementFinalSec = {
  id?: string;
  order?: number;
  codeGrade: string;
  codeName?: string;
  minimum?: number | string;
  maximum?: number | string;
  isLabelDuplicated?: boolean;
  isValueDuplicated?: boolean;
};

export type PerfMeasurementFinalEdit = {
  id: string;
  order?: number;
  codeGrade: any;
  codeName?: any;
  minimum?: number | string;
  maximum?: number | string;
  isLabelDuplicated?: boolean;
  isValueDuplicated?: boolean;
};

export interface PerfMeasurementFinalRequestDataProps {
  id?: string;
  measurementCode: string;
  measurementName: string;
  year: number | string;
  dataGradeFinal: PerfMeasurementFinalSec[];
}

export interface PerfMeasurementFinalEditDataProps {
  id?: string;
  measurementCode: any;
  measurementName: any;
  year: any;
  dataGradeFinal: PerfMeasurementFinalEdit[];
}
