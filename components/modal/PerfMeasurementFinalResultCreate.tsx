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
import usePerfMeasurementFinalCreate from '../../lib/data/perfMeasurementFinalResult/usePerfMeasurementFinalCreate';
import { forEach, get, map } from 'lodash';
import {
  PerfMeasurementFinalRequestDataProps,
  PerfMeasurementFinalSec,
} from '../../lib/data/perfMeasurementFinalResult/perfMeasurementSectionFinal';
import usePerfMeasurementResultsPrevFinalResult from '../../lib/data/perfMeasurementFinalResult/usePerfMeasurementFinalGradePrev';
import { useFormik } from 'formik';
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

interface ModalPrerfMeasurementCreateProps {
  isOpen: boolean;
  closePress: any;
}

const ModalPerfMeasurementFinalResultCreate = ({
  isOpen,
  closePress,
}: ModalPrerfMeasurementCreateProps) => {
  const {
    perfMeasurementFinalCreatePosting,
    isPerfMeasurementFinalCreateLoading,
  } = usePerfMeasurementFinalCreate({
    onSuccess: closePress,
  });

  const { perfMeasurementResultsPrevFinal } =
    usePerfMeasurementResultsPrevFinalResult();

  const initialFinalResultCreate = useMemo(() => {
    const prevConfigs =
      map(perfMeasurementResultsPrevFinal, (srp) => {
        const config: PerfMeasurementFinalSec = {
          // id: srp?.id,
          codeGrade: srp?.codeGrade,
          codeName: srp?.codeName,
          minimum: srp?.minimum,
          maximum: srp?.maximum,
        };
        return config;
      }) || [];

    const tempConfig: PerfMeasurementFinalSec = {
      // id: `new-grade-data-${new Date().getTime()}-${prevConfigs?.length || 0}`,
      codeGrade: '',
      codeName: '',
      minimum: '',
      maximum: '',
    };

    const requestData: PerfMeasurementFinalRequestDataProps = {
      measurementCode: '',
      measurementName: '',
      year: '',
      dataGradeFinal: [...prevConfigs, tempConfig],
    };
    return requestData;
  }, [perfMeasurementResultsPrevFinal]);

  const formikFinalResultCreate = useFormik({
    validateOnChange: false,
    initialValues: initialFinalResultCreate,
    enableReinitialize: true,
    onSubmit: (values) => {
      const { measurementCode, measurementName, year, dataGradeFinal } = values;
      const suggestConfigs: {
        order: number;
        codeGrade: string;
        codeName: string;
        minimum: string;
        maximum: string;
      }[] = [];

      forEach(dataGradeFinal, (cf, idx) => {
        const { codeName, codeGrade, minimum, maximum } = cf;
        if (
          codeName &&
          (String(minimum) ||
            String(maximum) ||
            maximum === '' ||
            minimum === '')
        ) {
          suggestConfigs.push({
            order: idx + 1,
            codeName: codeName,
            codeGrade: codeGrade,
            minimum: String(minimum),
            maximum: String(maximum),
          });
        }
      });
      const payload = {
        measurementCode,
        measurementName,
        year,
        dataGradeFinal: suggestConfigs,
      };
      perfMeasurementFinalCreatePosting(payload);
    },
    validationSchema: formPerfMasurementCreateSchema,
  });

  const submit = useCallback(async () => {
    const formValidation = await formikFinalResultCreate.validateForm();

    if (Object.keys(formValidation).length > 0)
      return toast.error(
        'Form are still incomplete. please check the conresponding error in the value!',
      );
    else formikFinalResultCreate.handleSubmit();
  }, [formikFinalResultCreate]);

  const dataGradeFinal = useMemo(() => {
    return get(formikFinalResultCreate.values, 'dataGradeFinal') || [];
  }, [formikFinalResultCreate.values]);

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
              <Header.Subheader>
                {' '}
                FINAL RESULT PERFORMANCE FORM
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Modal.Header>
        <Modal.Content scrolling style={{ maxHeight: '78%' }}>
          <Form loading={isPerfMeasurementFinalCreateLoading}>
            <Grid>
              <Grid.Row columns={'equal'}>
                <Grid.Column>
                  <Input
                    placeholder={'Measurement Template Code'}
                    label={'Code'}
                    formik={formikFinalResultCreate}
                    name={'measurementCode'}
                    type={'text'}
                  />
                  <Input
                    placeholder={'Measurement Template Name'}
                    label={'Name'}
                    formik={formikFinalResultCreate}
                    name={'measurementName'}
                    type={'text'}
                  />
                  <Input
                    placeholder={'Year'}
                    label={'Year'}
                    formik={formikFinalResultCreate}
                    name={'year'}
                    type={'number'}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <div style={{marginTop: '10px', color: 'black', fontWeight: 'bold'}}>GRADE</div>
            <TablePerfMeasurementFinalResultCreate
              formik={formikFinalResultCreate}
              name={'dataGradeFinal'}
              data={dataGradeFinal}
              isLoading={isPerfMeasurementFinalCreateLoading}
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

export default ModalPerfMeasurementFinalResultCreate;
