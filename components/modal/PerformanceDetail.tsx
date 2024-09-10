import { Button, Grid, Icon, Label, List, Modal } from 'semantic-ui-react';
import renderHyphen from '../../lib/util/renderHyphen';
import React from 'react';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';
import Snippet from '../Snippet';
import ModalContentPlaceholder from '../placeholder/ModalContentPlaceholder';
import usePerformance from '../../lib/data/performance/usePerformance';

interface ModalPerformanceDetailProps {
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
}

const ModalPerformanceDetail = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceDetailProps) => {
  const { performance, isPerformanceLoading } = usePerformance(id);
  return (
    <Modal onClose={closePress} open={isOpen} size="small">
      <Modal.Header>
        {isPerformanceLoading ? (
          <ModalHeaderPlaceholder />
        ) : (
          <>
            <Snippet title={performance?.name} />
            <Label circular>
              <Icon name={'hashtag'} />
              {performance?.code}
            </Label>
          </>
        )}
      </Modal.Header>
      <Modal.Content scrolling>
        {isPerformanceLoading ? (
          <ModalContentPlaceholder />
        ) : (
          <>
            <Grid columns={'equal'} textAlign={'left'}>
              <Grid.Row>
                <Grid.Column>
                  <List selection size={'large'} className={'detail'}>
                    <List.Item>
                      Description
                      <List.Header>
                        {renderHyphen(performance?.description)}
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

export default ModalPerformanceDetail;
