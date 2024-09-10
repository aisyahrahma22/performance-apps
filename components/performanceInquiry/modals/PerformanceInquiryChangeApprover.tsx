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
import ModalContentPlaceholder from '../../placeholder/ModalContentPlaceholder';
import ModalHeaderPlaceholder from '../../placeholder/ModalHeaderPlaceholder';
import Snippet from '../../Snippet';
import InputDropdownRemote from '../../InputDropdownRemote';
import getGuid from '../../../lib/util/getGuid';
import {
  PerfSuperiorStatusEnum,
  PFWorkflowTypeEnum,
} from '../../../lib/enums/PerformanceEnum';
import usePerformanceInquiryApprovers from '../../../lib/data/performanceInquiry/usePerformanceInquiryApprovers';
import usePerformanceInquiryApproversEdit from '../../../lib/data/performanceInquiry/usePerformanceInquiryApproversEdit';
import { RenderGuard } from '../../RenderGuard';
import { RightEnum } from '../../../lib/enums/RightEnum';
import { getEmployees } from '../../../lib/data/employee/useEmployees';

interface ModalPerformanceInquiryChangeApproverProps {
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
  // refreshPress: any;
}

interface ChangeApproverSegmentProps {
  type: string;
  approvers: any[];
  formikName: string;
  addReader: any;
  removeReader: any;
  formikInquiryChangeApprover: FormikProps<any>;
}

const formPerfInquiryChangeApproverSchema = yup.object({
  layers: yup.array().of(
    yup.array().of(
      yup.object({
        assignee: yup.object({
          id: yup.string().required('Assignee Employee is required'),
        }),
      }),
    ),
  ),
  readers: yup.array().of(
    yup.object({
      assignee: yup.object({
        id: yup.string().required('Assignee Employee is required'),
      }),
    }),
  ),
});

const ModalPerformanceInquiryChangeApprover = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceInquiryChangeApproverProps) => {
  const [layers, setLayers] = useState<any>([]);
  const [readers, setReaders] = useState<any>([]);
  const { employee, approver, reader, isPerformanceApproversLoading } =
    usePerformanceInquiryApprovers(id);

  const {
    performanceInquiryApproversEdit,
    isPerformanceInquiryApproversLoading,
  } = usePerformanceInquiryApproversEdit({
    onSuccess: closePress,
  });

  const initialLayers = useMemo<any>(() => {
    return values(groupBy(sortBy(approver, 'level'), 'level'));
  }, [approver]);

  const formikInquiryChangeApprover = useFormik({
    initialValues: {
      layers: initialLayers,
      readers: reader,
    },
    onSubmit: (values) => {
      const result = [];
      const approver = PFWorkflowTypeEnum.PF_WORKFLOW_APPROVER;
      const reader = PFWorkflowTypeEnum.PF_WORKFLOW_READER;

      let statusTemp = PerfSuperiorStatusEnum.PENDING;
      result.push(
        ...flatten(
          values.layers.map((l: any, idx: number) => {
            statusTemp = PerfSuperiorStatusEnum.PENDING;
            return l.map((w: any) => {
              if (w.status === undefined) {
                return {
                  ...w,
                  level: idx + 1,
                  type: approver,
                  status: statusTemp,
                };
              } else {
                statusTemp = w.status;
                return { ...w, level: idx + 1, type: approver };
              }
            });
          }),
        ),
      );

      result.push(
        ...map(values.readers, (w) => ({
          ...w,
          level: 1,
          type: reader,
          status: PerfSuperiorStatusEnum.NO_APPROVAL,
        })),
      );

      performanceInquiryApproversEdit({
        PerformanceInquiryApprovers: result,
        id,
      });
    },

    validationSchema: formPerfInquiryChangeApproverSchema,
    enableReinitialize: true,
  });

  useEffect(() => {
    setLayers(
      reduce(
        groupBy(sortBy(approver, 'level'), 'level'),
        (acc: any[], approvers: any[] = []) => {
          acc.push({ id: getGuid(), approvers });
          return acc;
        },
        [],
      ),
    );

    setReaders(reader);
  }, [approver, reader]);

  const addApprovers = useCallback(
    (layerIdx) => () => {
      const newValues = [...formikInquiryChangeApprover.values.layers];
      const curValue = newValues[layerIdx] || [];
      curValue.push({});
      newValues[layerIdx] = curValue;
      formikInquiryChangeApprover.setValues({
        ...formikInquiryChangeApprover.values,
        layers: newValues,
      });

      setLayers((layers: any[]) => {
        const newLayers = [...layers];
        const curLayer = newLayers[layerIdx] || {};
        if (curLayer.id) curLayer.approvers.push([]);
        else {
          curLayer.id = getGuid();
          curLayer.approvers = [];
        }
        newLayers[layerIdx] = curLayer;
        return newLayers;
      });
    },
    [formikInquiryChangeApprover],
  );

  const removeApprovers = useCallback(
    (layerIdx, approverIdx) => () => {
      const newValues = [...formikInquiryChangeApprover.values.layers];
      const curValue = newValues[layerIdx] || [];
      curValue.splice(approverIdx, 1);
      newValues[layerIdx] = curValue;
      formikInquiryChangeApprover.setValues({
        ...formikInquiryChangeApprover.values,
        layers: newValues,
      });

      setLayers((layers: any[]) => {
        const newLayers = [...layers];
        const curLayer = newLayers[layerIdx] || {};
        curLayer.approvers?.splice?.(approverIdx, 1);
        newLayers[layerIdx] = curLayer;
        return newLayers;
      });
    },
    [formikInquiryChangeApprover],
  );

  const addReader = useCallback(
    (formikName) => () => {
      const newValues = [...formikInquiryChangeApprover.values.readers];
      newValues.push({});
      formikInquiryChangeApprover.setFieldValue(formikName, newValues);
      const approver = (approvers: any[]) => {
        const newApprovers = [...approvers];
        newApprovers.push({});
        return newApprovers;
      };
      setReaders(approver);
    },
    [formikInquiryChangeApprover],
  );

  const removeReader = useCallback(
    (formikName, idx) => () => {
      const newValues = [...formikInquiryChangeApprover.values.readers];
      newValues.splice(idx, 1);
      formikInquiryChangeApprover.setFieldValue(formikName, newValues);

      const approver = (approvers: any[]) => {
        const newApprovers = [...approvers];
        newApprovers.splice(idx, 1);
        return newApprovers;
      };
      setReaders(approver);
    },
    [formikInquiryChangeApprover],
  );

  const addLayer = useCallback(() => {
    const newValues = [...formikInquiryChangeApprover.values.layers];
    formikInquiryChangeApprover.setValues({
      ...formikInquiryChangeApprover.values,
      layers: newValues,
    });

    setLayers((layers: any[]) => {
      const newLayers = [...layers];
      newLayers.push({
        id: getGuid(),
        approvers: [],
      });
      return newLayers;
    });
  }, [formikInquiryChangeApprover]);

  const removeLayer = useCallback(
    (layerIdx) => () => {
      const newValues = [...formikInquiryChangeApprover.values.layers];
      newValues.splice(layerIdx, 1);
      formikInquiryChangeApprover.setValues({
        ...formikInquiryChangeApprover.values,
        layers: newValues,
      });

      setLayers((layers: any[]) => {
        const newLayers = [...layers];
        newLayers.splice(layerIdx, 1);
        return newLayers;
      });
    },
    [formikInquiryChangeApprover],
  );

  return (
    <Modal open={isOpen} size="small" closeOnDimmerClick={false}>
      <Modal.Header>
        {isPerformanceApproversLoading ? (
          <ModalHeaderPlaceholder />
        ) : (
          <>
            <Snippet
              title={employee?.fullName}
              description={employee?.description}
            />
            <Label circular>
              <Icon name={'hashtag'} />
              {employee?.code}
            </Label>
          </>
        )}
      </Modal.Header>
      <Modal.Content scrolling>
        {isPerformanceApproversLoading ? (
          <ModalContentPlaceholder />
        ) : (
          <>
            <Form
              id={'lr-approver-edit-form'}
              loading={
                isPerformanceApproversLoading ||
                isPerformanceInquiryApproversLoading
              }
            >
              <ApproverSegment
                type="Reader"
                formikInquiryChangeApprover={formikInquiryChangeApprover}
                formikName="readers"
                approvers={readers}
                addReader={addReader}
                removeReader={removeReader}
              />
              {layers.map(({ approvers, id }: any, layerIdx: any) => {
                const layerErrorMessage = get(
                  formikInquiryChangeApprover.errors,
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
                      {approvers.map((approver: any, approverIdx: any) => (
                        <Grid.Row key={`approver-${approverIdx}`}>
                          <Grid.Column width={14}>
                            <InputDropdownRemote
                              placeholder={'Assignee Employee'}
                              label={'Assignee Employee'}
                              name={`layers[${layerIdx}][${approverIdx}].assignee.id`}
                              formik={formikInquiryChangeApprover}
                              apiFilter={{
                                isActive: true,
                              }}
                              apiFetcher={getEmployees}
                              apiSearchKeys={['codeName']}
                              apiTextKey={['code', 'fullName']}
                              apiValueKey={'id'}
                              initialOptions={
                                !isEmpty(approver)
                                  ? [
                                      {
                                        key: approver.assignee.id,
                                        value: approver.assignee.id,
                                        text: [
                                          approver.assignee.code,
                                          approver.assignee.fullName,
                                        ].join(' - '),
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
                                  onClick={removeApprovers(
                                    layerIdx,
                                    approverIdx,
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
                        onClick={addApprovers(layerIdx)}
                        fluid
                        disabled={approvers.length}
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
              {isString(formikInquiryChangeApprover.errors.layers) && (
                <Message negative size={'tiny'}>
                  <p>{formikInquiryChangeApprover.errors.layers}</p>
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
            <RenderGuard actionKey={RightEnum.PERFORMANCE_INQUIRY_EDIT}>
              <Button
                primary
                fluid
                size={'large'}
                onClick={formikInquiryChangeApprover.handleSubmit as any}
                form={'pf-approver-edit-form'}
                type={'submit'}
                disabled={
                  formikInquiryChangeApprover?.values?.layers[0]?.length < 1
                }
              >
                <Icon name={'save'} />
                Save
              </Button>
            </RenderGuard>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

const ApproverSegment = ({
  type,
  approvers,
  formikInquiryChangeApprover,
  formikName,
  addReader,
  removeReader,
}: ChangeApproverSegmentProps) => (
  <Segment>
    <Segment clearing basic className={'nopadding'}>
      <Header color={'teal'} floated={'left'}>
        {type}
      </Header>
    </Segment>
    <Grid>
      {approvers.map((approver: any, approverIdx: any) => (
        <Grid.Row key={`approver-${approverIdx}`}>
          <Grid.Column width={14}>
            <InputDropdownRemote
              placeholder={'Assignee Employee'}
              label={'Assignee Employee'}
              name={`${formikName}[${approverIdx}].assignee.id`}
              formik={formikInquiryChangeApprover}
              apiFilter={{
                isActive: true,
              }}
              apiFetcher={getEmployees}
              apiSearchKeys={['codeName']}
              apiTextKey={['code', 'fullName']}
              apiValueKey={'id'}
              initialOptions={
                !isEmpty(approver)
                  ? [
                      {
                        key: approver.assignee.id,
                        value: approver.assignee.id,
                        text: [
                          approver.assignee.code,
                          approver.assignee.fullName,
                        ].join(' - '),
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
                  onClick={removeReader(formikName, approver)}
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
    {isString(formikInquiryChangeApprover.errors[formikName]) && (
      <Message negative size={'tiny'}>
        <p>{formikInquiryChangeApprover.errors[formikName]}</p>
      </Message>
    )}
  </Segment>
);

export default ModalPerformanceInquiryChangeApprover;
