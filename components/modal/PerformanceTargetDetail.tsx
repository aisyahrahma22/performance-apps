import { Button, Grid, Icon, List, Modal, Header } from 'semantic-ui-react';
import renderHyphen from '../../lib/util/renderHyphen';
import React from 'react';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';

import ModalContentPlaceholder from '../placeholder/ModalContentPlaceholder';

import usePerformanceTarget from '../../lib/data/performanceTarget/usePerformanceTarget';

interface ModalPerformanceTargetDetailProps {
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
}

const ModalPerformanceTargetDetail = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceTargetDetailProps) => {
  const { performanceTarget, isPerformanceTargetLoading } =
    usePerformanceTarget(id);
  return (
    <Modal onClose={closePress} open={isOpen} size="tiny">
      <Modal.Header>
        {isPerformanceTargetLoading ? (
          <ModalHeaderPlaceholder />
        ) : (
          <>
            <Header as={'h4'} color="black">
              <Icon name={'info'} circular />
              <Header.Content>
                Key Data
                <Header.Subheader>Target</Header.Subheader>
              </Header.Content>
            </Header>
          </>
        )}
      </Modal.Header>
      <Modal.Content scrolling>
        {isPerformanceTargetLoading ? (
          <ModalContentPlaceholder />
        ) : (
          <>
            <Grid
              columns={'equal'}
              textAlign={'left'}
              style={{ marginBottom: '50px' }}
            >
              <Grid.Row>
                <Grid.Column>
                  <List selection size={'large'} className={'detail'}>
                    <List.Item>
                      Code
                      <List.Header>
                        {renderHyphen(performanceTarget?.code)}
                      </List.Header>
                    </List.Item>
                    <List.Item>
                      Name
                      <List.Header>
                        {renderHyphen(performanceTarget?.name)}
                      </List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </>
        )}
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

export default ModalPerformanceTargetDetail;
