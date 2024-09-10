import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Modal,
  Table,
  Segment,
} from 'semantic-ui-react';
import React from 'react';
import { useFormik } from 'formik';
import Input from '../Input';
import * as yup from 'yup';
import usePerformancesCreate from '../../lib/data/performance/usePerformancesCreate';
import { RenderGuard } from '../RenderGuard';
import { RightEnum } from '../../lib/enums/RightEnum';
import TableHeaderCell from '../TableHeaderCell';
import InputDropdownRemote from '../InputDropdownRemote';
import { getPerformanceFormType } from '../../lib/data/performanceFormType/usePerformanceFormType';

interface ModalPerformanceMeasurementCreateProps {
  isOpen: boolean;
  closePress: any;
}

const formPerformanceCreateSchema = yup.object({
  code: yup.string().required('Code is required'),
  name: yup.string().required('Name is required'),
});

const ModalMeasurementPerformanceCreate = ({
  isOpen,
  closePress,
}: ModalPerformanceMeasurementCreateProps) => {
  const { performancesCreatePosting, isPerformancesCreateLoading } =
    usePerformancesCreate({
      onSuccess: closePress,
    });

  const formikPerformanceFormTypeCreate = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      performancesCreatePosting(values);
    },
    validationSchema: formPerformanceCreateSchema,
  });

  return (
    <Modal
      onClose={closePress}
      open={isOpen}
      size="small"
      closeOnDimmerClick={false}
    >
      <Modal.Header>
        <Header as={'h4'} color="teal">
          <Icon name={'add'} circular />
          <Header.Content>
            Form Create
            <Header.Subheader>
              MEASUREMENT TEMPLATE PERFORMANCE FORM
            </Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content>
        <Form
          id={'performance-measurement-create-form'}
          loading={isPerformancesCreateLoading}
        >
          <Input
            placeholder={'Measurement Template Code'}
            label={'Measurement Template Code'}
            formik={formikPerformanceFormTypeCreate}
            name={'code'}
            type={'text'}
          />
          <Input
            placeholder={'Measurement Template Name'}
            label={'Measurement Template Name'}
            formik={formikPerformanceFormTypeCreate}
            name={'name'}
            type={'text'}
          />
          <InputDropdownRemote
            placeholder={'Learning Organizer'}
            label={'Learning Organizer'}
            name={'learningOrganizer'}
            formik={formikPerformanceFormTypeCreate}
            apiFilter={{
              isActive: true,
            }}
            apiFetcher={getPerformanceFormType}
            apiSearchKeys={['id']}
            apiTextKey={'name'}
            apiValueKey={'code'}
          />
          <Segment clearing className={'nomargin'}>
            <div className={'vertical-scroll'}>
              <Table
                // selectable={!(isPerformanceLoading || isPerformanceEmpty)}
                className={'nomargin'}
                color={'teal'}
                singleLine
                compact
                fixed
              >
                <Table.Header>
                  <Table.Row>
                    <TableHeaderCell
                      width={4}
                      sortable
                      attribute={'code'}
                      name={'Grade Code'}
                      // direction={performanceSort?.code}
                      // onSortPress={performanceSortPress as any}
                    />
                    <TableHeaderCell
                      width={4}
                      sortable
                      attribute={'name'}
                      name={'Grade Name'}
                      // direction={performanceSort?.name}
                      // onSortPress={performanceSortPress as any}
                    />
                    <TableHeaderCell
                      width={4}
                      sortable
                      attribute={'name'}
                      name={'Point'}
                      // direction={performanceSort?.name}
                      // onSortPress={performanceSortPress as any}
                    />
                    <Table.HeaderCell
                      className={'nopadding'}
                      width={1}
                      collapsing
                      textAlign={'center'}
                    >
                      <Icon
                        // disabled={isPerformanceEmpty}
                        // onClick={performanceSelectAllPress()}
                        size={'small'}
                        name={'ellipsis horizontal'}
                      />
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {/* {isPerformanceLoading && (
                <TablePlaceholder rowCount={15} colCount={5} />
              )}
              {!isPerformanceLoading && isPerformanceEmpty && (
                <Table.Row>
                  <Table.Cell textAlign={'center'} colSpan={5}>
                    {isPerformanceError
                      ? isPerformanceError.response?.data?.message || 'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )} */}
                  {/* {!isPerformanceLoading &&
                performances?.map((performance: any) => ( */}
                  <Table.Row
                  // key={performance.id}
                  >
                    <Table.Cell>
                      <Input
                        placeholder={'Grade Code'}
                        // label={'Measurement Template Code'}
                        formik={formikPerformanceFormTypeCreate}
                        name={'code'}
                        type={'text'}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        placeholder={'Grade Name'}
                        // label={'Measurement Template Code'}
                        formik={formikPerformanceFormTypeCreate}
                        name={'code'}
                        type={'text'}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        placeholder={'0'}
                        // label={'Measurement Template Code'}
                        formik={formikPerformanceFormTypeCreate}
                        name={'code'}
                        type={'number'}
                      />
                    </Table.Cell>
                    <Table.Cell textAlign={'center'}>
                      <Button.Group icon basic size="mini" compact>
                        <RenderGuard actionKey={RightEnum.MD_PERF_DELETE}>
                          <Button
                            // onClick={deleteOnePress(performance)}
                            icon={'trash'}
                          />
                        </RenderGuard>
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                  {/* ))} */}
                </Table.Body>
              </Table>
            </div>
          </Segment>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Grid columns="equal">
          <Grid.Column>
            <Button size={'large'} fluid onClick={closePress}>
              Close
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button
              fluid
              primary
              size={'large'}
              type={'submit'}
              form={'performance-create-form'}
              onClick={formikPerformanceFormTypeCreate.handleSubmit as any}
            >
              <Icon name={'save'} />
              Save
            </Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalMeasurementPerformanceCreate;
