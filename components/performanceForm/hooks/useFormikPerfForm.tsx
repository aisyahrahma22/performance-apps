import * as yup from 'yup';
import { useFormik } from 'formik';
import { PerfFromRequestDataFormProps } from '../types/perfForm';

const PerfFormSchema = yup.object({
  perfProgramId: yup
    .string()
    .test('isPerfProgramId', 'Performance program is required', (value) => {
      return value ? true : false;
    }),
  performanceFormCode: yup
    .string()
    .required('Performance form code is required'),
  perfFormName: yup.mixed().required('Performance form type is required'),
  dataPosition: yup
    .array()
    .test('isDataPositionEmpty', 'Position is empty', (value, testContext) => {
      const { dataEmployee } = testContext.parent;
      if (!value) return false;
      if (dataEmployee?.length <= 0 && value) return value?.length > 0;
      return true;
    }),
  dataEmployee: yup
    .array()
    .test('isDataEmployeeEmpty', 'Employee is empty', (value, testContext) => {
      const { dataPosition } = testContext.parent;
      if (!value) return false;
      if (dataPosition?.length <= 0 && value) return value?.length > 0;
      return true;
    }),
  finalResultCalc: yup
    .mixed()
    .required('Final result term calculation is required'),
  dataPerfType: yup
    .array()
    .of(
      yup.object({
        weight: yup
          .mixed<number>()
          .required("Weight can't be empty")
          .test('weightLimit', 'Weight input is more than 100%', (value, _) => {
            if (value && value > 100) return false;
            return true;
          }),
        isMidYearScore: yup.boolean(),
        isKRA: yup.boolean(),
        isTarget: yup.boolean(),
        perfTypeId: yup.mixed().required('Performance type name is required'),
        perfMeasurementTempId: yup
          .mixed()
          .required('Performance measurement template is required'),
        isCategory: yup.boolean(),
        isCategoryWeightCalc: yup.boolean(),
        isKPIWeightCalc: yup.boolean(),
        dataCategory: yup
          .array()
          .of(
            yup.object({
              perfCategory: yup
                .string()
                .when('localIsCategory', (localIsCategory, schema) => {
                  return localIsCategory
                    ? schema.required('Category name is required')
                    : schema;
                }),
              categoryWeight: yup
                .mixed<number>()
                .test(
                  'weightvalidation',
                  ' Total weight category must be 100%',
                  (_value, testContext: any) => {
                    const { isCategory, dataCategory, isCategoryWeightCalc } =
                      testContext.from[1].value;
                    const total = dataCategory.reduce(
                      (total: any, item: { categoryWeight: any }) => {
                        return total + item.categoryWeight;
                      },
                      0,
                    );
                    if (isCategory === true && isCategoryWeightCalc)
                      return total && total == 100 ? true : false;
                    return true;
                  },
                ),
              dataKPI: yup
                .object({
                  typeMaxKPICount: yup
                    .mixed<string>()
                    .test(
                      'isTypeMaxKPICount',
                      "Maximum KPI count can't be empty",
                      (value, testContext) => {
                        const { isUserDefine } = testContext.parent;
                        if (isUserDefine) return value ? true : false;
                        return true;
                      },
                    ),
                  typeMaxKPIWeight: yup
                    .mixed<string>()
                    .test(
                      'isTypeMaxKPIWeight',
                      "Maximum KPI weight can't be empty",
                      (value, testContext) => {
                        const { isUserDefine } = testContext.parent;
                        if (isUserDefine) return value ? true : false;
                        return true;
                      },
                    ),
                  minKPICountInput: yup
                    .mixed<number>()
                    .test(
                      'isMinKPICountInput',
                      'Minimum KPI count input are more/less than the limit',
                      (value, testContext) => {
                        const {
                          isUserDefine,
                          typeMaxKPICount,
                          maxKPICountInput,
                        } = testContext.parent;

                        if (isUserDefine && typeMaxKPICount === 'LIMITED')
                          return value &&
                            value >= 1 &&
                            value <= maxKPICountInput
                            ? true
                            : false;
                        return true;
                      },
                    ),
                  maxKPICountInput: yup
                    .mixed<number>()
                    .test(
                      'isMaxKPICountInput',
                      'Maximum KPI count input are more/less than the limit',
                      (value, testContext) => {
                        const {
                          isUserDefine,
                          typeMaxKPICount,
                          minKPICountInput,
                        } = testContext.parent;

                        if (isUserDefine && typeMaxKPICount === 'LIMITED')
                          return value &&
                            value >= 1 &&
                            value >= minKPICountInput
                            ? true
                            : false;
                        return true;
                      },
                    ),
                  minKPIWeightInput: yup
                    .mixed<number>()
                    .test(
                      'isMinKPIWeightInput',
                      'Minimum KPI weight input are more/less than the limit',
                      (value, testContext) => {
                        const {
                          isUserDefine,
                          typeMaxKPIWeight,
                          maxKPIWeightInput,
                        } = testContext.parent;

                        if (isUserDefine && typeMaxKPIWeight === 'LIMITED')
                          return value &&
                            value >= 1 &&
                            value <= 100 &&
                            value <= maxKPIWeightInput
                            ? true
                            : false;
                        return true;
                      },
                    ),
                  maxKPIWeightInput: yup
                    .mixed<number>()
                    .test(
                      'isMaxKPIWeightInput',
                      'Maximum KPI weight more/less than the limit',
                      (value, testContext) => {
                        const {
                          isUserDefine,
                          typeMaxKPIWeight,
                          minKPIWeightInput,
                        } = testContext.parent;

                        if (isUserDefine && typeMaxKPIWeight === 'LIMITED')
                          return value &&
                            value >= 1 &&
                            value <= 100 &&
                            value >= minKPIWeightInput
                            ? true
                            : false;
                        return true;
                      },
                    ),
                  dataKPIDetails: yup
                    .array()
                    .of(
                      yup.object({
                        isPredefine: yup.boolean(),
                        weight: yup
                          .mixed<number>()
                          .test(
                            'dataKPIWeightLimit',
                            'Weight input is more than the limit',
                            (value, testContext: any) => {
                              const { isUserDefine } =
                                testContext.from[1].value;

                              if (isUserDefine) return true;

                              return value && value >= 1 && value <= 100
                                ? true
                                : false;
                            },
                          ),
                        performanceKPI: yup
                          .string()
                          .required('KPI is required'),
                        performanceKRA: yup
                          .string()
                          .test(
                            'isPerformanceKRA',
                            'KRA is required',
                            (value, testContext) => {
                              const { localIsKRA } = testContext.parent;
                              if (localIsKRA) return value ? true : false;
                              return true;
                            },
                          ),
                      }),
                    )
                    .test(
                      'isDataKPIDetails',
                      'KPI Details have invalid sum of item',
                      (value, testContext: any) => {
                        const { isUserDefine, localIsKPI } = testContext.parent;
                        if (localIsKPI && !isUserDefine) {
                          if (!value) return false;
                          return value?.length > 0;
                        }
                        return true;
                      },
                    ),
                })
                .required('KPI information must be available'),
              dataKRA: yup
                .object({
                  isUserDefine: yup.boolean(),
                  isEditable: yup.boolean(),
                  isSelection: yup.boolean(),
                  // TODO: investigate test isUserDefine was turning its value to true when it is false
                  dataKRADetails: yup
                    .array()
                    .of(
                      yup.object({
                        isPredefine: yup.boolean(),
                        performanceKRA: yup
                          .mixed()
                          .required("KRA can't be empty"),
                      }),
                    )
                    .test(
                      'isDataKRADetails',
                      'KRA Details must be available',
                      (value, testContext) => {
                        const { isUserDefine, localIsKRA } = testContext.parent;
                        if (localIsKRA && !isUserDefine) {
                          if (!value) return false;
                          return value?.length > 0;
                        }
                        return true;
                      },
                    ),
                })
                .test(
                  'isDataKRA',
                  'KRA information must be available',
                  (value, testContext) => {
                    const { localIsCategory, localIsKRA } = testContext.parent;
                    if (localIsCategory && localIsKRA) {
                      const isUserDefine = value.isUserDefine;
                      const dataKRADetails = value.dataKRADetails;
                      return !isUserDefine
                        ? dataKRADetails
                          ? dataKRADetails?.length > 0
                          : false
                        : true;
                    }
                    return true;
                  },
                ),
              dataTarget: yup
                .object({
                  isUserDefine: yup.boolean(),
                  isEditable: yup.boolean(),
                  // TODO: investigate test isUserDefine was turning its value to true when it is false
                  dataTargetDetails: yup.array().of(
                    yup.object({
                      performanceKPI: yup
                        .mixed<string>()
                        .required("KPI can't be empty"),
                      performanceTarget: yup
                        .mixed<string>()
                        .required("Target can't be empty"),
                    }),
                  ),
                  // .test(
                  //   'isDataTargetDetails',
                  //   'Target Details must be available',
                  //   (value, testContext) => {
                  //     const { isUserDefine, localIsTarget } =
                  //       testContext.parent;
                  //     if (localIsTarget && !isUserDefine) {
                  //       if (!value) return false;
                  //       return value?.length > 0;
                  //     }
                  //     return true;
                  //   },
                  // ),
                })
                .test(
                  'isDataTarget',
                  'Target information must be available',
                  (value, testContext) => {
                    const { localIsCategory, localIsTarget } =
                      testContext.parent;
                    if (localIsCategory && localIsTarget) {
                      const isUserDefine = value.isUserDefine;
                      const dataTargetDetails = value.dataTargetDetails;
                      return !isUserDefine
                        ? dataTargetDetails
                          ? dataTargetDetails?.length > 0
                          : false
                        : true;
                    }
                    return true;
                  },
                ),
            }),
          )
          .min(1, 'No data category is available'),
      }),
    )
    .min(1, 'No performance type is available'),
  sequences: yup
    .array()
    .of(
      yup.object({
        startDate: yup.string().when('isActive', (isActive, schema) => {
          return isActive
            ? schema.required('Start date is required').nullable()
            : schema.nullable();
        }),
        endDate: yup.string().when('isActive', (isActive, schema) => {
          return isActive
            ? schema.required('End date is required').nullable()
            : schema.nullable();
        }),
        isActive: yup.boolean(),
      }),
    )
    .test(
      'sequences',
      'Timeline & Sequence configuration cannot be empty',
      (value: any) => {
        const seq =
          value?.filter((v: { isActive: boolean }) => v?.isActive == true) ||
          [];
        if (seq?.length <= 1) {
          return false;
        }
        return true;
      },
    ),
});

function useFormikPerfForm(
  initialValue: PerfFromRequestDataFormProps,
  onSubmitCb: (value: PerfFromRequestDataFormProps) => void,
  options?: {
    validateOnMount?: boolean;
  },
) {
  const formikPerformanceForm = useFormik({
    initialValues: initialValue,
    validationSchema: PerfFormSchema,
    enableReinitialize: true,
    validateOnMount: options && options?.validateOnMount,
    onSubmit: (values) => {
      onSubmitCb(values);
    },
  });

  return formikPerformanceForm;
}

export default useFormikPerfForm;
