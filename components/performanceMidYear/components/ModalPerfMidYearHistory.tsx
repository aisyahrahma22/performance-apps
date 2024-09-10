import React from 'react';
import { toast } from 'react-toastify';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid/Grid';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';
import ModalHeaderPlaceholder from '../../placeholder/ModalHeaderPlaceholder';
import ModalHeaderPerfMidYear from './HeaderPerfMidYear';
import ModalContentPlaceholder from '../../placeholder/ModalContentPlaceholder';
import PerfFormDesc from './PerfFormDesc';
import usePerfMidYearEditForm from '../../../lib/data/perfMidYear/usePerfMidYearEditForm';
import PerfFormTypeTab from './PerfFormTypeTab';
import CategoryMidYearSection from './CategoryPerformanceSection';
import usePerfMidYearHistory from '../../../lib/data/perfMidYear/history/useMidYearHistory';
import usePerfGoalSettingDetails from '../../../lib/data/performanceGoalSetting/usePerfGoalSettingDetails';

interface ModalPerfMidYearHistoryProps {
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
  data: any;
  activeFormTypeId: any;
  setActiveFormTypeId: any;
  dataTab: any;
}

function ModalPerfMidYearHistory({
  id,
  isOpen,
  closePress,
  activeFormTypeId,
  setActiveFormTypeId,
  dataTab,
}: ModalPerfMidYearHistoryProps) {
  const { perfEmp, perfForm, isLoading } = usePerfMidYearEditForm({
    id,
    onSubmit: null,
    onClose: closePress,
  });

  const {
    perfMidYearHistory,
    isPerfMidYearHistoryLoading,
    isPerfMidYearHistoryError,
  } = usePerfMidYearHistory(id);

  const { perfGoalSettingDetails } = usePerfGoalSettingDetails(id);

  // condition if there is no history data available from API
  if (
    !isPerfMidYearHistoryLoading &&
    perfMidYearHistory &&
    perfMidYearHistory.length <= 0
  ) {
    closePress();
    toast.error('there is no history available');
  }

  // // condition if there is error present from API
  if (isPerfMidYearHistoryError) {
    const errMsg = isPerfMidYearHistoryError?.response?.data?.message;
    closePress();
    if (errMsg) toast.error(errMsg);
    else toast.error('there is an error from the server');
  }

  return (
    <>
      <Modal
        open={isOpen}
        size={'fullscreen'}
        style={{ height: '93%', top: '1%' }}
      >
        <Modal.Header style={{ maxHeight: '13%' }}>
          {isLoading ? (
            <ModalHeaderPlaceholder />
          ) : (
            <ModalHeaderPerfMidYear
              timelineSeq={perfEmp?.timelineSeq}
              perfForm={perfForm}
            />
          )}
        </Modal.Header>
        <Modal.Content scrolling className={`modal-content-perf-form-mid`}>
          {isLoading ? (
            <ModalContentPlaceholder />
          ) : (
            <>
              <PerfFormDesc data={perfForm} />
              <PerfFormTypeTab
                data={dataTab}
                activeFormTypeId={activeFormTypeId}
                setActiveFormTypeId={setActiveFormTypeId}
              />

              {perfGoalSettingDetails?.perfEmpItemType.map(
                (perfEmpItemTypeObj: any) => {
                  return (
                    <div key={perfEmpItemTypeObj.id} style={{ width: '100%' }}>
                      {perfMidYearHistory && (
                        <CategoryMidYearSection
                          key={`categoty-${perfEmpItemTypeObj.id}`}
                          perfTypeData={perfEmpItemTypeObj.perfFormType}
                          perfEmpItemObjArr={perfEmpItemTypeObj.perfEmpItem}
                          perfGoalSettingHistory={perfMidYearHistory}
                        />
                      )}
                    </div>
                  );
                },
              )}
            </>
          )}
        </Modal.Content>
        <Modal.Actions className={'position-abs-bottom'}>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Button size={'large'} fluid onClick={closePress}>
                  Close
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default ModalPerfMidYearHistory;
