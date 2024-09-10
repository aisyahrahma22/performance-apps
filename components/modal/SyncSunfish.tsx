import { Button, Grid, Header, Icon, Modal, Segment } from 'semantic-ui-react';
import React, { useCallback, useRef } from 'react';
import { useFormik } from 'formik';
import useSyncSunfish from '../../lib/data/sunfish/useSyncSunfish';
import SyncProgress from '../SyncProgress';
import { format } from 'date-fns';
interface ModalSyncSunfishProps {
  api: any;
  isOpen: boolean;
  closePress: any;
  title: any;
  noButtonSync?: boolean;
}

const ModalSyncSunfish = ({
  title,
  api,
  isOpen,
  closePress,
  noButtonSync = false,
}: ModalSyncSunfishProps) => {
  const syncSunfishRef = useRef<any>();

  const syncSuccess = useCallback(() => {
    syncSunfishRef.current?.refresh();
  }, []);

  const { syncSunfishPosting, isSyncSunfishLoading } = useSyncSunfish({
    onSuccess: syncSuccess,
  });

  const formikSyncSunfish = useFormik({
    initialValues: { api: api, date: format(new Date(), 'yyyy-MM-dd') },
    onSubmit: (values) => {
      syncSunfishPosting({ ...values });
    },
  });

  return (
    <Modal onClose={closePress} open={isOpen} size="small">
      <Modal.Header>
        <Header as={'h4'} color="teal">
          <Icon name={'cloud download'} circular />
          <Header.Content>
            Sunfish Synchronize
            <Header.Subheader>{title}</Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content>
        {!noButtonSync && (
          <Grid columns="equal" textAlign={'center'}>
            <Grid.Column>
              <Button
                circular
                primary
                size="large"
                onClick={formikSyncSunfish.handleSubmit as any}
              >
                Synchronize
              </Button>
            </Grid.Column>
          </Grid>
        )}
        <Segment raised loading={isSyncSunfishLoading}>
          <Header as="h4" color={'teal'}>
            Synchronize Status
          </Header>
          <SyncProgress syncKey={api} ref={syncSunfishRef} />
        </Segment>
      </Modal.Content>
      <Modal.Actions>
        <Grid columns="equal">
          <Grid.Column>
            <Button fluid size={'large'} onClick={closePress}>
              Close
            </Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalSyncSunfish;
