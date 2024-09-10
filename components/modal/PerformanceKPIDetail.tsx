import { Button, Grid, Icon, List, Modal, Header } from 'semantic-ui-react';
import renderHyphen from '../../lib/util/renderHyphen';
import React from 'react';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';

import ModalContentPlaceholder from '../placeholder/ModalContentPlaceholder';

import usePerformanceKPI from '../../lib/data/performanceKPI/usePerformanceKPI';

interface ModalPerformanceKPIDetailProps {
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
}

const ModalPerformanceKPIDetail = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceKPIDetailProps) => {
  const { performanceKPI, isPerformanceKPILoading } = usePerformanceKPI(id);
  return (
    <Modal
      onClose={closePress}
      open={isOpen}
      size="tiny"
      closeOnDimmerClick={false}
    >
      <Modal.Header>
        {isPerformanceKPILoading ? (
          <ModalHeaderPlaceholder />
        ) : (
          <>
            <Header as={'h4'} color="black">
              <Icon name={'info'} circular />
              <Header.Content>
                Key Data
                <Header.Subheader>KPI</Header.Subheader>
              </Header.Content>
            </Header>
          </>
        )}
      </Modal.Header>
      <Modal.Content scrolling style={{ minHeight: '80%' }}>
        {isPerformanceKPILoading ? (
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
                        {renderHyphen(performanceKPI?.code)}
                      </List.Header>
                    </List.Item>
                    <List.Item>
                      Name
                      <List.Header>
                        {renderHyphen(performanceKPI?.name)}
                      </List.Header>
                    </List.Item>
                    <List.Item>
                      Description
                      <List.Header>
                        {renderHyphen(performanceKPI?.description)}
                      </List.Header>
                    </List.Item>
                    <List.Item>
                      Key Action
                      <List.Header>
                        {renderHyphen(performanceKPI?.keyAction)}
                      </List.Header>
                    </List.Item>
                    <List.Item>
                      Behaviour
                      <List.Header>
                        {renderHyphen(performanceKPI?.behaviour)}
                      </List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </>
        )}
      </Modal.Content>
      <Modal.Actions
        style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}
      >
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

export default ModalPerformanceKPIDetail;
