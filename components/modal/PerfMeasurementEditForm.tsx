import {
  Button,
  Grid,
  Header,
  Icon,
  Modal,
  Form,
  Divider,
} from 'semantic-ui-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import InputDropdownRemote from '../InputDropdownRemote';
import { find, forEach, get, isEmpty } from 'lodash';
import TablePerformanceMeasurementCreate from '../table/PerformanceMeasurementCreate';
import Input from '../Input';
import {
  PerfMeasurementEdit,
  PerfMeasurementEditDataProps,
} from '../../lib/data/performanceMeasurementForm/perfMeasurementSectionForm';
import { getPerfTypeList } from '../../lib/data/performanceForm/usePerfTypeList';
import usePerformanceMeasurementForms from '../../lib/data/performanceMeasurementForm/usePerfMeasurementForms';
import usePerfMeasurementFormEdit from '../../lib/data/performanceMeasurementForm/usePerfMeasurementFormEdit';

const formPerfMasurementCreateSchema = yup.object({
  templateName: yup.string().required('Template name is required'),
  templateCode: yup.string().required('Template code is required'),
  year: yup.number().required('Year is required'),
  performanceType: yup.mixed().required('Performance Type is required'),
  dataGrade: yup
    .array()
    .of(
      yup.object({
        gradeCode: yup.mixed<string>().required('Grade Code is required'),
        gradeName: yup.mixed<string>().required('Grade Name is required'),
        point: yup.mixed<number>().required('Point is required'),
      }),
    )
    .test({
      name: 'check duplicate grade code',
      test: (val, ctx) => {
        const gradeCodes = val?.map((i) => i.gradeCode);
        const duplicateGradeCode: any[] = [];
        val?.forEach((item, index) => {
          if (gradeCodes?.indexOf(item.gradeCode) !== index) {
            duplicateGradeCode.push(index);
          }
        });

        if (duplicateGradeCode.length) {
          for (const item of duplicateGradeCode) {
            return ctx.createError({
              path: `dataGrade.${item}.gradeCode`,
              message: 'Grade code is duplicate',
            });
          }
        }
        return true;
      },
    }),
});

interface ModalPerfMeasurementCreateProps {
  id: string;
  isOpen: boolean;
  closePress: any;
}

const ModalPerfMeasurementEditForm = ({
  id,
  isOpen,
  closePress,
}: ModalPerfMeasurementCreateProps) => {
  const [initialOptionsPerfFormType, setInitialOptionsPerfFormType] =
    useState<any>([]);
  const { performanceMeasurement, isPerformanceMeasurementLoading } =
    usePerformanceMeasurementForms(id);
  const {
    performanceMeasurementEditPosting,
    isPerformanceMeasurementEditLoading,
  } = usePerfMeasurementFormEdit({
    onSuccess: closePress,
  });
  useEffect(() => {
    if (performanceMeasurement?.performanceType) {
      setInitialOptionsPerfFormType([
        {
          key: performanceMeasurement?.performanceType?.id,
          value: performanceMeasurement?.performanceType?.id,
          text: performanceMeasurement?.performanceType?.name,
        },
      ]);
    }
  }, [performanceMeasurement]);
  const initialMeasurementForm: PerfMeasurementEditDataProps = useMemo(() => {
    const dataGrade: PerfMeasurementEdit[] =
      performanceMeasurement?.dataGrade?.map((data: any) => ({
        id: data?.id,
        gradeCode: data?.gradeCode || null,
        gradeName: data?.gradeName || null,
        point: data?.point,
        isLabelDuplicated: false,
        isValueDuplicated: false,
      })) || [];
    const performanceTypeId = performanceMeasurement?.performanceType?.id;
    return {
      id: performanceMeasurement?.id,
      templateCode: performanceMeasurement?.templateCode,
      templateName: performanceMeasurement?.templateName,
      year: performanceMeasurement?.year,
      performanceType: performanceTypeId,
      dataGrade: dataGrade,
    };
  }, [performanceMeasurement]);
  const formikMeasurementFormEdit = useFormik({
    initialValues: initialMeasurementForm,
    enableReinitialize: true,
    validationSchema: formPerfMasurementCreateSchema,
    onSubmit: (values) => {
      const {
        id,
        templateCode,
        templateName,
        year,
        performanceType,
        dataGrade,
      } = values;
      const suggestConfigs: {
        gradeCode: string;
        gradeName: string;
        point: string;
      }[] = [];
      forEach(dataGrade, (cf) => {
        const { gradeName, gradeCode, point } = cf;
        if (gradeName) {
          suggestConfigs.push({
            gradeName: gradeName,
            gradeCode: gradeCode,
            point: point,
          });
        }
      });
      const payload = {
        id,
        templateCode,
        templateName,
        year,
        performanceType,
        dataGrade: suggestConfigs,
      };
      performanceMeasurementEditPosting(payload);
    },
  });
  const submit = useCallback(() => {
    formikMeasurementFormEdit.handleSubmit();
  }, [formikMeasurementFormEdit]);
  const isValid = useMemo(() => {
    const errors = formikMeasurementFormEdit.errors;
    const suggestConfigs =
      get(formikMeasurementFormEdit.values, 'dataGrade') || [];
    const findDuplicatedConfig = find(
      suggestConfigs,
      (cfg) =>
        cfg?.isLabelDuplicated ||
        cfg?.isValueDuplicated ||
        (!cfg?.gradeCode && cfg?.gradeName !== '') ||
        (cfg?.gradeCode && cfg?.gradeName === ''),
    );
    if (findDuplicatedConfig) {
      return false;
    }
    const config = get(formikMeasurementFormEdit?.values, 'dataGrade')?.find(
      (cf) => cf?.gradeCode && cf?.gradeName !== '',
    );
    if (!config) return false;
    return isEmpty(errors);
  }, [formikMeasurementFormEdit.values, formikMeasurementFormEdit.errors]);
  // const isConfigError = useMemo(() => {
  //   const config = get(formikMeasurementFormEdit?.values, 'dataGrade')?.find(
  //     (cf) => cf?.gradeCode && cf?.gradeName !== '',
  //   );
  //   if (!config) return true;
  //   return false;
  // }, [formikMeasurementFormEdit.values]);
  const dataGrade = useMemo(() => {
    return get(formikMeasurementFormEdit.values, 'dataGrade') || [];
  }, [formikMeasurementFormEdit.values]);

  return (
    <>
      <Modal
        onClose={closePress}
        open={isOpen}
        size="small"
        style={{ height: '55vh' }}
        closeOnDimmerClick={false}
      >
        <Modal.Header>
          <Header as={'h4'} color="black">
            <Icon name={'edit'} circular />
            <Header.Content>
              Form Edit
              <Header.Subheader> MEASUREMENT PERFORMANCE FORM</Header.Subheader>
            </Header.Content>
          </Header>
        </Modal.Header>
        <Modal.Content scrolling style={{ maxHeight: '78%' }}>
          <Form
            loading={
              isPerformanceMeasurementLoading ||
              isPerformanceMeasurementEditLoading
            }
          >
            <Grid>
              <Grid.Row columns={'equal'}>
                <Grid.Column>
                  <Input
                    placeholder={'Measurement Template Code'}
                    label={'Code'}
                    formik={formikMeasurementFormEdit}
                    name={'templateCode'}
                    type={'text'}
                  />
                  <Input
                    placeholder={'Measurement Template Name'}
                    label={'Name'}
                    formik={formikMeasurementFormEdit}
                    name={'templateName'}
                    type={'text'}
                  />
                  <Input
                    placeholder={'Year'}
                    label={'Year'}
                    formik={formikMeasurementFormEdit}
                    name={'year'}
                    type={'number'}
                  />
                  <InputDropdownRemote
                    placeholder={'Performance Form Type'}
                    label={'Performance Type'}
                    name={'performanceType'}
                    formik={formikMeasurementFormEdit}
                    apiFetcher={getPerfTypeList}
                    apiSearchKeys={['name']}
                    apiTextKey={'name'}
                    apiValueKey={'id'}
                    initialOptions={initialOptionsPerfFormType}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <TablePerformanceMeasurementCreate
              formik={formikMeasurementFormEdit}
              name={'dataGrade'}
              data={dataGrade}
              isLoading={isPerformanceMeasurementEditLoading}
            />
          </Form>
          <Divider hidden />
        </Modal.Content>
        <Modal.Actions
          style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}
        >
          <Grid columns="equal">
            <Grid.Column>
              <Button size={'large'} fluid onClick={closePress}>
                Close
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button
                fluid
                secondary
                size={'large'}
                type={'submit'}
                onClick={submit}
                disabled={!isValid}
              >
                Save
              </Button>
            </Grid.Column>
          </Grid>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default ModalPerfMeasurementEditForm;
