import React from 'react';
import { Button, Form, Grid, Loader, Modal } from 'semantic-ui-react';
import ModalConfirmationClose from '../../ModalConfirmationClose';
import ModalContentPlaceholder from '../../placeholder/ModalContentPlaceholder';
import ModalHeaderPlaceholder from '../../placeholder/ModalHeaderPlaceholder';
import ModalHeaderPerfMidYear from '../../performanceMidYear/components/HeaderPerfMidYear';
import PerfFormDesc from '../../performanceMidYear/components/PerfFormDesc';
import PerfFormType from '../../performanceMidYear/components/PerfFormType';
import usePerfEndYearEdit from '../../../lib/data/PerfEndYear/usePerfEndYearEdit';
import usePerfEndYearEditForm from '../../../lib/data/PerfEndYear/usePerfEndYearEditForm';
import PerfFormTypeTotalScore from '../../performanceMidYear/components/PerfFormTypeTotalScore';
import NotesAndRevisionNotes from '../../performanceGoalSetting/components/NotesAndRevisionNotes';
import TableApproval from '../../performanceGoalSetting/components/TablePerfEmpAprovalGS';
import { TimelineNoteType } from '../../../lib/enums/GoalSetting';
import { PerfGoalSettingRevisionNote } from '../../performanceGoalSetting/types/goalSettingTypes';
import { timelineEnum } from '../../../lib/enums/PerformanceEnum';
import { DownloadFormJSON } from '../../../helper/downloadFormJSON';

interface ModalPerfEndYearEditProps {
  id: string;
  isOpen: boolean;
  closePress: any;
}

const ModalPerfEndYearEdit = ({
  id,
  isOpen,
  closePress,
}: ModalPerfEndYearEditProps) => {
  const { perfEndYearEditPosting, isPerfEndYearEditLoading } =
    usePerfEndYearEdit({
      onSuccess: closePress,
    });
  const {
    level,
    perfEmp,
    perfForm,
    isLoading,
    activeFormTypeId,
    setActiveFormTypeId,
    formikEndYear,
    onSaveDraftSelf,
    onSaveRequestSelf,
    isModalExit,
    modalExitOpenPress,
    modalExitClosePress,
    modalExitActionPress,
    activePerfTypeScore,
    revise,
  } = usePerfEndYearEditForm({
    id,
    onSubmit: perfEndYearEditPosting,
    onClose: closePress,
    isEndYear: true,
  });

  return (
    <>
      <Modal
        open={isOpen}
        size={'large'}
        style={{ height: '70%', top: '10%' }}
      >
        <Modal.Header style={{ maxHeight: '15%' }}>
          <DownloadFormJSON formik={formikEndYear} />
          {isLoading ? (
            <ModalHeaderPlaceholder />
          ) : (
            <ModalHeaderPerfMidYear
              timelineSeq={perfEmp?.timelineSeq}
              perfForm={perfForm}
              paTeamRecord={false}
            />
          )}
        </Modal.Header>
        <Modal.Content scrolling className={`modal-content-perf-form-mid`}>
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
                  editable
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
                  onViewDetail={false}
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
                  disabled={isPerfEndYearEditLoading}
                  onClick={modalExitOpenPress}
                >
                  {isPerfEndYearEditLoading && <Loader active />}
                  Close
                </Button>
              </Grid.Column>
              <Grid.Column>
                <Button
                  size={'large'}
                  fluid
                 color='blue'
                  disabled={
                    isPerfEndYearEditLoading ||
                    perfEmp?.timelineSeq?.timeline !==
                      timelineEnum.END_YEAR_APPRAISEE
                  }
                  onClick={onSaveDraftSelf}
                >
                  {isPerfEndYearEditLoading && <Loader active />}
                  Save as Draft
                </Button>
              </Grid.Column>
              <Grid.Column>
                <Button
                  size={'large'}
                  fluid
                  color={'black'}
                  disabled={
                    isPerfEndYearEditLoading ||
                    perfEmp?.timelineSeq?.timeline !==
                      timelineEnum.END_YEAR_APPRAISEE
                  }
                  onClick={onSaveRequestSelf}
                >
                Save
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default ModalPerfEndYearEdit;
