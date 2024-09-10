import { Button, Grid, Icon, List, Modal, Image } from 'semantic-ui-react';
import React from 'react';
import { useFormik } from 'formik';
import useSyncOnePerfFormData from '../../lib/data/performanceForm/useSyncOnePerfForm';

interface ModalPerfWorkflowOneSyncProps {
  data: any;
  isOpen: boolean;
  closePress: any;
}

const ModalPerfWorkflowOneSync = ({
  data,
  isOpen,
  closePress,
}: ModalPerfWorkflowOneSyncProps) => {
  const { syncOnePerfForm, isSyncOnePerfFormLoading } = useSyncOnePerfFormData({
    onSuccess: closePress,
  });

  const formikSyncMultipleWorkflow = useFormik({
    initialValues: {},
    enableReinitialize: true,
    onSubmit: () => {
      const ids = data.map((d: any) => d.id);
      syncOnePerfForm(ids);
    },
  });

  return (
    <Modal
      onClose={closePress}
      open={isOpen}
      size="small"
      closeOnDimmerClick={false}
    >
      <Modal.Header>
        <Grid columns="equal">
          <Grid.Row>
            <Grid.Column width={9}>
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
            <Grid.Column width={7}>
              <Button
                onClick={closePress}
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
      <Modal.Content>
        <span>
          Are you sure want to sync Performance Workflow to Performance Form ?
        </span>
        <List selection verticalAlign="middle" celled>
          {data?.map((item: any) => (
            <List.Item
              key={item.id}
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
                      {item?.perfFormName?.name}
                    </List.Header>
                    {item?.performanceFormCode}
                  </List.Content>
                </Grid.Column>
              </Grid>
            </List.Item>
          ))}
        </List>
      </Modal.Content>
      <Modal.Actions>
        <Grid columns="equal">
          <Grid.Row>
            <Grid.Column>
              <Button
                size="small"
                onClick={closePress}
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
                disabled={isSyncOnePerfFormLoading}
              >
                Yes
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalPerfWorkflowOneSync;
