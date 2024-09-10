import React from 'react';
import { Button, Form, Grid, Loader, Modal } from 'semantic-ui-react';
import usePerfMidYearEdit from '../../lib/data/perfMidYear/usePerfMidYearEdit';
import usePerfMidYearEditForm from '../../lib/data/perfMidYear/usePerfMidYearEditForm';
import ModalConfirmationClose from '../ModalConfirmationClose';
import NotesAndRevisionNotes from '../performanceGoalSetting/components/NotesAndRevisionNotes';
import ModalContentPlaceholder from '../placeholder/ModalContentPlaceholder';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';
import ModalHeaderPerfMidYear from './components/HeaderPerfMidYear';
import PerfFormDesc from './components/PerfFormDesc';
import PerfFormType from './components/PerfFormType';
import PerfFormTypeTotalScoreMid from './components/PerfFormTypeTotalScore';
import TableApprovalGS from '../performanceGoalSetting/components/TablePerfEmpAprovalGS';
import { TimelineNoteType } from '../../lib/enums/GoalSetting';
import { PerfGoalSettingRevisionNote } from '../performanceGoalSetting/types/goalSettingTypes';
import { timelineEnum } from '../../lib/enums/PerformanceEnum';
import { DownloadFormJSON } from '../../helper/downloadFormJSON';

interface ModalPerfMidYearEditProps {
  id: string;
  isOpen: boolean;
  closePress: any;
}

const ModalPerfMidYearEdit = ({
  id,
  isOpen,
  closePress,
}: ModalPerfMidYearEditProps) => {
  const { perfMidYearEditPosting, isPerfMidYearEditLoading } =
    usePerfMidYearEdit({
      onSuccess: closePress,
    });
  const {
    level,
    perfEmp,
    perfForm,
    isLoading,
    activeFormTypeId,
    setActiveFormTypeId,
    formikMidYear,
    onSaveDraftSelf,
    onSaveRequestSelf,
    isModalExit,
    modalExitOpenPress,
    modalExitClosePress,
    modalExitActionPress,
    activePerfTypeScore,
    revise,
  } = usePerfMidYearEditForm({
    id,
    onSubmit: perfMidYearEditPosting,
    onClose: closePress,
  });

  return (
    <>
      <Modal
        open={isOpen}
        size={'large'}
        style={{ height: '70%', top: '10%' }}
      >
        <Modal.Header style={{ maxHeight: '15%' }}>
          <DownloadFormJSON formik={formikMidYear} />
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
            <>
              <PerfFormDesc data={perfForm} />
              <Form loading={isLoading}>
                <PerfFormType
                  data={perfForm?.perfFormTypes}
                  activeFormTypeId={activeFormTypeId}
                  setActiveFormTypeId={setActiveFormTypeId}
                  editable
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
                  onViewDetail={false}
                  data={revise as PerfGoalSettingRevisionNote}
                  timeline={perfEmp?.timelineSeq?.timeline}
                  timelineNoteType={TimelineNoteType.MID_YEAR}
                />
                <TableApprovalGS id={id} />
              </div>
            </>
          )}
        </Modal.Content>
        <Modal.Actions>
          {activePerfTypeScore?.isMidYearScore && (
            <PerfFormTypeTotalScoreMid
              data={activePerfTypeScore?.data}
              level={level}
              endYear={false}
              grades={activePerfTypeScore?.grades}
            />
          )}
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Button
                  size={'large'}
                  fluid
                  disabled={isPerfMidYearEditLoading}
                  onClick={modalExitOpenPress}
                >
                  {isPerfMidYearEditLoading && <Loader active />}
                  Close
                </Button>
              </Grid.Column>
              <Grid.Column>
                <Button
                  size={'large'}
                  fluid
                  color='blue'
                  disabled={
                    isPerfMidYearEditLoading ||
                    perfEmp?.timelineSeq?.timeline !==
                      timelineEnum.MID_YEAR_COACHING_SELF
                  }
                  onClick={onSaveDraftSelf}
                >
                  {isPerfMidYearEditLoading && <Loader active />}
                  Save as Draft
                </Button>
              </Grid.Column>
              {perfEmp.status == 'NO_APPROVAL' ? (
                <></>
              ) : (
                <>
                  <Grid.Column>
                    <Button
                      size={'large'}
                      fluid
                      color={'black'}
                      disabled={
                        isPerfMidYearEditLoading ||
                        perfEmp?.timelineSeq?.timeline !==
                          timelineEnum.MID_YEAR_COACHING_SELF
                      }
                      onClick={onSaveRequestSelf}
                    >
                     Save
                    </Button>
                  </Grid.Column>
                </>
              )}
            </Grid.Row>
          </Grid>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default ModalPerfMidYearEdit;
