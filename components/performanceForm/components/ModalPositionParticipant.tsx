import { Button, Grid, Modal } from 'semantic-ui-react';
import React from 'react';
import Snippet from '../../Snippet';
import TablePositionParticipant from './TablePositionParticipants';

interface ModalPositionParticipantProps {
  id: string;
  isOpen: boolean;
  closePress: any;
}

const ModalPositionParticipant = ({
  id,
  isOpen,
  closePress,
}: ModalPositionParticipantProps) => {
  return (
    <Modal onClose={closePress} open={isOpen} size="large">
      <Modal.Header>
        <Snippet title={'POSITION PARTICIPANT'} color="teal" />
      </Modal.Header>
      <Modal.Content scrolling>
        <TablePositionParticipant id={id} isEmployeeParticipant={false} />
      </Modal.Content>
      <Modal.Actions>
        <Grid columns="equal">
          <Grid.Column>
            <Button size={'large'} fluid onClick={closePress}>
              Close
            </Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalPositionParticipant;
