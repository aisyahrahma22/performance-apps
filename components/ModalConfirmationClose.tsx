import React from 'react';
import {
  Button,
  Grid,
  Header,
  Icon,
  Modal,
  SemanticCOLORS,
  SemanticICONS,
} from 'semantic-ui-react';

interface ModalConfirmationCloseProps {
  isOpen: boolean;
  closePress: any;
  onAction: any;
  header?: string;
  content?: string;
  iconHeader?: SemanticICONS;
  iconColor?: SemanticCOLORS;
}

const ModalConfirmationClose = ({
  isOpen,
  closePress,
  onAction,
  header = 'Close',
  content = 'Are you sure you want to close ? any unsave data will be lost',
  iconHeader = 'warning',
  iconColor = 'red',
}: ModalConfirmationCloseProps) => {
  return (
    <Modal onClose={closePress} open={isOpen} size={'tiny'}>
      <Modal.Header>
        <Header size="small">
          <Icon name={iconHeader} color={iconColor} size={'small'} />
          <Header.Content as={'h3'}>{header}</Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content>{content}</Modal.Content>
      <Modal.Actions>
        <Grid columns={'equal'}>
          <Grid.Column>
            <Button fluid onClick={closePress}>
              <Icon name="remove" /> No
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button fluid primary onClick={onAction}>
              <Icon name="checkmark" /> Yes
            </Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalConfirmationClose;
