import {
  Button,
  Grid,
  Header,
  Icon,
  Modal,
  Form,
  Divider,
} from 'semantic-ui-react';
import React, { useCallback, useMemo } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import usePerfMeasurementFormCreate from '../../lib/data/performanceMeasurementForm/usePerfMeasurementFormsCreate';
import InputDropdownRemote from '../InputDropdownRemote';
import { find, forEach, get, isEmpty, map } from 'lodash';
import TablePerformanceMeasurementCreate from '../table/PerformanceMeasurementCreate';
import Input from '../Input';
import {
  PerfMeasurementRequestDataProps,
  PerfMeasurementSec,
} from '../../lib/data/performanceMeasurementForm/perfMeasurementSectionForm';
import usePerformanceMeasurmentResultsPrev from '../../lib/data/performanceMeasurementForm/usePerfMeasurementResultPrev';
import { getPerfTypeList } from '../../lib/data/performanceForm/usePerfTypeList';

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
  isOpen: boolean;
  closePress: any;
}

const ModalPerfMeasurementCreate = ({
  isOpen,
  closePress,
}: ModalPerfMeasurementCreateProps) => {
  const {
    perfMeasurementFormCreatePosting,
    isPerfMeasurementFormCreateLoading,
  } = usePerfMeasurementFormCreate({
    onSuccess: closePress,
  });
  // const { perfFormLists } = usePerfFormType();
  const { perfMeasurementResultsPrev } = usePerformanceMeasurmentResultsPrev();
  const initialMeasurementFormCreate = useMemo(() => {
    const prevConfigs =
      map(perfMeasurementResultsPrev, (srp) => {
        const config: PerfMeasurementSec = {
          id: srp?.id,
          gradeCode: srp?.gradeCode,
          gradeName: srp?.gradeName,
          point: srp?.point,
        };
        return config;
      }) || [];
    const tempConfig: PerfMeasurementSec = {
      id: `new-perf-mess-grade-${new Date().getTime()}-${
        prevConfigs?.length || 0
      }`,
      gradeCode: '',
      gradeName: '',
      point: '',
    };
    const requestData: PerfMeasurementRequestDataProps = {
      templateCode: '',
      templateName: '',
      year: '',
      // performanceType: perfFormLists?.map((i: any) => i.name) || [],
      performanceType: '',
      dataGrade: [...prevConfigs, tempConfig],
    };
    return requestData;
  }, [
    //  `perfFormLists,
    perfMeasurementResultsPrev,
  ]);
  const formikMeasurementFormCreate = useFormik({
    initialValues: initialMeasurementFormCreate,
    enableReinitialize: true,
    onSubmit: (values) => {
      const { templateCode, templateName, year, performanceType, dataGrade } =
        values;
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
            point: String(point),
          });
        }
      });
      const payload = {
        templateCode,
        templateName,
        year,
        performanceType,
        dataGrade: suggestConfigs,
      };
      perfMeasurementFormCreatePosting(payload);
    },
    validationSchema: formPerfMasurementCreateSchema,
  });
  const dataGrade = useMemo(() => {
    return get(formikMeasurementFormCreate.values, 'dataGrade') || [];
  }, [formikMeasurementFormCreate.values]);

  const submit = useCallback(async () => {
    formikMeasurementFormCreate.handleSubmit();
  }, [formikMeasurementFormCreate]);

  const isValid = useMemo(() => {
    const errors = formikMeasurementFormCreate.errors;
    const suggestConfigs =
      get(formikMeasurementFormCreate.values, 'dataGrade') || [];
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
    const config = get(formikMeasurementFormCreate?.values, 'dataGrade')?.find(
      (cf) => cf?.gradeCode && cf?.gradeName !== '',
    );
    if (!config) return false;
    return isEmpty(errors);
  }, [formikMeasurementFormCreate.values, formikMeasurementFormCreate.errors]);

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
            <Icon name={'plus square outline'} circular />
            <Header.Content>
              Form Create
              <Header.Subheader> MEASUREMENT PERFORMANCE FORM</Header.Subheader>
            </Header.Content>
          </Header>
        </Modal.Header>
        <Modal.Content scrolling style={{ maxHeight: '78%' }}>
          <Form loading={isPerfMeasurementFormCreateLoading}>
            <Grid>
              <Grid.Row columns={'equal'}>
                <Grid.Column>
                  <Input
                    placeholder={'Measurement Template Code'}
                    label={'Code'}
                    formik={formikMeasurementFormCreate}
                    name={'templateCode'}
                    type={'text'}
                  />
                  <Input
                    placeholder={'Measurement Template Name'}
                    label={'Name'}
                    formik={formikMeasurementFormCreate}
                    name={'templateName'}
                    type={'text'}
                  />
                  <Input
                    placeholder={'Year'}
                    label={'Year'}
                    formik={formikMeasurementFormCreate}
                    name={'year'}
                    type={'number'}
                  />
                  <InputDropdownRemote
                    placeholder={'Performance Type'}
                    label={'Performance Type'}
                    name={'performanceType'}
                    formik={formikMeasurementFormCreate}
                    apiFetcher={getPerfTypeList}
                    apiSearchKeys={['name']}
                    apiTextKey={'name'}
                    apiValueKey={'id'}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <TablePerformanceMeasurementCreate
              formik={formikMeasurementFormCreate}
              name={'dataGrade'}
              data={dataGrade}
              isLoading={isPerfMeasurementFormCreateLoading}
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

export default ModalPerfMeasurementCreate;
