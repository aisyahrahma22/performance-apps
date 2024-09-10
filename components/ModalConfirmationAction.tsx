import React from 'react';
import { Button, Grid, Header, Icon, Image, Modal } from 'semantic-ui-react';

interface ModalConfirmationActionProps {
  isOpen: boolean;
  isLoading: boolean;
  closePress: any;
  onAction: any;
  header: string;
  content: any;
  icon: ActionConfirmation;
}

export enum ActionConfirmation {
  CANCEL_TRIANGLE = 'Cancel',
  CANCEL_CIRCLE = 'Cancel',
  REMOVE = 'Remove',
  SAVE = 'Save',
}

const iconConfirmation = (icon: ActionConfirmation) => {
  switch (icon) {
    case ActionConfirmation.CANCEL_TRIANGLE: {
      return (
        <Image src="/icons/alertTriangleConfirmation.svg" size="massive" />
      );
    }
    case ActionConfirmation.CANCEL_CIRCLE: {
      return <Image src="/icons/alertCircleConfirmation.svg" size="massive" />;
    }
    case ActionConfirmation.REMOVE: {
      return <Image src="/icons/trashConfirmation.svg" size="massive" />;
    }
    case ActionConfirmation.SAVE: {
      return <Image src="/icons/saveConfirmation.svg" size="massive" />;
    }
    default:
      return <Icon name="x" size="massive" />;
  }
};

const ModalConfirmationAction = ({
  isOpen,
  isLoading = false,
  closePress,
  onAction,
  header,
  icon,
  content,
}: ModalConfirmationActionProps) => {
  return (
    <Modal
      onClose={closePress}
      open={isOpen}
      size={'tiny'}
      className="border-radius-table"
    >
      <Modal.Header>
        <Header as={'h3'}>{header}</Header>
      </Modal.Header>
      <Modal.Content>
        <Header textAlign="center" size="huge">
          {iconConfirmation(icon)}
        </Header>
        <Header
          textAlign="center"
          style={{
            fontWeight: 'normal',
            fontSize: '12px',
          }}
        >
          {content}
        </Header>
      </Modal.Content>
      <Modal.Actions>
        <Grid columns={'equal'}>
          <Grid.Column
            textAlign="right"
            style={{
              background: '#FCFCFD',
            }}
          >
            <Button
              loading={isLoading}
              disabled={isLoading}
              size={'large'}
              onClick={closePress}
              style={{
                background: '#FCFCFD',
                margin: '0px 0px 0px 12px',
              }}
            >
              No
            </Button>
            <Button
              loading={isLoading}
              disabled={isLoading}
              size={'large'}
              primary
              onClick={onAction}
              style={{
                background: '#9E77ED',
                color: 'white',
                margin: '0px 0px 0px 12px',
              }}
            >
              Yes
            </Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalConfirmationAction;
