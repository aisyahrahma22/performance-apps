import React, { useMemo } from 'react';
import { Button, Form, Grid, Modal } from 'semantic-ui-react';
import { getReadinessStatusPerfEmp } from '../../lib/data/perfMidYear/helpers/readinessStatus';
import usePerfMidYearEditForm from '../../lib/data/perfMidYear/usePerfMidYearEditForm';
import { RightEnum } from '../../lib/enums/RightEnum';
import renderEnum from '../../lib/util/renderEnum';
import ModalContentPlaceholder from '../placeholder/ModalContentPlaceholder';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';
import { RenderGuard } from '../RenderGuard';
import ModalHeaderPerfMidYear from './components/HeaderPerfMidYear';
import PerfFormDesc from './components/PerfFormDesc';
import PerfFormType from './components/PerfFormType';
import PerfFormTypeTotalScoreMid from './components/PerfFormTypeTotalScore';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import NotesAndRevisionNotes from '../performanceGoalSetting/components/NotesAndRevisionNotes';
import TableApproval from '../performanceGoalSetting/components/TablePerfEmpAprovalGS';
import { TimelineNoteType } from '../../lib/enums/GoalSetting';
import { PerfGoalSettingRevisionNote } from '../performanceGoalSetting/types/goalSettingTypes';
import { timelineEnum } from '../../lib/enums/PerformanceEnum';

interface ModalPerfMidYearDetailProps {
  id: string;
  isOpen: boolean;
  closePress: any;
}

const ModalPerfMidYearDetail = ({
  id,
  isOpen,
  closePress,
}: ModalPerfMidYearDetailProps) => {
  const {
    level,
    perfEmp,
    perfForm,
    isLoading,
    activeFormTypeId,
    setActiveFormTypeId,
    formikMidYear,
    activePerfTypeScore,
    isValidRecall,
    perfMidYearRecall,
    revise,
    isPerfEmpRecallLoading,
  } = usePerfMidYearEditForm({
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
            <ModalHeaderPerfMidYear
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
            <>
              <PerfFormDesc data={perfForm} />
              <Form loading={isLoading}>
                <PerfFormType
                  data={perfForm?.perfFormTypes}
                  activeFormTypeId={activeFormTypeId}
                  setActiveFormTypeId={setActiveFormTypeId}
                  formik={formikMidYear}
                  name={'perfEmpItems'}
                  level={level}
                  perfTypeScoreName={'perfTypeScores'}
                  isEndYear={false}
                  perfEmployeeId={perfEmp?.id}
                  perfEmpItemPerKPIName={'perfEmpItemPerKPI'}
                />
              </Form>
              <div style={{ marginBottom: '5vh', marginTop: '5vh' }}>
                <NotesAndRevisionNotes
                  id={perfEmp?.id}
                  formik={formikMidYear}
                  level={level}
                  onViewDetail={true}
                  data={revise as PerfGoalSettingRevisionNote}
                  timeline={perfEmp?.timelineSeq?.timeline}
                  timelineNoteType={TimelineNoteType.MID_YEAR}
                />
                <TableApproval id={id} />
              </div>
            </>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Grid columns="equal">
            <Grid.Row
              className={`${activePerfTypeScore?.isMidYearScore ? 'pt-0' : ''}`}
            >
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

export default ModalPerfMidYearDetail;
