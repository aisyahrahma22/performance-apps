import { Button, Grid, Icon, List, Modal, Header } from 'semantic-ui-react';
import renderHyphen from '../../lib/util/renderHyphen';
import React from 'react';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';

import ModalContentPlaceholder from '../placeholder/ModalContentPlaceholder';

import usePerformanceType from '../../lib/data/performanceType/usePerformanceType';

interface ModalPerformanceTypeDetailProps {
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
}

const ModalPerformanceTypeDetail = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceTypeDetailProps) => {
  const { performanceType, isPerformanceTypeLoading } = usePerformanceType(id);
  return (
    <Modal onClose={closePress} open={isOpen} size="tiny">
      <Modal.Header>
        {isPerformanceTypeLoading ? (
          <ModalHeaderPlaceholder />
        ) : (
          <>
            <Header as={'h4'} color="black">
              <Icon name={'info'} circular />
              <Header.Content>
                Key Data
                <Header.Subheader>Performance Type</Header.Subheader>
              </Header.Content>
            </Header>
          </>
        )}
      </Modal.Header>
      <Modal.Content scrolling>
        {isPerformanceTypeLoading ? (
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
                        {renderHyphen(performanceType?.code)}
                      </List.Header>
                    </List.Item>
                    <List.Item>
                      Name
                      <List.Header>
                        {renderHyphen(performanceType?.name)}
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

export default ModalPerformanceTypeDetail;
