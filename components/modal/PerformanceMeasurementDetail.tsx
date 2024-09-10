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
import usePerformanceMeasurementFormsType from '../../lib/data/performanceMeasurementForm/usePerfMeasurementForms';
import TablePerformanceMeasurementFormDetail from '../../components/table/PerformanceMeasurementFormDetail';

interface ModalPerformanceMeasurementDetailProps {
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
}

const ModalPerformanceMeasurementDetail = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceMeasurementDetailProps) => {
  const { performanceMeasurement, isPerformanceMeasurementLoading } =
    usePerformanceMeasurementFormsType(id);

  return (
    <Modal onClose={closePress} open={isOpen} size="small">
      <Modal.Header>
        {isPerformanceMeasurementLoading ? (
          <ModalHeaderPlaceholder />
        ) : (
          <>
            <Header as={'h4'} color="black">
              <Icon name={'info'} circular />
              <Header.Content>
                Measurement Template
                <Header.Subheader>
                  {performanceMeasurement?.templateName}
                </Header.Subheader>
              </Header.Content>
            </Header>
          </>
        )}
      </Modal.Header>
      <Modal.Content scrolling>
        {isPerformanceMeasurementLoading ? (
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
                        {renderHyphen(performanceMeasurement?.templateCode)}
                      </List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <List selection size={'large'} className={'detail'}>
                    <List.Item>
                      Name
                      <List.Header>
                        {renderHyphen(performanceMeasurement?.templateName)}
                      </List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <List selection size={'large'} className={'detail'}>
                    <List.Item>
                      Performance Type
                      <List.Header>
                        {renderHyphen(
                          performanceMeasurement?.performanceType?.name,
                        )}
                      </List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <List selection size={'large'} className={'detail'}>
                    <List.Item>
                      Year
                      <List.Header>
                        {renderHyphen(performanceMeasurement?.year)}
                      </List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Segment clearing className={'nopadding'}>
                  <TablePerformanceMeasurementFormDetail
                    data={performanceMeasurement}
                    loading={isPerformanceMeasurementLoading}
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

export default ModalPerformanceMeasurementDetail;
