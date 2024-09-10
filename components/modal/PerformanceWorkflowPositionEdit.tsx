import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Label,
  Message,
  Modal,
  Segment,
} from 'semantic-ui-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
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
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';
import Snippet from '../Snippet';
import { getPositions } from '../../lib/data/position/usePositions';
import InputDropdownRemote from '../InputDropdownRemote';
import getGuid from '../../lib/util/getGuid';
import usePerformanceWorkflowPosition from '../../lib/data/performanceWorkflowPosition/usePerformanceWorkflowPosition';
import usePerformanceWorkflowPositionEdit from '../../lib/data/performanceWorkflowPosition/usePerformanceWorkflowPositionEdit';
import { PFWorkflowTypeEnum } from '../../lib/enums/PerformanceEnum';

interface ModalPerformanceWorkflowPositionEditProps {
  id: string;
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

const formPFWorkflowEditSchema = yup.object({
  layers: yup.array().of(
    yup.array().of(
      yup.object({
        assigneePosition: yup.object({
          id: yup.string().required('Assignee Position is required'),
        }),
      }),
    ),
  ),
  readers: yup.array().of(
    yup.object({
      assigneePosition: yup.object({
        id: yup.string().required('Assignee Position is required'),
      }),
    }),
  ),
});

const ModalPerformanceWorkflowPositionEdit = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceWorkflowPositionEditProps) => {
  const [layers, setLayers] = useState<any>([]);
  const [readers, setReaders] = useState<any>([]);
  const {
    performanceWorkflowPosition,
    approverWorkflows,
    readerWorkflows,
    isPerformanceWorkflowPositionLoading,
  } = usePerformanceWorkflowPosition(id);
  const {
    performanceWorkflowPositionEdit,
    isPerformanceWorkflowPositionEditLoading,
  } = usePerformanceWorkflowPositionEdit({
    onSuccess: closePress,
  });

  const initialLayers = useMemo<any>(() => {
    return values(groupBy(sortBy(approverWorkflows, 'level'), 'level'));
  }, [approverWorkflows]);

  const formikPFWorkflow = useFormik({
    initialValues: {
      layers: initialLayers,
      readers: readerWorkflows,
    },
    onSubmit: (values) => {
      const result = [];
      const approver = PFWorkflowTypeEnum.PF_WORKFLOW_APPROVER;
      const reader = PFWorkflowTypeEnum.PF_WORKFLOW_READER;
      result.push(
        ...flatten(
          values.layers.map((l: any, idx: number) =>
            l.map((w: any) => ({ ...w, level: idx + 1, type: approver })),
          ),
        ),
      );
      result.push(
        ...map(values.readers, (w) => ({ ...w, level: 1, type: reader })),
      );
      performanceWorkflowPositionEdit({ PFWorkflowPst: result, id });
    },
    validationSchema: formPFWorkflowEditSchema,
    enableReinitialize: true,
  });

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
        {isPerformanceWorkflowPositionLoading ? (
          <ModalHeaderPlaceholder />
        ) : (
          <>
            <Snippet
              title={performanceWorkflowPosition?.name}
              description={performanceWorkflowPosition?.description}
            />
            <Label circular>
              <Icon name={'hashtag'} />
              {performanceWorkflowPosition?.code}
            </Label>
          </>
        )}
      </Modal.Header>
      <Modal.Content scrolling>
        {isPerformanceWorkflowPositionLoading ? (
          <ModalContentPlaceholder />
        ) : (
          <>
            <Form
              id={'lr-workflow-edit-form'}
              loading={
                isPerformanceWorkflowPositionLoading ||
                isPerformanceWorkflowPositionEditLoading
              }
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
                      <Header color={'teal'} floated={'left'}>
                        Approver - Layer {layerIdx + 1}
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
                              placeholder={'Assignee Position'}
                              label={'Assignee Position'}
                              name={`layers[${layerIdx}][${workflowIdx}].assigneePosition.id`}
                              formik={formikPFWorkflow}
                              initialOptions={
                                !isEmpty(workflow)
                                  ? [
                                      {
                                        key: workflow.assigneePosition.id,
                                        value: workflow.assigneePosition.id,
                                        text: workflow.assigneePosition.name,
                                      },
                                    ]
                                  : []
                              }
                              apiFilter={{ isActive: true, flag: '2' }}
                              apiFetcher={getPositions}
                              apiSearchKeys={['name']}
                              apiTextKey={'name'}
                              apiValueKey={'id'}
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
                        color={'teal'}
                        onClick={addWorkflow(layerIdx)}
                        fluid
                        disabled={workflows?.length}
                      >
                        <Icon name={'plus'} />
                        Add New Approver
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
                  fluid
                  onClick={addLayer}
                  color={'teal'}
                  disabled={layers.length >= 2}
                >
                  <Icon name={'plus'} />
                  Add New Layer Approver
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
              <Icon name={'close'} />
              Close
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button
              primary
              fluid
              size={'large'}
              onClick={formikPFWorkflow.handleSubmit as any}
              form={'lr-workflow-edit-form'}
              type={'submit'}
              disabled={formikPFWorkflow?.values?.layers[0]?.length < 1}
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
      <Header color={'teal'} floated={'left'}>
        {type}
      </Header>
    </Segment>
    <Grid>
      {workflows.map((workflow: any, workflowIdx: any) => (
        <Grid.Row key={`workflow-${workflowIdx}`}>
          <Grid.Column width={14}>
            <InputDropdownRemote
              placeholder={'Assignee Position'}
              label={'Assignee Position'}
              name={`${formikName}[${workflowIdx}].assigneePosition.id`}
              formik={formikPFWorkflow}
              initialOptions={
                !isEmpty(workflow)
                  ? [
                      {
                        key: workflow.assigneePosition.id,
                        value: workflow.assigneePosition.id,
                        text: workflow.assigneePosition.name,
                      },
                    ]
                  : []
              }
              apiFilter={{ isActive: true, flag: '2' }}
              apiFetcher={getPositions}
              apiSearchKeys={['name']}
              apiTextKey={'name'}
              apiValueKey={'id'}
            />
          </Grid.Column>
          <Grid.Column width={2} textAlign={'right'}>
            <Form.Field>
              <label>&nbsp;</label>
              <Button.Group icon basic color={'red'}>
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
        color={'teal'}
        onClick={addReader(formikName)}
        fluid
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

export default ModalPerformanceWorkflowPositionEdit;
