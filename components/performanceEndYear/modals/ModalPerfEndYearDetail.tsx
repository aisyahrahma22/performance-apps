import React, { useMemo } from 'react';
import { Button, Form, Grid, Modal } from 'semantic-ui-react';
import { getReadinessStatusPerfEmp } from '../../../lib/data/perfMidYear/helpers/readinessStatus';
import renderEnum from '../../../lib/util/renderEnum';
import ModalContentPlaceholder from '../../placeholder/ModalContentPlaceholder';
import ModalHeaderPlaceholder from '../../placeholder/ModalHeaderPlaceholder';
import ModalHeaderPerfYear from '../../performanceMidYear/components/HeaderPerfMidYear';
import PerfFormDesc from '../../performanceMidYear/components/PerfFormDesc';
import PerfFormType from '../../performanceMidYear/components/PerfFormType';
import PerfFormTypeTotalScore from '../../performanceMidYear/components/PerfFormTypeTotalScore';
import usePerfEndYearEditForm from '../../../lib/data/PerfEndYear/usePerfEndYearEditForm';
import { RenderGuard } from '../../RenderGuard';
import { RightEnum } from '../../../lib/enums/RightEnum';
import NotesAndRevisionNotes from '../../performanceGoalSetting/components/NotesAndRevisionNotes';
import TableApproval from '../../performanceGoalSetting/components/TablePerfEmpAprovalGS';

import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import { TimelineNoteType } from '../../../lib/enums/GoalSetting';
import { PerfGoalSettingRevisionNote } from '../../performanceGoalSetting/types/goalSettingTypes';
import { timelineEnum } from '../../../lib/enums/PerformanceEnum';
interface ModalPerfEndYearDetailProps {
  id: string;
  isOpen: boolean;
  closePress: any;
}

const ModalPerfEndYearDetail = ({
  id,
  isOpen,
  closePress,
}: ModalPerfEndYearDetailProps) => {
  const {
    level,
    perfEmp,
    perfForm,
    isLoading,
    activeFormTypeId,
    setActiveFormTypeId,
    formikEndYear,
    activePerfTypeScore,
    isValidRecall,
    revise,
    perfEndYearRecall,
    isPerfEmpRecallLoading,
  } = usePerfEndYearEditForm({
    id,
    onClose: closePress,
  });

  const readinessStatusIcon = useMemo(() => {
    const icon = getReadinessStatusPerfEmp(perfEmp?.status);
    icon.color = undefined;
    return icon;
  }, [perfEmp]);

  return (
    <>
      <Modal
        open={isOpen}
        size={'large'}
        style={{ height: '70%', top: '10%' }}
      >
        <Modal.Header style={{ maxHeight: '15%' }}>
          {isLoading ? (
            <ModalHeaderPlaceholder />
          ) : (
            <ModalHeaderPerfYear
              timelineSeq={perfEmp?.timelineSeq}
              perfForm={perfForm}
              showIcon
              iconProps={readinessStatusIcon}
              iconLabel={renderEnum(perfEmp?.status)}
              paTeamRecord={false}
            />
          )}
        </Modal.Header>
        <Modal.Content
          scrolling
          className={`modal-content-perf-form-mid ${
            activePerfTypeScore?.isMidYearScore ? 'score' : ''
          }`}
        >
          {isLoading ? (
            <ModalContentPlaceholder />
          ) : (
            <div style={{ marginBottom: '15vh' }}>
              <PerfFormDesc data={perfForm} />
              <Form loading={isLoading}>
                <PerfFormType
                  data={perfForm?.perfFormTypes}
                  activeFormTypeId={activeFormTypeId}
                  setActiveFormTypeId={setActiveFormTypeId}
                  formik={formikEndYear}
                  name={'perfEmpItems'}
                  level={level}
                  perfTypeScoreName={'perfTypeScores'}
                  isEndYear={true}
                  perfEmployeeId={perfEmp?.id}
                  perfEmpItemPerKPIName={'perfEmpItemPerKPI'}
                />
              </Form>
              <div style={{ marginBottom: '5vh', marginTop: '5vh' }}>
                <NotesAndRevisionNotes
                  id={perfEmp?.id}
                  formik={formikEndYear}
                  level={level}
                  onViewDetail={true}
                  data={revise as PerfGoalSettingRevisionNote}
                  timeline={perfEmp?.timelineSeq?.timeline}
                  timelineNoteType={TimelineNoteType.END_YEAR}
                />
                <TableApproval id={id} />
              </div>
            </div>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Button
                  size={'large'}
                  fluid
                  onClick={closePress}
                  disabled={isPerfEmpRecallLoading}
                >
                  Close
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default ModalPerfEndYearDetail;
