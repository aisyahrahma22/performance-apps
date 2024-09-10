import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Message,
  Modal,
  Segment,
} from 'semantic-ui-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  filter,
  flatten,
  get,
  groupBy,
  isEmpty,
  isString,
  map,
  reduce,
  sortBy,
  values,
} from 'lodash';
import * as yup from 'yup';
import { FormikProps, useFormik } from 'formik';
import ModalContentPlaceholder from '../placeholder/ModalContentPlaceholder';
import InputDropdownRemote from '../InputDropdownRemote';
import getGuid from '../../lib/util/getGuid';
import usePerformanceWorkflowEmployeeCreate from '../../lib/data/performanceWorkflowEmployee/usePerformanceWorkflowEmployeeCreate';
import { PFWorkflowTypeEnum } from '../../lib/enums/PerformanceEnum';
import { toast } from 'react-toastify';
import { getEmployees } from '../../lib/data/employee/useEmployees';
interface ModalPerformanceWorkflowEmployeeCreateProps {
  isOpen: boolean;
  closePress: any;
  openPress?: any;
}
interface WorkflowSegmentProps {
  type: string;
  workflows: any[];
  formikName: string;
  addReader: any;
  removeReader: any;
  formikPFWorkflow: FormikProps<any>;
}

const formPFWorkflowEditSchema = yup.object().shape({
  employeeId: yup.string().required('Employee is required'),
  layers: yup.array().of(
    yup.array().of(
      yup.object({
        assigneeEmployee: yup.object({
          id: yup.string().required('Assignee Employee is required'),
        }),
      }),
    ),
  ),
  readers: yup.array().of(
    yup.object({
      assigneeEmployee: yup.object({
        id: yup.string().required('Assignee Employee is required'),
      }),
    }),
  ),
});

const ModalPerformanceWorkflowEmployeeCreate = ({
  isOpen,
  closePress,
}: ModalPerformanceWorkflowEmployeeCreateProps) => {
  // const [employeeId, setEmployeeId] = useState<any>('');
  const [layers, setLayers] = useState<any>([]);
  const [readers, setReaders] = useState<any>([]);

  const {
    performanceWorkflowEmployeeCreate,
    isPerformanceWorkflowEmployeeCreateLoading,
  } = usePerformanceWorkflowEmployeeCreate({
    onSuccess: closePress,
  });

  const readerWorkflows = useMemo(() => {
    const currWorkflows = get(values, 'readers');
    const filterReader = filter(
      currWorkflows,
      (PFWorkflowEmp) =>
        PFWorkflowEmp?.type === PFWorkflowTypeEnum.PF_WORKFLOW_READER,
    );
    return filterReader;
  }, []);

  const approverWorkflows = useMemo(() => {
    const currWorkflows = get(values, 'layers');
    const filterApprover = filter(
      currWorkflows,
      (PFWorkflowEmp) =>
        PFWorkflowEmp?.type === PFWorkflowTypeEnum.PF_WORKFLOW_APPROVER,
    );
    return filterApprover;
  }, []);

  const initialLayers = useMemo<any>(() => {
    return values(groupBy(sortBy(approverWorkflows, 'level'), 'level'));
  }, [approverWorkflows]);

  const formikPFWorkflow = useFormik({
    initialValues: {
      layers: initialLayers,
      readers: readerWorkflows,
      employeeId: '',
    },
    onSubmit: (values) => {
      const result = [];
      const approver = PFWorkflowTypeEnum.PF_WORKFLOW_APPROVER;
      const reader = PFWorkflowTypeEnum.PF_WORKFLOW_READER;
      result.push(
        ...flatten(
          values.layers.map((l: any, idx: number) =>
            l.map((w: any) => ({
              ...w,
              level: idx + 1,
              type: approver,
            })),
          ),
        ),
      );
      result.push(
        ...map(values.readers, (w) => ({
          ...w,
          level: 1,
          type: reader,
        })),
      );

      performanceWorkflowEmployeeCreate({
        employeeId: values.employeeId,
        PFWorkflowEmp: result,
      });
    },
    validationSchema: formPFWorkflowEditSchema,
    enableReinitialize: true,
  });

  const submitForm = useCallback(async () => {
    const layer1 = map(formikPFWorkflow.values.layers[0], (data: any) => {
      return data.assigneeEmployee;
    });
    const uniqueLayer1 = new Set(layer1.map((v) => v.id));

    const layer2 = map(formikPFWorkflow.values.layers[1], (data: any) => {
      return data.assigneeEmployee;
    });
    const uniqueLayer2 = new Set(layer2.map((v) => v.id));

    const readers = map(formikPFWorkflow.values.readers, (data: any) => {
      return data.assigneeEmployee;
    });
    const uniqueReaders = new Set(readers.map((v) => v.id));

    if (uniqueLayer1.size < layer1.length) {
      return toast.error(
        'Approver on the first layer should not be the same !',
      );
    } else if (uniqueLayer2.size < layer2.length) {
      return toast.error(
        'Approver on the second layer should not be the same !',
      );
    } else if (uniqueReaders.size < readers.length) {
      return toast.error('Assignment on the reader should not be the same !');
    } else {
      formikPFWorkflow.handleSubmit();
    }
  }, [formikPFWorkflow]);

  useEffect(() => {
    setLayers(
      reduce(
        groupBy(sortBy(approverWorkflows, 'level'), 'level'),
        (acc: any[], workflows: any[] = []) => {
          acc.push({ id: getGuid(), workflows });
          return acc;
        },
        [],
      ),
    );

    setReaders(readerWorkflows);
  }, [approverWorkflows, readerWorkflows]);

  const addWorkflow = useCallback(
    (layerIdx) => () => {
      const newValues = [...formikPFWorkflow.values.layers];
      const curValue = newValues[layerIdx] || [];
      curValue.push({});
      newValues[layerIdx] = curValue;
      formikPFWorkflow.setValues({
        ...formikPFWorkflow.values,
        layers: newValues,
      });

      setLayers((layers: any[]) => {
        const newLayers = [...layers];
        const curLayer = newLayers[layerIdx] || {};
        if (curLayer.id) curLayer.workflows.push([]);
        else {
          curLayer.id = getGuid();
          curLayer.workflows = [];
        }
        newLayers[layerIdx] = curLayer;
        return newLayers;
      });
    },
    [formikPFWorkflow],
  );
  const addReader = useCallback(
    (formikName) => () => {
      const newValues = [...formikPFWorkflow.values.readers];
      newValues.push({});
      formikPFWorkflow.setFieldValue(formikName, newValues);
      const workflow = (workflows: any[]) => {
        const newWorkflows = [...workflows];
        newWorkflows.push({});
        return newWorkflows;
      };
      setReaders(workflow);
    },
    [formikPFWorkflow],
  );

  const removeReader = useCallback(
    (formikName, idx) => () => {
      const newValues = [...formikPFWorkflow.values.readers];
      newValues.splice(idx, 1);
      formikPFWorkflow.setFieldValue(formikName, newValues);

      const workflow = (workflows: any[]) => {
        const newWorkflows = [...workflows];
        newWorkflows.splice(idx, 1);
        return newWorkflows;
      };
      setReaders(workflow);
    },
    [formikPFWorkflow],
  );

  const removeWorkflow = useCallback(
    (layerIdx, workflowIdx) => () => {
      const newValues = [...formikPFWorkflow.values.layers];
      const curValue = newValues[layerIdx] || [];
      curValue.splice(workflowIdx, 1);
      newValues[layerIdx] = curValue;
      formikPFWorkflow.setValues({
        ...formikPFWorkflow.values,
        layers: newValues,
      });

      setLayers((layers: any[]) => {
        const newLayers = [...layers];
        const curLayer = newLayers[layerIdx] || {};
        curLayer.workflows?.splice?.(workflowIdx, 1);
        newLayers[layerIdx] = curLayer;
        return newLayers;
      });
    },
    [formikPFWorkflow],
  );

  const addLayer = useCallback(() => {
    const newValues = [...formikPFWorkflow.values.layers];
    formikPFWorkflow.setValues({
      ...formikPFWorkflow.values,
      layers: newValues,
    });

    setLayers((layers: any[]) => {
      const newLayers = [...layers];
      newLayers.push({
        id: getGuid(),
        workflows: [],
      });
      return newLayers;
    });
  }, [formikPFWorkflow]);

  const removeLayer = useCallback(
    (layerIdx) => () => {
      const newValues = [...formikPFWorkflow.values.layers];
      newValues.splice(layerIdx, 1);
      formikPFWorkflow.setValues({
        ...formikPFWorkflow.values,
        layers: newValues,
      });

      setLayers((layers: any[]) => {
        const newLayers = [...layers];
        newLayers.splice(layerIdx, 1);
        return newLayers;
      });
    },
    [formikPFWorkflow],
  );

  return (
    <Modal open={isOpen} size="small" closeOnDimmerClick={false}>
      <Modal.Header>
        <Header as={'h2'} color="black">
          <Icon name={'plus square outline'} circular />
          <Header.Content>
            Form Create
            <Header.Subheader>Principal Assignment by Employee</Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content scrolling>
        <Form loading={isPerformanceWorkflowEmployeeCreateLoading}>
          <InputDropdownRemote
            placeholder={'Employee'}
            label={'Name'}
            name={'employeeId'}
            formik={formikPFWorkflow}
            apiFilter={{
              isActive: true,
            }}
            apiFetcher={getEmployees}
            apiSearchKeys={['codeName']}
            apiTextKey={['code', 'fullName']}
            apiValueKey={'id'}
          />
        </Form>
        <br />
        <br />
        {isPerformanceWorkflowEmployeeCreateLoading ? (
          <ModalContentPlaceholder />
        ) : (
          <>
            <Form
              id={'lr-workflow-edit-form'}
              loading={isPerformanceWorkflowEmployeeCreateLoading}
            >
              <WorkflowSegment
                type="Reader"
                formikPFWorkflow={formikPFWorkflow}
                formikName="readers"
                workflows={readers}
                addReader={addReader}
                removeReader={removeReader}
              />
              {layers.map(({ workflows, id }: any, layerIdx: any) => {
                const layerErrorMessage = get(
                  formikPFWorkflow.errors,
                  `layers[${layerIdx}]`,
                );
                return (
                  <Segment key={`layer-${id}`}>
                    <Segment clearing basic className={'nopadding'}>
                      <Header color={'blue'} floated={'left'}>
                        Approver - Level {layerIdx + 1}
                      </Header>
                      <Button
                        onClick={removeLayer(layerIdx)}
                        floated={'right'}
                        icon
                        compact
                      >
                        <Icon name={'close'} />
                      </Button>
                    </Segment>
                    <Grid>
                      {workflows.map((workflow: any, workflowIdx: any) => (
                        <Grid.Row key={`workflow-${workflowIdx}`}>
                          <Grid.Column width={14}>
                            <InputDropdownRemote
                              placeholder={'Assignee Employee'}
                              label={'Assignee'}
                              name={`layers[${layerIdx}][${workflowIdx}].assigneeEmployee.id`}
                              formik={formikPFWorkflow}
                              apiFilter={{
                                isActive: true,
                              }}
                              apiFetcher={getEmployees}
                              apiSearchKeys={['codeName']}
                              apiTextKey={['code', 'fullName']}
                              apiValueKey={'id'}
                              initialOptions={
                                !isEmpty(workflow)
                                  ? [
                                      {
                                        key: workflow.assigneeEmployee.id,
                                        value: workflow.assigneeEmployee.id,
                                        text: workflow.assigneeEmployee
                                          .fullName,
                                      },
                                    ]
                                  : []
                              }
                            />
                          </Grid.Column>
                          <Grid.Column width={2} textAlign={'right'}>
                            <Form.Field>
                              <label>&nbsp;</label>
                              <Button.Group icon basic color={'red'}>
                                <Button
                                  onClick={removeWorkflow(
                                    layerIdx,
                                    workflowIdx,
                                  )}
                                  icon={'trash'}
                                />
                              </Button.Group>
                            </Form.Field>
                          </Grid.Column>
                        </Grid.Row>
                      ))}
                    </Grid>
                    <Segment clearing basic className={'nopaddingh nopaddingb'}>
                      <Button
                        basic
                        circular
                        color={'blue'}
                        onClick={addWorkflow(layerIdx)}
                       
                        disabled={workflows?.length}
                      >
                        <Icon name={'plus'} />
                        Add New Level
                      </Button>
                    </Segment>
                    {isString(layerErrorMessage) && (
                      <Message negative size={'tiny'}>
                        <p>{layerErrorMessage}</p>
                      </Message>
                    )}
                  </Segment>
                );
              })}
              {isString(formikPFWorkflow.errors.layers) && (
                <Message negative size={'tiny'}>
                  <p>{formikPFWorkflow.errors.layers}</p>
                </Message>
              )}
              <Segment clearing basic className={'nopadding'}>
                <Button
                  circular
                 
                  onClick={addLayer}
                  color={'blue'}
                  disabled={layers.length >= 2}
                >
                  <Icon name={'plus'} />
                  Add New Level
                </Button>
              </Segment>
            </Form>
          </>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Grid columns="equal">
          <Grid.Column>
            <Button size={'large'} onClick={closePress} fluid type={'button'}>
              Close
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button
              secondary
              fluid
              size={'large'}
              onClick={() => submitForm()}
              form={'lr-workflow-edit-form'}
              type={'submit'}
              disabled={formikPFWorkflow?.values?.layers[0]?.length < 1}
            >
              Save
            </Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

const WorkflowSegment = ({
  type,
  workflows,
  formikPFWorkflow,
  formikName,
  addReader,
  removeReader,
}: WorkflowSegmentProps) => (
  <Segment>
    <Segment clearing basic className={'nopadding'}>
      <Header color={'blue'} floated={'left'}>
        {type}
      </Header>
    </Segment>
    <Grid>
      {workflows.map((workflow: any, workflowIdx: any) => (
        <Grid.Row key={`workflow-${workflowIdx}`}>
          <Grid.Column width={14}>
            <InputDropdownRemote
              placeholder={'Assignee Employee'}
              label={'Assignee Employee'}
              name={`${formikName}[${workflowIdx}].assigneeEmployee.id`}
              formik={formikPFWorkflow}
              apiFilter={{
                isActive: true,
              }}
              apiFetcher={getEmployees}
              apiSearchKeys={['codeName']}
              apiTextKey={['code', 'fullName']}
              apiValueKey={'id'}
              initialOptions={
                !isEmpty(workflow)
                  ? [
                      {
                        key: workflow.assigneeEmployee.id,
                        value: workflow.assigneeEmployee.id,
                        text: workflow.assigneeEmployee.fullName,
                      },
                    ]
                  : []
              }
            />
          </Grid.Column>
          <Grid.Column width={2} textAlign={'right'}>
            <Form.Field>
              <label>&nbsp;</label>
              <Button.Group icon basic color={'black'}>
                <Button
                  onClick={removeReader(formikName, workflow)}
                  icon={'trash'}
                />
              </Button.Group>
            </Form.Field>
          </Grid.Column>
        </Grid.Row>
      ))}
    </Grid>
    <Segment clearing basic className={'nopaddingh nopaddingb'}>
      <Button
        basic
        circular
        color={'blue'}
        onClick={addReader(formikName)}
      >
        <Icon name={'plus'} />
        Add New {type}
      </Button>
    </Segment>
    {isString(formikPFWorkflow.errors[formikName]) && (
      <Message negative size={'tiny'}>
        <p>{formikPFWorkflow.errors[formikName]}</p>
      </Message>
    )}
  </Segment>
);

export default ModalPerformanceWorkflowEmployeeCreate;
