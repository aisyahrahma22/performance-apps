import {
  Button,
  Grid,
  Icon,
  List,
  Modal,
  Header,
  Segment,
} from 'semantic-ui-react';
import renderHyphen from '../../lib/util/renderHyphen';
import React from 'react';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';
import ModalContentPlaceholder from '../placeholder/ModalContentPlaceholder';
import usePerformanceMeasurementFinalId from '../../lib/data/perfMeasurementFinalResult/usePerfMeasurementFinalId';
import TablePerformanceMeasurementFinalDetail from '../table/PerformanceMeasurementFinalDetail';

interface ModalPerformanceMeasurementDetailProps {
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
}

const ModalPerformanceMeasurementFinalResultDetail = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceMeasurementDetailProps) => {
  const { performanceMeasurementFinal, isPerformanceMeasurementFinalLoading } =
    usePerformanceMeasurementFinalId(id);
  return (
    <Modal onClose={closePress} open={isOpen} size="small">
      <Modal.Header>
        {isPerformanceMeasurementFinalLoading ? (
          <ModalHeaderPlaceholder />
        ) : (
          <>
            <Header as={'h4'} color="black">
              <Icon name={'info'} circular />
              <Header.Content>
                Final Result Template
                <Header.Subheader>
                  {performanceMeasurementFinal?.measurementName}
                </Header.Subheader>
              </Header.Content>
            </Header>
          </>
        )}
      </Modal.Header>
      <Modal.Content scrolling>
        {isPerformanceMeasurementFinalLoading ? (
          <ModalContentPlaceholder />
        ) : (
          <>
            <Grid columns={'equal'} textAlign={'left'}>
              <Grid.Row>
                <Grid.Column>
                  <List selection size={'large'} className={'detail'}>
                    <List.Item>
                     Code
                      <List.Header>
                        {renderHyphen(
                          performanceMeasurementFinal?.measurementCode,
                        )}
                      </List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <List selection size={'large'} className={'detail'}>
                    <List.Item>
                      Name
                      <List.Header>
                        {renderHyphen(
                          performanceMeasurementFinal?.measurementName,
                        )}
                      </List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <List selection size={'large'} className={'detail'}>
                    <List.Item>
                      Year
                      <List.Header>
                        {renderHyphen(performanceMeasurementFinal?.year)}
                      </List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Segment clearing basic>
                <div style={{marginTop: '10px', color: 'black', fontWeight: 'bold'}}>GRADE</div>
                  <TablePerformanceMeasurementFinalDetail
                    data={performanceMeasurementFinal}
                    loading={isPerformanceMeasurementFinalLoading}
                  />
                </Segment>
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

export default ModalPerformanceMeasurementFinalResultDetail;
