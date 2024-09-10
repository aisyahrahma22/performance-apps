import { Button, Grid, Icon, List, Modal, Header } from 'semantic-ui-react';
import renderHyphen from '../../lib/util/renderHyphen';
import React from 'react';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';
import ModalContentPlaceholder from '../placeholder/ModalContentPlaceholder';
import usePerformanceSiloamValue from '../../lib/data/performanceSiloamValue/usePerformanceSiloamValue';

interface ModalPerformanceSiloamValueDetailProps {
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
}

const ModalSiloamValueDetail = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceSiloamValueDetailProps) => {
  const performanceSiloamValue = usePerformanceSiloamValue(id);

  return (
    <Modal onClose={closePress} open={isOpen} size="small">
      <Modal.Header>
        {performanceSiloamValue?.isPerformanceSiloamValueLoading ? (
          <ModalHeaderPlaceholder />
        ) : (
          <>
            <Header as={'h4'} color="teal">
              <Icon name={'eye'} circular />
              <Header.Content>
                Master Data
                <Header.Subheader>Siloam Value</Header.Subheader>
              </Header.Content>
            </Header>
          </>
        )}
      </Modal.Header>
      <Modal.Content scrolling>
        {performanceSiloamValue?.isPerformanceSiloamValueLoading ? (
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
                        {renderHyphen(
                          performanceSiloamValue?.performanceSiloamValue?.id,
                        )}
                      </List.Header>
                    </List.Item>
                    <List.Item>
                      Name
                      <List.Header>
                        {renderHyphen(
                          performanceSiloamValue?.performanceSiloamValue?.name,
                        )}
                      </List.Header>
                    </List.Item>
                    <List.Item>
                      Description
                      <List.Header>
                        {renderHyphen(
                          performanceSiloamValue?.performanceSiloamValue
                            ?.description,
                        )}
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

export default ModalSiloamValueDetail;
