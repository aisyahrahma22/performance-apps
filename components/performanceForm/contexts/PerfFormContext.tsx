import cloneDeep from 'lodash/cloneDeep';
import React, { createContext, useCallback, useMemo, useState } from 'react';
import usePerformanceFormId, {
  DataPerfCategory,
  DataPerfType,
  PerfFormResponse,
} from '../../../lib/data/performanceForm/usePerformanceForm';
import { timelinesData } from '../helpers/timelineData';
import DropdownOptions from '../../../lib/types/DropdownOptions';
import { formatDate } from '../../../lib/util/formatDate';
import {
  PerfFromRequestDataFormProps,
  PerfTypeConfiguration,
  CategoryConfiguration,
  KRAConfiguration,
  KPIConfiguration,
  TargetConfiguration,
} from '../types/perfForm';
import useEmpParticipantByForm from '../../../lib/data/performanceForm/useEmpParticipantByForm';
import usePosParticipantByForm from '../../../lib/data/performanceForm/usePosParticipantByForm';
import dateLabeling from '../../../lib/util/dateLabeling';

function mapDataPerfType(item: DataPerfType): PerfTypeConfiguration {
  const clonedDataPerfType = cloneDeep(item);
  const newDataPerfType: PerfTypeConfiguration = {
    ...clonedDataPerfType,
    perfTypeId: clonedDataPerfType.perfTypeId?.id,
    perfMeasurementTempId: clonedDataPerfType.perfMeasurementTempId?.id,
    dataCategory: mapDataPerfCategory(clonedDataPerfType),
  };

  return newDataPerfType;
}

function mapDataPerfCategory(clonedDataPerfType: DataPerfType) {
  const newCategory: CategoryConfiguration[] = [];

  clonedDataPerfType.dataCategory.forEach((dataCategory) => {
    const clonedDataCategory = cloneDeep(dataCategory);
    newCategory.push({
      ...clonedDataCategory,
      localIsCategory: clonedDataPerfType.isCategory,
      localIsKRA: clonedDataPerfType.isKRA,
      localIsTarget: clonedDataPerfType.isTarget,
      perfCategory: clonedDataCategory.perfCategory?.id || '',
      dataKRA: mapDataPerfKRA(clonedDataCategory, clonedDataPerfType),
      dataKPI: mapDataPerfKPI(clonedDataCategory, clonedDataPerfType),
      dataTarget: mapDataPerfTarget(clonedDataCategory, clonedDataPerfType),
    });
  });

  return newCategory;
}

function mapDataPerfKRA(
  clonedDataCategory: DataPerfCategory,
  clonedDataPerfType: DataPerfType,
) {
  if (!clonedDataCategory.dataKRA) return undefined;

  const newDataKRA: KRAConfiguration = {
    ...clonedDataCategory.dataKRA,
    localIsCategory: clonedDataPerfType.isCategory,
    localIsKRA: clonedDataPerfType.isKRA,
    dataKRADetails: clonedDataCategory.dataKRA.dataKRADetails.map(
      (dataKRADetails) => ({
        ...dataKRADetails,
        performanceKRA: dataKRADetails.performanceKRA?.id,
      }),
    ),
  };

  return newDataKRA;
}

function mapDataPerfKPI(
  clonedDataCategory: DataPerfCategory,
  clonedDataPerfType: DataPerfType,
) {
  const newDataKPI: KPIConfiguration = {
    ...clonedDataCategory.dataKPI,
    dataKPIDetails: clonedDataCategory.dataKPI.dataKPIDetails.map(
      (dataKPIDetails) => ({
        ...dataKPIDetails,
        localIsKRA: clonedDataPerfType.isKRA,
        performanceKPI: dataKPIDetails.performanceKPI?.id,
        performanceKRA: dataKPIDetails.performanceKRA?.id,
      }),
    ),
  };

  return newDataKPI;
}

function mapDataPerfTarget(
  clonedDataCategory: DataPerfCategory,
  clonedDataPerfType: DataPerfType,
) {
  if (!clonedDataCategory.dataTarget) return undefined;

  const newDataTarget: TargetConfiguration = {
    ...clonedDataCategory.dataTarget,
    localIsCategory: clonedDataPerfType.isCategory,
    localIsTarget: clonedDataPerfType.isTarget,
    dataTargetDetails: clonedDataCategory.dataTarget.dataTargetDetails.map(
      (dataTargetDetails) => ({
        performanceKPI: dataTargetDetails.performanceKPI?.id,
        performanceTarget: dataTargetDetails.performanceTarget?.id,
      }),
    ),
  };

  return newDataTarget;
}

interface PerfFormConntextTypes {
  programId: string;
  setProgramId: React.Dispatch<React.SetStateAction<string>>;
  performanceForm: PerfFormResponse | undefined;
  initialPerfFormValue: PerfFromRequestDataFormProps;
  initialPosition: DropdownOptions[];
  initialEmployee: DropdownOptions[];
  initialOptionPerfFormName: DropdownOptions[];
  initialOptionPerfProgram: DropdownOptions[];
  initialOptionPerfType: (dataPerfTypeIdx: number) => DropdownOptions[];
  initialOptionPerfMeasurement: (dataPerfTypeIdx: number) => DropdownOptions[];
  initialOptionPerfCategory: (
    dataPerfTypeIdx: number,
    dataCategoryIdx: number,
  ) => DropdownOptions[];
  initialOptionPerfKRAInDataKRADetails: (
    dataPerfTypeIdx: number,
    dataCategoryIdx: number,
    dataKRADetailsIdx: number,
  ) => DropdownOptions[];
  initialOptionPerfKRAInDataKPIDetails: (
    dataPerfTypeIdx: number,
    dataCategoryIdx: number,
    dataKRADetailsIdx: number,
  ) => DropdownOptions[];
  initialOptionPerfKPIInDataKPIDetails: (
    dataPerfTypeIdx: number,
    dataCategoryIdx: number,
    dataKRADetailsIdx: number,
  ) => DropdownOptions[];
  initialOptionPerfKPIInDataTargetDetails: (
    dataPerfTypeIdx: number,
    dataCategoryIdx: number,
    dataKRADetailsIdx: number,
  ) => DropdownOptions[];
  initialOptionPerfTargetInDataTargetDetails: (
    dataPerfTypeIdx: number,
    dataCategoryIdx: number,
    dataKRADetailsIdx: number,
  ) => DropdownOptions[];
}

const PerfFormConntext = createContext<PerfFormConntextTypes>({
  programId: '',
  setProgramId: () => {
    return;
  },
  performanceForm: undefined,
  initialPerfFormValue: {
    isCaptureSiloamValue: false,
    performanceFormCode: '',
    perfProgramId: '',
    perfFormName: '',
    dataPosition: [],
    dataEmployee: [],
    dataPerfType: [],
    sequences: timelinesData,
  },
  initialPosition: [],
  initialEmployee: [],
  initialOptionPerfFormName: [],
  initialOptionPerfProgram: [],
  initialOptionPerfType: () => [],
  initialOptionPerfMeasurement: () => [],
  initialOptionPerfCategory: () => [],
  initialOptionPerfKRAInDataKRADetails: () => [],
  initialOptionPerfKRAInDataKPIDetails: () => [],
  initialOptionPerfKPIInDataKPIDetails: () => [],
  initialOptionPerfKPIInDataTargetDetails: () => [],
  initialOptionPerfTargetInDataTargetDetails: () => [],
});

interface PerfFormInitialValueContext {
  selectedPerfFormId?: string;
  children: JSX.Element;
}

export function PerfFormContextProvider({
  selectedPerfFormId = '',
  children,
}: PerfFormInitialValueContext) {
  const [programId, setProgramId] = useState<string>('');
  // get selected PerfForm data from backend
  const { performanceForm } = usePerformanceFormId(selectedPerfFormId);
  const { formEmpParticipant } = useEmpParticipantByForm(performanceForm?.id);
  const { formPosParticipant } = usePosParticipantByForm(performanceForm?.id);
  // const [perfFormInitialValue, setPerfFormInitialValue] =
  //   useState<PerfFromRequestDataFormProps>({
  //     performanceFormCode: '',
  //     isCaptureSiloamValue: false,
  //     perfProgramId: '',
  //     perfFormName: '',
  //     dataPosition: [],
  //     dataEmployee: [],
  //     dataPerfType: [],
  //     sequences: timelinesData,
  //   });
  const [perfFormPrevResponse, setPerfFormPrevResponse] =
    useState<PerfFormResponse>();
  // local memoized state value of initial dataPositions
  const initialPosition = useMemo((): DropdownOptions[] => {
    return (
      formPosParticipant?.map((i: any) => ({
        key: i?.position?.id,
        value: i?.position?.id,
        text: i?.position?.name,
      })) || []
    );
  }, [formPosParticipant]);

  // memoized local state value of initial dataEmployees
  const initialEmployee = useMemo((): DropdownOptions[] => {
    return (
      formEmpParticipant?.map((i: any) => ({
        key: i?.employee?.id,
        value: i?.employee?.id,
        text: i?.employee?.fullName,
      })) || []
    );
  }, [formEmpParticipant]);
  const dataSequence = useMemo(() => {
    return (
      performanceForm?.sequences?.map((val: any) => ({
        id: val.id,
        order: val.order,
        timeline: val.timeline,
        startDate: formatDate(val.startDate),
        endDate: dateLabeling(val.endDate),
        isActive: val.isActive,
      })) || []
    );
  }, [performanceForm]);
  // create initialValue of perfForm if API response available
  // diganti seperti ini karena code sebelumnya tidak update dataEmployee dan position, better menggunakan useMemo
  const perfFormValue = useMemo(
    () => ({
      performanceFormCode: performanceForm?.performanceFormCode || '',
      isCaptureSiloamValue: performanceForm?.isCaptureSiloamValue || false,
      perfFormName: performanceForm?.perfFormName.id || '',
      perfProgramId: performanceForm?.perfProgram.id || '',
      dataEmployee: formEmpParticipant?.map((i: any) => i?.employee?.id) || [],
      dataPosition: formPosParticipant?.map((i: any) => i?.position?.id) || [],
      finalResultCalc: performanceForm?.finalResultCalc,
      status: performanceForm?.status,
      dataPerfType: performanceForm?.dataPerfType.map(mapDataPerfType) || [],
      sequences: dataSequence,
    }),
    [performanceForm, formEmpParticipant, formPosParticipant],
  );

  if (performanceForm && perfFormPrevResponse !== performanceForm) {
    // setPerfFormInitialValue(perfFormValue);
    setPerfFormPrevResponse(performanceForm);
    setProgramId(performanceForm?.perfProgram?.id);
  }

  // memoized local state value of initial perfFormName
  const initialOptionPerfFormName = useMemo((): DropdownOptions[] => {
    const perfFormName = performanceForm?.perfFormName;
    return perfFormName && Object.keys(perfFormName).length > 0
      ? [
          {
            key: performanceForm?.perfFormName?.id,
            value: performanceForm?.perfFormName?.id,
            text: performanceForm?.perfFormName?.name,
          },
        ]
      : [];
  }, [performanceForm?.perfFormName]);

  // memoized local state value of initial perfProgram
  const initialOptionPerfProgram = useMemo((): DropdownOptions[] => {
    const perfProgram = performanceForm?.perfProgram;
    return perfProgram && Object.keys(perfProgram).length > 0
      ? [
          {
            key: perfProgram?.id,
            value: perfProgram?.id,
            text: perfProgram?.name,
          },
        ]
      : [];
  }, [performanceForm?.perfProgram]);

  // memoized local state value of initial perfTypeId
  const initialOptionPerfType = useCallback(
    (dataPerfTypeIdx: number): DropdownOptions[] => {
      const perfTypeId =
        performanceForm?.dataPerfType[dataPerfTypeIdx]?.perfTypeId;
      // console.log('performance type', perfTypeId, performanceForm);
      return perfTypeId && Object.keys(perfTypeId).length > 0
        ? [
            {
              key: perfTypeId?.id,
              value: perfTypeId?.id,
              text: perfTypeId?.name,
            },
          ]
        : [];
    },
    [performanceForm?.dataPerfType],
  );

  // memoized local state value of initial perfMeasurementTempId
  const initialOptionPerfMeasurement = useCallback(
    (dataPerfTypeIdx: number): DropdownOptions[] => {
      const perfMeasurementTempId =
        performanceForm?.dataPerfType[dataPerfTypeIdx]?.perfMeasurementTempId;
      return perfMeasurementTempId &&
        Object.keys(perfMeasurementTempId).length > 0
        ? [
            {
              key: perfMeasurementTempId?.id,
              value: perfMeasurementTempId?.id,
              text: perfMeasurementTempId?.templateName,
            },
          ]
        : [];
    },
    [performanceForm?.dataPerfType],
  );

  // memoized local state value of initial dataPerfType[dataPerfTypeIdx].dataCategory[dataCategoryIdx].perfCategory
  const initialOptionPerfCategory = useCallback(
    (dataPerfTypeIdx: number, dataCategoryIdx: number): DropdownOptions[] => {
      const perfCategory =
        performanceForm?.dataPerfType[dataPerfTypeIdx]?.dataCategory[
          dataCategoryIdx
        ]?.perfCategory;

      return perfCategory && Object.keys(perfCategory).length > 0
        ? [
            {
              key: perfCategory?.id,
              value: perfCategory?.id,
              text: perfCategory?.name,
            },
          ]
        : [];
    },
    [performanceForm?.dataPerfType],
  );

  // memoized local state value of initial dataPerfType[dataPerfTypeIdx].dataCategory[dataCategoryIdx].dataKRA.dataKRADetails[dataKRADetails].performanceKRA
  const initialOptionPerfKRAInDataKRADetails = useCallback(
    (
      dataPerfTypeIdx: number,
      dataCategoryIdx: number,
      dataKRADetailsIdx: number,
    ): DropdownOptions[] => {
      const performanceKRA =
        performanceForm?.dataPerfType[dataPerfTypeIdx]?.dataCategory[
          dataCategoryIdx
        ]?.dataKRA?.dataKRADetails[dataKRADetailsIdx]?.performanceKRA;

      // console.log('kra', performanceKRA)
      return performanceKRA && Object.keys(performanceKRA).length > 0
        ? [
            {
              key: performanceKRA?.id,
              value: performanceKRA?.id,
              text: performanceKRA?.name,
            },
          ]
        : [];
    },
    [performanceForm?.dataPerfType],
  );

  // memoized local state value of initial dataPerfType[dataPerfTypeIdx].dataCategory[dataCategoryIdx].dataKPI.dataKPIDetails[dataKPIDetails].performanceKRA
  const initialOptionPerfKRAInDataKPIDetails = useCallback(
    (
      dataPerfTypeIdx: number,
      dataCategoryIdx: number,
      dataKPIDetailsIdx: number,
    ): DropdownOptions[] => {
      const performanceKRA =
        performanceForm?.dataPerfType[dataPerfTypeIdx]?.dataCategory[
          dataCategoryIdx
        ]?.dataKPI?.dataKPIDetails[dataKPIDetailsIdx]?.performanceKRA;
      // eslint-disable-next-line no-console
      // console.log(performanceKRA?.name);
      return performanceKRA && Object.keys(performanceKRA).length > 0
        ? [
            {
              key: performanceKRA?.id,
              value: performanceKRA?.id,
              text: performanceKRA?.name,
            },
          ]
        : [];
    },
    [performanceForm?.dataPerfType],
  );

  // memoized local state value of initial dataPerfType[dataPerfTypeIdx].dataCategory[dataCategoryIdx].dataKPI.dataKPIDetails[dataKPIDetailsIdx].performanceKPI
  const initialOptionPerfKPIInDataKPIDetails = useCallback(
    (
      dataPerfTypeIdx: number,
      dataCategoryIdx: number,
      dataKPIDetailsIdx: number,
    ): DropdownOptions[] => {
      const performanceKPI =
        performanceForm?.dataPerfType[dataPerfTypeIdx]?.dataCategory[
          dataCategoryIdx
        ]?.dataKPI?.dataKPIDetails[dataKPIDetailsIdx]?.performanceKPI;

      return performanceKPI && Object.keys(performanceKPI).length > 0
        ? [
            {
              key: performanceKPI?.id,
              value: performanceKPI?.id,
              text: performanceKPI?.name,
            },
          ]
        : [];
    },
    [performanceForm?.dataPerfType],
  );

  // memoized local state value of initial dataPerfType[dataPerfTypeIdx].dataCategory[dataCategoryIdx].dataTarget.dataTargetDetails[dataTargetDetailsIdx].performanceKPI
  const initialOptionPerfKPIInDataTargetDetails = useCallback(
    (
      dataPerfTypeIdx: number,
      dataCategoryIdx: number,
      dataTargetDetailsIdx: number,
    ): DropdownOptions[] => {
      const performanceKPI =
        performanceForm?.dataPerfType[dataPerfTypeIdx]?.dataCategory[
          dataCategoryIdx
        ]?.dataTarget?.dataTargetDetails[dataTargetDetailsIdx]?.performanceKPI;
      // console.log('target detail', performanceKPI);
      return performanceKPI && Object.keys(performanceKPI).length > 0
        ? [
            {
              key: performanceKPI?.id,
              value: performanceKPI?.id,
              text: performanceKPI?.name,
            },
          ]
        : [];
    },
    [performanceForm?.dataPerfType],
  );

  // memoized local state value of initial dataPerfType[dataPerfTypeIdx].dataCategory[dataCategoryIdx].dataTarget.dataTargetDetails[dataTargetDetailsIdx].performanceTarget
  const initialOptionPerfTargetInDataTargetDetails = useCallback(
    (
      dataPerfTypeIdx: number,
      dataCategoryIdx: number,
      dataTargetDetailsIdx: number,
    ): DropdownOptions[] => {
      const performanceTarget =
        performanceForm?.dataPerfType[dataPerfTypeIdx]?.dataCategory[
          dataCategoryIdx
        ]?.dataTarget?.dataTargetDetails[dataTargetDetailsIdx]
          ?.performanceTarget;
      // console.log('target', performanceTarget);
      return performanceTarget && Object.keys(performanceTarget).length > 0
        ? [
            {
              key: performanceTarget?.id,
              value: performanceTarget?.id,
              text: performanceTarget?.name,
            },
          ]
        : [];
    },
    [performanceForm?.dataPerfType],
  );

  const value = {
    programId,
    setProgramId,
    performanceForm,
    initialPerfFormValue: perfFormValue,
    initialPosition,
    initialEmployee,
    initialOptionPerfFormName,
    initialOptionPerfProgram,
    initialOptionPerfType,
    initialOptionPerfMeasurement,
    initialOptionPerfCategory,
    initialOptionPerfKRAInDataKRADetails,
    initialOptionPerfKRAInDataKPIDetails,
    initialOptionPerfKPIInDataKPIDetails,
    initialOptionPerfKPIInDataTargetDetails,
    initialOptionPerfTargetInDataTargetDetails,
  };

  return (
    <PerfFormConntext.Provider value={value}>
      {children}
    </PerfFormConntext.Provider>
  );
}

export function usePerfFormContext() {
  return React.useContext(PerfFormConntext);
}
