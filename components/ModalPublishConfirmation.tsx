import React, { useMemo } from 'react';
import {
  Button,
  Grid,
  Header,
  Icon,
  Loader,
  Modal,
  SemanticICONS,
} from 'semantic-ui-react';
import renderHyphen from '../lib/util/renderHyphen';

interface ModalPublishConfirmationProps {
  header?: string;
  title?: string;
  data?: any;
  isOpen: boolean;
  closePress: any;
  onAction?: any;
  isLoading?: boolean;
  content?: string;
  actionName?: string;
  iconName?: SemanticICONS;
  isValidatePublish?: boolean;
}

const ModalPublishConfirmation = ({
  header = 'General Survey',
  title = 'Survey',
  data,
  isOpen,
  closePress,
  onAction,
  content = '',
  actionName = 'Publish',
  iconName = 'send',
  isValidatePublish,
  isLoading,
}: ModalPublishConfirmationProps) => {
  const message = useMemo(() => {
    if (content) return content;
    return `Are you sure want to ${actionName} ${renderHyphen(title)} ?`;
  }, [title, content, actionName]);

  return (
    <Modal onClose={closePress} open={isOpen} size="tiny">
      <Modal.Header>
        <Header size="small">
          <Icon name={iconName} color="violet" />
          <Header.Content>
            {actionName} {renderHyphen(header)}
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content>{message}</Modal.Content>
      <Modal.Actions>
        <Grid columns={'equal'}>
          <Grid.Column>
            <Button fluid onClick={closePress}>
              Close
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button
              fluid
              primary
              onClick={onAction?.(data)}
              disabled={!isValidatePublish || isLoading}
            >
              {isLoading && <Loader active />}
              <Icon name={iconName} />
              {actionName + (isLoading ? 'ing' : '')}
            </Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalPublishConfirmation;
