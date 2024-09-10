import { Button, Grid, Icon, List, Modal, Header } from 'semantic-ui-react';
import renderHyphen from '../../lib/util/renderHyphen';
import React from 'react';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';

import ModalContentPlaceholder from '../placeholder/ModalContentPlaceholder';

import usePerformanceKRA from '../../lib/data/performanceKRA/usePerformanceKRA';

interface ModalPerformanceKRADetailProps {
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
}

const ModalPerformanceKRADetail = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceKRADetailProps) => {
  const { performanceKRA, isPerformanceKRALoading } = usePerformanceKRA(id);
  return (
    <Modal onClose={closePress} open={isOpen} size="tiny">
      <Modal.Header>
        {isPerformanceKRALoading ? (
          <ModalHeaderPlaceholder />
        ) : (
          <>
            <Header as={'h4'} color="black">
              <Icon name={'info'} circular />
              <Header.Content>
                Key Data
                <Header.Subheader>KRA</Header.Subheader>
              </Header.Content>
            </Header>
          </>
        )}
      </Modal.Header>
      <Modal.Content scrolling>
        {isPerformanceKRALoading ? (
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
                        {renderHyphen(performanceKRA?.code)}
                      </List.Header>
                    </List.Item>
                    <List.Item>
                      Name
                      <List.Header>
                        {renderHyphen(performanceKRA?.name)}
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

export default ModalPerformanceKRADetail;
