import { Button, Grid, Icon, List, Modal, Header } from 'semantic-ui-react';
import renderHyphen from '../../lib/util/renderHyphen';
import React from 'react';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';
import ModalContentPlaceholder from '../placeholder/ModalContentPlaceholder';
import usePerformanceProgram from '../../lib/data/performanceProgram/usePerformanceProgram';
import renderEnum from '../../lib/util/renderEnum';
import renderDate from '../../lib/util/renderDate';

interface ModalPerformanceProgramDetailProps {
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
}

const ModalPerformanceProgramDetail = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceProgramDetailProps) => {
  const { performanceProgram, isPerformanceProgramLoading } =
    usePerformanceProgram(id);

    return (
      <Modal onClose={closePress} open={isOpen} size="small">
        <Modal.Header>
          {isPerformanceProgramLoading ? (
            <ModalHeaderPlaceholder />
          ) : (
            <Header as="h4" color="black">
              <Icon name="info" circular />
              <Header.Content>
                Program Detail
                <Header.Subheader>{renderHyphen(performanceProgram?.name)}</Header.Subheader>
              </Header.Content>
            </Header>
          )}
        </Modal.Header>
        <Modal.Content>
          {isPerformanceProgramLoading ? (
            <ModalContentPlaceholder />
          ) : (
            <Grid columns="equal" textAlign="left">
              <Grid.Row>
                <Grid.Column>
                  <List selection size="large" className="detail">
                    <List.Item>
                      Code
                      <List.Header>{renderHyphen(performanceProgram?.code)}</List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <List selection size="large" className="detail">
                    <List.Item>
                      Name
                      <List.Header>{renderHyphen(performanceProgram?.name)}</List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <List selection size="large" className="detail">
                    <List.Item>
                      Term Form
                      <List.Header>{renderHyphen(renderEnum(performanceProgram?.formTerm))}</List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <List selection size="large" className="detail">
                    <List.Item>
                      Final Result Method
                      <List.Header>{renderHyphen(renderEnum(performanceProgram?.finalResultMethod))}</List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <List selection size="large" className="detail">
                    <List.Item>
                      Form Member
                      <List.Header>{renderHyphen(renderEnum(performanceProgram?.formMember))}</List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <List selection size="large" className="detail">
                    <List.Item>
                      Perf Measurement Final Grade
                      <List.Header>{renderHyphen(renderEnum(performanceProgram?.perfMeasurementFinalTemplate?.measurementName))}</List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <List selection size="large" className="detail">
                    <List.Item>
                      Start
                      <List.Header>{renderDate(performanceProgram?.startDate)}</List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <List selection size="large" className="detail">
                    <List.Item>
                      End
                      <List.Header>{renderDate(performanceProgram?.endDate)}</List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Grid columns="equal">
            <Grid.Column>
              <Button size="large" fluid onClick={closePress}>
                Close
              </Button>
            </Grid.Column>
          </Grid>
        </Modal.Actions>
      </Modal>
    );
  };

export default ModalPerformanceProgramDetail;
