import React from 'react';
import { Modal, Icon, Button, Grid } from 'semantic-ui-react';

interface PerformanceInquiryDownloadAllAbsoluteScoreProps {
  isOpen: boolean;
  closePress: any;
  yesPress: any;
}

export default function ModalPerformanceInquiryDownloadAllAbsoluteScore({
  isOpen,
  closePress,
  yesPress,
}: PerformanceInquiryDownloadAllAbsoluteScoreProps) {
  return (
    <Modal onClose={closePress} open={isOpen} centered size="tiny">
      <Modal.Header>
        <Icon name={'download'} inverted circular color={'teal'} />
        <span style={{ marginLeft: '.7em' }}>
          Download Absolute Score Template for All
        </span>
      </Modal.Header>
      <Modal.Content>
        <span>
          This will download Absolute Score Template for all filtered search
          result. Do you wish to continue?
        </span>
      </Modal.Content>
      <Modal.Actions>
        <Grid columns="equal">
          <Grid.Column>
            <Button fluid onClick={closePress}>
              <Icon name="remove" /> No
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button fluid primary onClick={yesPress}>
              <Icon name="checkmark" /> Yes
            </Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
}
