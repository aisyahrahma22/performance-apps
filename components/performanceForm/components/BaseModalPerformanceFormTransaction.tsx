import { FormikProps } from 'formik';
import React from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Loader,
  Modal,
  Segment,
} from 'semantic-ui-react';
import { finalResultList } from '../../../lib/data/performanceForm/finalResult';
import { getPerfNameList } from '../../../lib/data/performanceForm/usePerfNameList';
import { getPerfProgramList } from '../../../lib/data/performanceForm/usePerfProgramList';
import Input from '../../Input';
import InputDropdownRemote from '../../InputDropdownRemote';
import { usePerfFormContext } from '../contexts/PerfFormContext';
import FirstSectionPerfFormCreate from './FirstSectionPerfFormCreate';
import { PerfFromRequestDataFormProps } from '../types/perfForm';
import PerfFromTypeDetail from './PerfFromTypeDetail';
import TableTimelineSequence from './TimelineSequence';
import { PerfFormResponse } from '../../../lib/data/performanceForm/usePerformanceForm';
import { PerfFormStatusEnum } from '../../../lib/enums/PerfForm';
import { getEmployees } from '../../../lib/data/employee/useEmployees';

interface BaseModalPerfFormTranscProps {
  formik: FormikProps<PerfFromRequestDataFormProps>;
  isOpen: boolean;
  closePress:
    | ((event: React.MouseEvent<HTMLElement, MouseEvent>, data: any) => void)
    | undefined;
  isModalEdit?: boolean;
  performanceFormResponse: PerfFormResponse | undefined;
  isPerformanceFormTranscLoading: boolean;
  performanceProgram: any;
  onChangePerfProgram: (value: any) => void;
  submitForm: (status: PerfFormStatusEnum) => Promise<void>;
  isLoading: boolean;
}

function BaseModalPerformanceFormTransaction({
  formik,
  isOpen,
  closePress,
  isModalEdit = false,
  performanceFormResponse,
  isPerformanceFormTranscLoading,
  performanceProgram,
  onChangePerfProgram,
  submitForm,
  isLoading,
}: BaseModalPerfFormTranscProps) {
  const {
    initialOptionPerfProgram,
    initialOptionPerfFormName,
    initialEmployee,
  } = usePerfFormContext();

  return (
    <Modal
      onClose={closePress}
      open={isOpen}
      size={'large'}
      style={{ height: '93%', top: '1%' }}
      closeOnDimmerClick={false}
      closeOnEscape={false}
    >
      <Modal.Header style={{ maxHeight: '13%' }}>
        <Header as={'h4'} color="black">
          <Icon name={isModalEdit ? 'edit' : 'plus square outline'} circular />
          <Header.Content>
            Form {isModalEdit ? 'Edit' : 'Create'}
            <Header.Subheader>Performance Review Form</Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>

      <Modal.Content scrolling className={`modal-content-perf-form-mid`}>
        <Segment clearing basic>
          <div style={{ marginBottom: '20px' }}>
            <Header as={'h4'} color={'blue'}>
             PROGRAM  PERFORMANCE 
            </Header>
          </div>
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <Form>
                  <InputDropdownRemote
                    placeholder={`Choose Program`}
                    label={`Program Performance `}
                    name={`perfProgramId`}
                    formik={formik}
                    apiFetcher={getPerfProgramList}
                    apiSearchKeys={['name', 'date']}
                    apiTextKey={'name'}
                    apiValueKey={'id'}
                    multiple={false}
                    onChange={onChangePerfProgram}
                    initialOptions={isModalEdit ? initialOptionPerfProgram : []}
                  />
                </Form>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                {performanceProgram && (
                  <FirstSectionPerfFormCreate
                    formik={formik}
                    data={performanceProgram}
                  />
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        <Segment clearing basic className={'nopaddingh'}>
          <Form>
            <div style={{ marginBottom: '20px' }}>
              <Input
                placeholder={`Performance Form Code`}
                label={`Performance Form Code`}
                name={`performanceFormCode`}
                formik={formik}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <InputDropdownRemote
                placeholder={`Select Performance Form Type`}
                label={`Performance Form Type`}
                name={`perfFormName`}
                formik={formik}
                apiFilter={{ isActive: true, flag: '2' }}
                apiFetcher={getPerfNameList}
                apiSearchKeys={['name']}
                apiTextKey={'name'}
                apiValueKey={'id'}
                initialOptions={isModalEdit ? initialOptionPerfFormName : []}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <InputDropdownRemote
                  placeholder={`Select Targeted Participant`}
                  label={`Targeted Participant`}
                  name={`dataEmployee`}
                  formik={formik}
                  apiFilter={{
                    isActive: true,
                  }}
                  apiFetcher={getEmployees}
                  apiSearchKeys={['codeName']}
                  apiTextKey={['code', 'fullName']}
                  apiValueKey={'id'}
                  multiple
                  initialOptions={isModalEdit ? initialEmployee : []}
                />
              </div>
            <Input
              placeholder={`Select Final Result`}
              label={`Final Result`}
              name={`finalResultCalc`}
              formik={formik}
              select
              options={finalResultList}
            />
          </Form>
        </Segment>
        <TableTimelineSequence
          isModalView={false}
          formik={formik}
          sequencesResponse={performanceFormResponse?.sequences}
        />
        {performanceProgram && (
          <PerfFromTypeDetail
            isModalEdit={isModalEdit}
            formik={formik}
            loading={isPerformanceFormTranscLoading}
            performanceProgram={performanceProgram}
          />
        )}
      </Modal.Content>
      <Modal.Actions className={'position-abs-bottom'}>
        <Grid columns="equal">
          <Grid.Column>
            <Button
              size={'large'}
              fluid
              onClick={closePress}
              disabled={isLoading}
            >
              {isLoading && <Loader active />}
              Close
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button
              fluid
              size={'large'}
              type={'submit'}
              form={'perf-form-create-form'}
              color='blue'
              onClick={() => submitForm(PerfFormStatusEnum.DRAFT)}
              disabled={!formik.isValid || isLoading}
            >
              {isLoading && <Loader active />}
              Save as Draft
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button
              fluid
              secondary
              disabled={!formik.isValid || isLoading}
              size={'large'}
              type={'submit'}
              form={'perf-form-create-form'}
              onClick={() => submitForm(PerfFormStatusEnum.PUBLISHED)}
            >
              Save
            </Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
}

export default BaseModalPerformanceFormTransaction;
