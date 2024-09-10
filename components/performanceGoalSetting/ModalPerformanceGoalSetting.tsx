import { useFormik } from 'formik';
import React, { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

import Button from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid/Grid';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header/Header';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label/Label';
import List from 'semantic-ui-react/dist/commonjs/elements/List/List';
import Segment from 'semantic-ui-react/dist/commonjs/elements/Segment/Segment';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';
import {
  PerfEmpItemPerKPI,
  PerfEmployee,
  PerfEmpNote,
  PerfGoalSettingRevisionNote,
} from './types/goalSettingTypes';
import {
  PerfEmployeeStatusEnum,
  PerfGoalSettingNoteType,
  TimelineNoteType,
} from '../../lib/enums/GoalSetting';

import usePerfGoalSettingDetails from '../../lib/data/performanceGoalSetting/usePerfGoalSettingDetails';
// import usePerfGoalSetting from '../../lib/data/performanceGoalSetting/usePerfGoalSetting';
import usePerfGoalSettingEdit from '../../lib/data/performanceGoalSetting/usePerfGoalSettingEdit';
import usePerfProgram from '../../lib/data/performanceGoalSetting/usePerfProgram';

import renderDate from '../../lib/util/renderDate';
import { renderEnum } from '../../lib/util/renderEnum';
import renderHyphen from '../../lib/util/renderHyphen';
import usePerfGoalSettingRecall from '../../lib/data/performanceGoalSetting/usePerfGoalSettingRecall';
import usePerfGoalSettingPostRecall from '../../lib/data/performanceGoalSetting/usePerfGoalSettingPostRecall';
import usePerfGoalSettingSubmit from '../../lib/data/performanceGoalSetting/usePerfGoalSettingSubmit';

import isEqual from 'lodash/isEqual';
import { toast } from 'react-toastify';
import createInitialGoalSettingValue from './helpers/createInitialGoalSettingValue';
import cloneDeep from 'lodash/cloneDeep';
import mapGoalSettingNotes from './helpers/mapGoalSettingNotes';
import { formGoalSettingValidation } from './helpers/formGoalSettingFormikValidationSchema';
import NotesAndRevisionNotes from './components/NotesAndRevisionNotes';
import TableApproval from './components/TablePerfEmpAprovalGS';
import { PerfLevelEnum } from '../../lib/data/perfMidYear/enum/perfForm.enum';
import TotalWeightBottom from './components/TotalWeightBottom';
import validateTotalWeightCumulative from './helpers/validateTotalWeightCumulative';
import { timelineEnum } from '../../lib/enums/PerformanceEnum';

const ModalContentPlaceholder = dynamic(
  () => import('../placeholder/ModalContentPlaceholder'),
);
const ModalHeaderPlaceholder = dynamic(
  () => import('../placeholder/ModalHeaderPlaceholder'),
);
const PerfTypeSection = dynamic(() => import('./components/PerfTypeSection'));

interface ModalPerformanceGoalSettingProps {
  level?: PerfLevelEnum;
  onViewDetail: boolean;
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
}

const initPerfGoalSetting = (id: string): PerfEmployee => ({
  id,
  itemsPerKPIs: {},
  deletedItemPerKPIs: [],
  revise: null,
  notes: {},
});

function ModalPerformanceGoalSetting({
  level = PerfLevelEnum.APPRAISEE,
  onViewDetail = false,
  id,
  isOpen,
  closePress,
}: ModalPerformanceGoalSettingProps) {
  const { perfProgram, isPerfProgramLoading } = usePerfProgram(id);
  const { perfGoalSettingRecall } = usePerfGoalSettingRecall(id);
  const { perfGoalSettingSubmit } = usePerfGoalSettingSubmit(id);
  const {
    perfGoalSettingDetails,
    isPerfGoalSettingDetailsLoading,
  } = usePerfGoalSettingDetails(id);
  const { perfGoalSettingEdit, isPerfGoalSettingEditLoading } =
    usePerfGoalSettingEdit({
      onSuccess: closePress,
    });
  const { perfGoalSettingPostRecall, isPerfGoalSettingPostRecallLoading } =
    usePerfGoalSettingPostRecall({
      onSuccess: closePress,
    });
  const [activeIndex, setActiveIndex] = useState('');
  const formikPerformanceGoalSetting = useFormik({
    initialValues: initPerfGoalSetting(id),
    enableReinitialize: false,
    validationSchema: formGoalSettingValidation(perfGoalSettingDetails),
    validateOnChange: false,
    onSubmit: (values) => {
      const itemPerKPIArr: PerfEmpItemPerKPI[] = [];
      const notesArr: PerfEmpNote[] = [];

      Object.keys(values.itemsPerKPIs).forEach((key) => {
        values.itemsPerKPIs[key].forEach((item) =>
          itemPerKPIArr.push({
            ...item,
            perfEmpItem: { id: item?.perfEmpItem } as any,
            perfKPI: item?.perfKPI ? { id: item?.perfKPI } : (null as any),
            perfKRA: item?.perfKRA ? { id: item?.perfKRA } : (null as any),
          }),
        );
      });

      if (values?.notes) {
        Object.keys(values?.notes).forEach((key) => {
          if (key === TimelineNoteType.GOAL_SETTING) {
            if (values.notes?.GOAL_SETTING?.APPRAISEE != undefined) {
              values.notes.GOAL_SETTING.APPRAISEE.type =
                PerfGoalSettingNoteType.APPRAISEE;
              notesArr.push(values.notes.GOAL_SETTING.APPRAISEE);
            }

            if (values.notes?.GOAL_SETTING?.DIRECT_MANAGER != undefined) {
              values.notes.GOAL_SETTING.DIRECT_MANAGER.type =
                PerfGoalSettingNoteType.DIRECT_MANAGER;
              notesArr.push(values.notes.GOAL_SETTING.DIRECT_MANAGER);
            }

            if (values.notes?.GOAL_SETTING?.ABOVE_MANAGER != undefined) {
              values.notes.GOAL_SETTING.ABOVE_MANAGER.type =
                PerfGoalSettingNoteType.ABOVE_MANAGER;
              notesArr.push(values.notes.GOAL_SETTING.ABOVE_MANAGER);
            }
          }
        });
      }

      const newValue = {
        id: values.id,
        notes: notesArr,
        status: values.status,
        itemsPerKPIs: itemPerKPIArr,
        deletedItemPerKPIs: values.deletedItemPerKPIs,
      };

      perfGoalSettingEdit(newValue);
    },
  });

  // local state to compare old and new perf goal setting detail
  const [localPerfGoalSettingDetails, setLocalPerfGoalSettingDetails] =
    useState<any>();

  // validate cumulative weight when submiting form
  const isCumulWeightValid = useMemo(
    () =>
      validateTotalWeightCumulative({
        formik: formikPerformanceGoalSetting,
        perfGoalSettingDetails: perfGoalSettingDetails,
      }),
    [formikPerformanceGoalSetting, perfGoalSettingDetails],
  );

  // map goal setting detail and populate it into formik dynamically (w/o api result)
  if (
    !isPerfGoalSettingDetailsLoading &&
    !isEqual(localPerfGoalSettingDetails, perfGoalSettingDetails)
  ) {
    setLocalPerfGoalSettingDetails(perfGoalSettingDetails);

    const clonedPerfGoalSetting = cloneDeep(
      formikPerformanceGoalSetting.values,
    );

    clonedPerfGoalSetting.status = perfGoalSettingDetails?.status;
    clonedPerfGoalSetting.notes = mapGoalSettingNotes(
      perfGoalSettingDetails?.notes,
      false,
      false,
    );
    clonedPerfGoalSetting.itemsPerKPIs = createInitialGoalSettingValue(
      perfGoalSettingDetails?.perfEmpItemType || [],
    );

    clonedPerfGoalSetting.revise = perfGoalSettingDetails?.revisionNote?.note;

    formikPerformanceGoalSetting.setValues(clonedPerfGoalSetting);
  }
  // handling recall form action
  const onRecallData = () => {
    const newValue = {
      perfEmployeeId: perfGoalSettingDetails?.id,
    };

    perfGoalSettingPostRecall(newValue);
  };

  // handling submit form action
  const submitForm = useCallback(
    async (status: PerfEmployeeStatusEnum) => {
      await formikPerformanceGoalSetting.setFieldValue('status', status);

      const formValidation = await formikPerformanceGoalSetting.validateForm();
      if (Object.keys(formValidation).length > 0)
        return toast.error(
          'Form are still incomplete. please check the conresponding error in the value!',
        );
      else if (!isCumulWeightValid && status !== PerfEmployeeStatusEnum.DRAFT)
        return toast.error('Total weight is not 100%, please modify weights.');
      else formikPerformanceGoalSetting.handleSubmit();
    },
    [formikPerformanceGoalSetting, isCumulWeightValid],
  );
  return (
    <Modal
      onClose={closePress}
      open={isOpen}
      size={'large'}
      style={{ height: '70%', top: '10%' }}
      closeOnDimmerClick={false}
    >
      {/* Header section of modal */}
      <Modal.Header>
        {isPerfProgramLoading ? (
          <ModalHeaderPlaceholder />
        ) : (
          <div style={{ marginBottom: '10vh' }}>
            <Header as={'h3'} color="black" floated={'left'}>
              <Icon name={'edit'} circular />
              <Header.Content>
                {perfProgram?.perfForm?.perfFormName?.name}
                <Header.Subheader>
                  {perfProgram?.perfForm?.performanceFormCode}
                </Header.Subheader>
              </Header.Content>
            </Header>
            <Header color="teal" floated={'right'}>
              <Header.Content>
                <Label size={'small'} color={'blue'}>
                  <Icon name={'check circle'} />
                  {renderEnum(perfProgram?.timelineSeq?.timeline)}
                </Label>
                <Label size={'small'}>
                      {renderDate(perfProgram?.timelineSeq?.startDate)}/
                      {renderDate(perfProgram?.timelineSeq?.endDate)}
                    </Label>
              </Header.Content>
            </Header>
          </div>
        )}
      </Modal.Header>
      <Modal.Content scrolling className={`modal-content-perf-form-mid`}>
        {(isPerfProgramLoading && isPerfGoalSettingDetailsLoading) ||
        isPerfGoalSettingEditLoading ? (
          <ModalContentPlaceholder />
        ) : (
          <div style={{ marginBottom: '10vh' }}>
           <Grid columns={'equal'} textAlign={'left'}>
                <Grid.Row>
                  <Grid.Column>
                    <List selection size={'medium'} className={'detail'}>
                      <List.Item>
                        Program Code
                        <List.Header>
                          {renderHyphen(
                            perfProgram?.perfForm?.perfProgram?.code,
                          )}
                        </List.Header>
                      </List.Item>
                    </List>
                  </Grid.Column>
                  <Grid.Column>
                    <List selection size={'medium'} className={'detail'}>
                      <List.Item>
                        Program Name
                        <List.Header>
                          {renderHyphen(
                            perfProgram?.perfForm?.perfProgram?.name,
                          )}
                        </List.Header>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <List selection size={'medium'} className={'detail'}>
                      <List.Item>
                        Form Term
                        <List.Header>
                          {renderEnum(
                            perfProgram?.perfForm?.perfProgram?.formTerm,
                          )}
                        </List.Header>
                      </List.Item>
                    </List>
                  </Grid.Column>
                  <Grid.Column>
                    <List selection size={'medium'} className={'detail'}>
                      <List.Item>
                        Final Result Method
                        <List.Header>
                          {renderEnum(
                            perfProgram?.perfForm?.perfProgram
                              ?.finalResultMethod,
                          )}
                        </List.Header>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <List selection size={'medium'} className={'detail'}>
                      <List.Item>
                        Form Member
                        <List.Header>
                          {renderEnum(
                            perfProgram?.perfForm?.perfProgram?.formMember,
                          )}
                        </List.Header>
                      </List.Item>
                    </List>
                  </Grid.Column>
                  <Grid.Column>
                    <List selection size={'large'} className={'detail'}>
                      <List.Item>
                        Participant
                        <List.Header>
                          {renderHyphen(
                            perfGoalSettingDetails?.employee?.fullName,
                          )}
                        </List.Header>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            <PerfTypeSection
              onViewDetail={onViewDetail}
              formik={formikPerformanceGoalSetting}
              perfEmpItemTypeObjArr={perfGoalSettingDetails?.perfEmpItemType}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              perfGoalSettingId={perfProgram?.id}
              level={level}
            />
            <br />
            <NotesAndRevisionNotes
              id={id}
              formik={formikPerformanceGoalSetting}
              level={level}
              onViewDetail={onViewDetail}
              data={
                perfGoalSettingDetails?.revisionNote as PerfGoalSettingRevisionNote
              }
              timeline={perfProgram?.timelineSeq?.timeline}
              timelineNoteType={TimelineNoteType.GOAL_SETTING}
            />
            <TableApproval id={id} />
          </div>
        )}
      </Modal.Content>
      <Modal.Actions>
        <TotalWeightBottom
          formik={formikPerformanceGoalSetting}
          activeIndex={activeIndex}
          perfEmpItemTypeObjArr={perfGoalSettingDetails?.perfEmpItemType}
        />
        <Grid columns="equal">
          <Grid.Column>
            <Button
              size={'large'}
              fluid
              onClick={closePress}
              disabled={
                isPerfGoalSettingEditLoading ||
                isPerfGoalSettingPostRecallLoading
              }
              loading={
                isPerfGoalSettingEditLoading ||
                isPerfGoalSettingPostRecallLoading
              }
            >
              Close
            </Button>
          </Grid.Column>
          {!onViewDetail && (
            <Grid.Column>
              <Button
                type={'submit'}
                size={'large'}
                color={'blue'}
                fluid
                disabled={
                  isPerfGoalSettingEditLoading ||
                  perfProgram?.timelineSeq?.timeline !==
                    timelineEnum.GOAL_SETTING_SELF
                }
                loading={isPerfGoalSettingEditLoading}
                onClick={() => submitForm(PerfEmployeeStatusEnum.DRAFT)}
              >
                Save as Draft
              </Button>
            </Grid.Column>
          )}
          {!onViewDetail &&
            perfGoalSettingSubmit &&
            perfProgram?.status !== 'NO_APPROVAL' && (
              <Grid.Column>
                <Button
                  type={'submit'}
                  size={'large'}
                  color={'black'}
                  fluid
                  disabled={
                    isPerfGoalSettingEditLoading ||
                    perfProgram?.timelineSeq?.timeline !==
                      timelineEnum.GOAL_SETTING_SELF
                  }
                  loading={isPerfGoalSettingEditLoading}
                  onClick={() => submitForm(PerfEmployeeStatusEnum.IN_PROGRESS)}
                >
                 Save
                </Button>
              </Grid.Column>
            )}
        </Grid>
      </Modal.Actions>
    </Modal>
  );
}

export default ModalPerformanceGoalSetting;
