import React, { useMemo, useCallback } from 'react';
import {
  Button,
  Divider,
  Form,
  Grid,
  Header,
  Icon,
  Modal,
} from 'semantic-ui-react';
import Input from '../Input';
import TablePerfMeasurementFinalResultCreate from '../table/PerfMeasurementFinalResultCreate';
import * as yup from 'yup';
import { forEach, get } from 'lodash';
import {
  PerfMeasurementFinalEdit,
  PerfMeasurementFinalEditDataProps,
} from '../../lib/data/perfMeasurementFinalResult/perfMeasurementSectionFinal';
import { useFormik } from 'formik';
import usePerformanceMeasurementFinalId from '../../lib/data/perfMeasurementFinalResult/usePerfMeasurementFinalId';
import usePerformanceMeasurementFinalEdit from '../../lib/data/perfMeasurementFinalResult/usePerfMeasurementFinalEdit';
import { toast } from 'react-toastify';

const formPerfMasurementCreateSchema = yup.object({
  measurementName: yup.string().required('Measurement name is required'),
  measurementCode: yup.string().required('Measurement code is required'),
  year: yup.number().required('Year is required'),
  dataGradeFinal: yup
    .array()
    .of(
      yup.object({
        codeGrade: yup.string().required('Grade Code is required'),
        codeName: yup.mixed<string>().required('Grade Name is required'),
        minimum: yup.mixed<number>().required('Minimum is required'),
        maximum: yup.mixed<number>().required('Maximum is required'),
      }),
    )
    .test({
      name: 'check duplicate grade code',
      test: (val, ctx) => {
        const gradeCodes = val?.map((i) => i.codeGrade);
        const duplicateGradeCode: any[] = [];
        val?.forEach((item, index) => {
          if (gradeCodes?.indexOf(item.codeGrade) !== index) {
            duplicateGradeCode.push(index);
          }
        });

        if (duplicateGradeCode.length) {
          for (const item of duplicateGradeCode) {
            return ctx.createError({
              path: `dataGradeFinal.${item}.codeGrade`,
              message: 'Grade code is duplicate',
            });
          }
        }
        return true;
      },
    }),
});

interface ModalPerfMeasurementEditProps {
  id: string;
  isOpen: boolean;
  closePress: any;
}

const ModalPerfMeasurementFinalResultEditForm = ({
  id,
  isOpen,
  closePress,
}: ModalPerfMeasurementEditProps) => {
  const { performanceMeasurementFinal, isPerformanceMeasurementFinalLoading } =
    usePerformanceMeasurementFinalId(id);

  const {
    performanceMeasurementFinalEditPosting,
    isPerformanceMeasurementFinalEditLoading,
  } = usePerformanceMeasurementFinalEdit({
    onSuccess: closePress,
  });

  const initialMeasurementForm: PerfMeasurementFinalEditDataProps =
    useMemo(() => {
      const dataGrades: PerfMeasurementFinalEdit[] =
        performanceMeasurementFinal?.dataGradeFinal?.map((data: any) => ({
          id: data?.id,
          codeGrade: data?.codeGrade || null,
          codeName: data?.codeName || null,
          maximum: data?.maximum,
          minimum: data?.minimum,
          isLabelDuplicated: false,
          isValueDuplicated: false,
        })) || [];

      return {
        id: performanceMeasurementFinal?.id,
        measurementCode: performanceMeasurementFinal?.measurementCode,
        measurementName: performanceMeasurementFinal?.measurementName,
        year: performanceMeasurementFinal?.year,
        dataGradeFinal: dataGrades,
      };
    }, [performanceMeasurementFinal]);

  const formikMeasurementFormEdit = useFormik({
    validateOnChange: false,
    initialValues: initialMeasurementForm,
    enableReinitialize: true,
    validationSchema: formPerfMasurementCreateSchema,
    onSubmit: (values) => {
      const { id, measurementCode, measurementName, year, dataGradeFinal } =
        values;

      const suggestConfigs: {
        order: number;
        codeGrade: string;
        codeName: string;
        maximum: string;
        minimum: string;
      }[] = [];

      forEach(dataGradeFinal, (cf, idx) => {
        const { codeName, codeGrade, maximum, minimum } = cf;
        if (
          codeName &&
          ((String(maximum) && String(minimum)) ||
            maximum === '' ||
            minimum === '')
        ) {
          suggestConfigs.push({
            order: idx + 1,
            codeName: codeName,
            codeGrade: codeGrade,
            maximum: String(maximum),
            minimum: String(minimum),
          });
        }
      });

      const payload = {
        id,
        measurementCode,
        measurementName,
        year,
        dataGradeFinal: suggestConfigs,
      };
      performanceMeasurementFinalEditPosting(payload);
    },
  });

  const submit = useCallback(async () => {
    const formValidation = await formikMeasurementFormEdit.validateForm();

    if (Object.keys(formValidation).length > 0)
      return toast.error(
        'Form are still incomplete. please check the conresponding error in the value!',
      );
    else formikMeasurementFormEdit.handleSubmit();
  }, [formikMeasurementFormEdit]);

  const dataGradeFinal = useMemo(() => {
    return get(formikMeasurementFormEdit.values, 'dataGradeFinal') || [];
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
              <Header.Subheader>
                {' '}
                FINAL RESULT PERFORMANCE FORM
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Modal.Header>
        <Modal.Content scrolling style={{ maxHeight: '78%' }}>
          <Form
            loading={
              isPerformanceMeasurementFinalLoading ||
              isPerformanceMeasurementFinalEditLoading
            }
          >
            <Grid>
              <Grid.Row columns={'equal'}>
                <Grid.Column>
                  <Input
                    placeholder={'Measurement Template Code'}
                    label={'Code'}
                    formik={formikMeasurementFormEdit}
                    name={'measurementCode'}
                    type={'text'}
                  />
                  <Input
                    placeholder={'Measurement Template Name'}
                    label={'Name'}
                    formik={formikMeasurementFormEdit}
                    name={'measurementName'}
                    type={'text'}
                  />
                  <Input
                    placeholder={'Year'}
                    label={'Year'}
                    formik={formikMeasurementFormEdit}
                    name={'year'}
                    type={'number'}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <div style={{marginTop: '10px', color: 'black', fontWeight: 'bold'}}>GRADE</div>
            <TablePerfMeasurementFinalResultCreate
              formik={formikMeasurementFormEdit}
              name={'dataGradeFinal'}
              data={dataGradeFinal}
              isLoading={isPerformanceMeasurementFinalEditLoading}
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
                form={`perf-measurement-final-create`}
                onClick={submit}
                // disabled={!isValid}
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

export default ModalPerfMeasurementFinalResultEditForm;
