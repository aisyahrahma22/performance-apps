import { PerfFormTypeEnum } from '../enum/perfForm.enum';
import {
  DataProps,
  PerfFormProps,
  PerfFormTypeItemProps,
  PerfFormTypeKPIDetailProps,
  PerfFormTypeKPIProps,
  PerfFormTypeProps,
  PerfKPIProps,
  PerfFormTypeKRAProps,
  PerfFormTypeKRADetailProps,
  PerfFormTypeTargetProps,
  PerfFormTypeTargetDetailProps,
  PerfMeasurementFormProps,
  PerfMeasurementGradeProps,
} from '../interfaces/perfForm.interface';

export const generateInitialPerfForm = (perfForm: any) => {
  const perfProgram = perfForm?.perfProgram || {};

  const data: PerfFormProps = {
    id: perfForm?.id,
    isCaptureSiloamValue: perfForm?.isCaptureSiloamValue,
    finalResultCalc: perfForm?.finalResultCalc,
    performanceFormCode: perfForm?.performanceFormCode,
    perfFormName: perfForm?.perfFormName?.name,
    perfProgram: {
      id: perfProgram?.id,
      code: perfProgram?.code,
      name: perfProgram?.name,
      perfMeasurementFinalTemplateId:
        perfProgram?.perfMeasurementFinalTemplateId,
      formTerm: perfProgram?.formTerm,
      finalResultMethod: perfProgram?.finalResultMethod,
      formMember: perfProgram?.formMember,
      startDate: perfProgram?.startDate,
      endDate: perfProgram?.endDate,
      year: perfProgram?.year,
    },
    perfFormTypes: generateInitialPerfFormTypes(perfForm),
  };

  return data;
};

const generateInitialPerfFormTypes = (perfForm: any) => {
  const data: PerfFormTypeProps[] =
    perfForm?.dataPerfType?.map((type: any) => {
      const perfType: PerfFormTypeProps = {
        id: type?.id,
        weight: Number(type?.weight) || 0,
        isMidYearScore: type?.isMidYearScore,
        isCategory: type?.isCategory,
        isKRA: type?.isKRA,
        isTarget: type?.isTarget,
        isCategoryWeightCalc: type?.isCategoryWeightCalc,
        isKPIWeightCalc: type?.isKPIWeightCalc,
        perfType: generateInitialData(type?.perfTypeId),
        perfMeasurement: generateInitialPerfMeasurement(
          type?.perfMeasurementTempId,
        ),
        items: generateInitialPerfFormTypeItems(type),
      };
      return perfType;
    }) || [];

  return data;
};

const generateInitialPerfFormTypeItems = (perfFormType: any) => {
  const data: PerfFormTypeItemProps[] =
    perfFormType?.dataCategory?.map((item: any) => {
      return {
        id: item?.id,
        categoryWeight: Number(item?.categoryWeight) || 0,
        type: item?.type || PerfFormTypeEnum.NON_CATEGORY,
        perfCategory: generateInitialData(item?.perfCategory),
        perfFormTypeKPI: generateInitialPerfFormTypeKPI(item),
        perfFormTypeKRA: generateInitialPerfFormTypeKRA(item),
        perfFormTypeTarget: generateInitialPerfFormTypeTarget(item),
      } as PerfFormTypeItemProps;
    }) || [];

  return data;
};

const generateInitialPerfFormTypeKPI = (perfFormTypeItem: any) => {
  const dataKPI = perfFormTypeItem?.dataKPI;
  const typeKPI: PerfFormTypeKPIProps | undefined = dataKPI
    ? {
        id: dataKPI?.id,
        isUserDefine: dataKPI?.isUserDefine,
        isSelection: dataKPI?.isSelection,
        isEditable: dataKPI?.isEditable,
        typeMaxKPICount: dataKPI?.typeMaxKPICount,
        typeMaxKPIWeight: dataKPI?.typeMaxKPIWeight,
        minKPICountInput: Number(dataKPI?.minKPICountInput) || 0,
        maxKPICountInput: Number(dataKPI?.maxKPICountInput) || 0,
        minKPIWeightInput: Number(dataKPI?.minKPIWeightInput) || 0,
        maxKPIWeightInput: Number(dataKPI?.maxKPIWeightInput) || 0,
        details:
          dataKPI?.dataKPIDetails?.map((detail: any) => {
            return {
              id: detail?.id,
              isPredefine: detail?.isPredefine,
              weight: Number(detail?.weight) || 0,
              kra: generateInitialData(detail?.performanceKRA),
              kpi: generateInitialKPI(detail?.performanceKPI),
            } as PerfFormTypeKPIDetailProps;
          }) || [],
      }
    : undefined;

  return typeKPI;
};

const generateInitialPerfFormTypeKRA = (perfFormTypeItem: any) => {
  const dataKRA = perfFormTypeItem?.dataKRA;
  const typeKRA: PerfFormTypeKRAProps | undefined = dataKRA
    ? {
        id: dataKRA?.id,
        isUserDefine: dataKRA?.isUserDefine,
        isSelection: dataKRA?.isSelection,
        isEditable: dataKRA?.isEditable,
        details: dataKRA?.dataKRADetails?.map((detail: any) => {
          return {
            id: detail?.id,
            isPredefine: detail?.isPredefine,
            kra: generateInitialData(detail?.performanceKRA),
          } as PerfFormTypeKRADetailProps;
        }),
      }
    : undefined;

  return typeKRA;
};

const generateInitialPerfFormTypeTarget = (perfFormTypeItem: any) => {
  const dataTarget = perfFormTypeItem?.dataTarget;
  const typeTarget: PerfFormTypeTargetProps | undefined = dataTarget
    ? {
        id: dataTarget?.id,
        isUserDefine: dataTarget?.isUserDefine,
        isEditable: dataTarget?.isEditable,
        details: dataTarget?.dataTargetDetails?.map((detail: any) => {
          return {
            id: detail?.id,
            kpi: generateInitialKPI(detail?.performanceKPI),
            target: generateInitialData(detail?.performanceTarget),
          } as PerfFormTypeTargetDetailProps;
        }),
      }
    : undefined;

  return typeTarget;
};

const generateInitialPerfMeasurement = (perfMeasurement?: any) => {
  if (!perfMeasurement) return;
  const data: PerfMeasurementFormProps = {
    id: perfMeasurement?.id,
    templateName: perfMeasurement?.templateName,
    templateCode: perfMeasurement?.templateCode,
    year: perfMeasurement?.year,
    grades:
      perfMeasurement?.dataGrade?.map((grade: any) => {
        return {
          id: grade?.id,
          gradeCode: grade?.gradeCode,
          gradeName: grade?.gradeName,
          point: Number(grade?.point) || 0,
        } as PerfMeasurementGradeProps;
      }) || [],
  };

  return data;
};

const generateInitialKPI = (data?: any) => {
  if (!data) return;

  return {
    id: data?.id,
    code: data?.code,
    name: data?.name,
    description: data?.description,
    keyAction: data?.keyAction,
    behaviour: data?.behaviour,
  } as PerfKPIProps;
};

const generateInitialData = (data?: any) => {
  if (!data) return;

  return {
    id: data?.id,
    code: data?.code,
    name: data?.name,
  } as DataProps;
};
