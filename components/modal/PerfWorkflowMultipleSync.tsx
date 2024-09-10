import { Button, Grid, List, Modal, Icon, Image } from 'semantic-ui-react';
import React from 'react';
import { useFormik } from 'formik';
import usePerfFormProgress from '../../lib/data/performanceForm/useGetAsyncData';
import useSyncOnePerfFormData from '../../lib/data/performanceForm/useSyncOnePerfForm';
import useSyncAllPerfFormData from '../../lib/data/performanceForm/useSyncAllPerfForm';

interface ModalPerfWorkflowMultipleSyncProps {
  dataSelected: any;
  isOpen: boolean;
  closePress: any;
  selectedAll: boolean;
  dataAll: any;
  multipleClosePress: any;
  multipleYesPress: any;
  performanceFormTotalCount: number;
  filter: any;
}

const ModalPerfWorkflowMultipleSync = ({
  dataSelected,
  isOpen,
  closePress,
  multipleClosePress,
  performanceFormTotalCount,
  selectedAll,
  filter,
}: ModalPerfWorkflowMultipleSyncProps) => {
  const { perfFormProgress } = usePerfFormProgress(performanceFormTotalCount);
  const { syncOnePerfForm, isSyncOnePerfFormLoading } = useSyncOnePerfFormData({
    onSuccess: closePress,
  });
  const { syncAllPerfForm, isSyncAllPerfFormLoading } = useSyncAllPerfFormData({
    onSuccess: closePress,
  });
  const formikSyncMultipleWorkflow = useFormik({
    initialValues: {},
    enableReinitialize: true,
    onSubmit: () => {
      if (selectedAll && dataSelected.length > 0) {
        syncAllPerfForm(filter);
      } else {
        const ids = dataSelected.map((d: any) => d.id);
        syncOnePerfForm(ids);
      }
    },
  });

  return (
    <>
      <Modal
        onClose={closePress}
        open={isOpen}
        style={{
          top:
            dataSelected.length == performanceFormTotalCount ||
            selectedAll ||
            dataSelected.length <= 8
              ? ''
              : '8%',
          bottom:
            dataSelected.length == performanceFormTotalCount ||
            selectedAll ||
            dataSelected.length <= 8
              ? ''
              : '5%',
          borderRadius: '12px',
        }}
      >
        <Modal.Header>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Icon
                  name={'refresh'}
                  rotated="clockwise"
                  inverted
                  circular
                  color={'purple'}
                />
                <span style={{ marginLeft: '.7em' }}>
                  Sync Workflow to Performance Form
                </span>
              </Grid.Column>
              <Grid.Column>
                <Button
                  onClick={multipleClosePress}
                  icon={
                    <div>
                      <Image
                        src={'/icons/newClose.svg'}
                        width="90%"
                        height={30}
                      />
                    </div>
                  }
                  compact
                  floated="right"
                  size={'large'}
                  style={{
                    background: '#FFFFFF',
                  }}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Header>
        <Modal.Content scrolling className={`modal-content-perf-form-mid`}>
          <span>
            Are you sure want to sync{' '}
            <span style={{ marginLeft: '2px' }}>
              {' '}
              {selectedAll ? performanceFormTotalCount : dataSelected.length}
            </span>{' '}
            Performance Workflow to Performance Form ?
          </span>
          <List selection verticalAlign="middle" celled>
            {!selectedAll && dataSelected.length <= 20 ? (
              <>
                {dataSelected?.map((data: any) => (
                  <List.Item
                    key={data.id}
                    style={{
                      padding: '5px',
                      marginBottom: '10px',
                      border: 0,
                      background: '#E2E8F5',
                      borderRadius: '5px',
                    }}
                  >
                    <Grid>
                      <Grid.Column
                        width={'ten'}
                        style={{ marginLeft: '.7em' }}
                        verticalAlign={'middle'}
                      >
                        <List.Content>
                          <List.Header style={{ marginBottom: '.3em' }}>
                            {data?.perfFormName?.name}
                          </List.Header>
                          {data?.performanceFormCode}
                        </List.Content>
                      </Grid.Column>
                    </Grid>
                  </List.Item>
                ))}
              </>
            ) : (
              <>
                {perfFormProgress?.length <= 20 ? (
                  <>
                    {perfFormProgress?.map((data: any) => (
                      <List.Item
                        key={data.id}
                        style={{
                          padding: '5px',
                          marginBottom: '10px',
                          border: 0,
                          background: '#E2E8F5',
                          borderRadius: '5px',
                        }}
                      >
                        <Grid>
                          <Grid.Column
                            width={'ten'}
                            style={{ marginLeft: '.7em' }}
                            verticalAlign={'middle'}
                          >
                            <List.Content>
                              <List.Header style={{ marginBottom: '.3em' }}>
                                {data?.perfFormName?.name}
                              </List.Header>
                              {data?.performanceFormCode}
                            </List.Content>
                          </Grid.Column>
                        </Grid>
                      </List.Item>
                    ))}
                  </>
                ) : (
                  ''
                )}
              </>
            )}
          </List>
        </Modal.Content>
        <Modal.Actions>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Button
                  size="small"
                  onClick={multipleClosePress}
                  fluid
                  circular
                  style={{ width: '35%' }}
                >
                  No
                </Button>
              </Grid.Column>
              <Grid.Column>
                <Button
                  color="purple"
                  size="small"
                  onClick={formikSyncMultipleWorkflow.handleSubmit as any}
                  fluid
                  circular
                  style={{ width: '35%' }}
                  floated="right"
                  disabled={
                    isSyncAllPerfFormLoading || isSyncOnePerfFormLoading
                  }
                >
                  Yes
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default ModalPerfWorkflowMultipleSync;
