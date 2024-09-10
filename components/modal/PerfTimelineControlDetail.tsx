import {
  Button,
  Grid,
  List,
  Modal,
  Header,
  Table,
  Segment,
} from 'semantic-ui-react';
import renderHyphen from '../../lib/util/renderHyphen';
import React from 'react';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';
import ModalContentPlaceholder from '../placeholder/ModalContentPlaceholder';
import usePerfTimelineControlId from '../../lib/data/perfTimelineControl/usePerfTimelineControlId';
import renderDate from '../../lib/util/renderDate';
import Avatar from 'react-avatar';
import TableHeaderCell from '../TableHeaderCell';
import usePerfTimelineControlHistory from '../../lib/data/perfTimelineControl/usePerfTimelineControlHistoryData';
import renderEnum from '../../lib/util/renderEnum';

interface ModalPerfTimelineControlDetailProps {
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
  ids: string;
}

const ModalPerfTimelineControlDetail = ({
  id,
  isOpen,
  closePress,
}: ModalPerfTimelineControlDetailProps) => {
  const { perfTimelineControl, isPerfTimelineControlLoading } =
    usePerfTimelineControlId(id);
  const { perfTimelineControlHistory, isPerfTimelineControlHistoryLoading } =
    usePerfTimelineControlHistory(id);

  return (
    <Modal onClose={closePress} open={isOpen}  size="small"
    style={{ height: '30vh', top: '20%' }}>
      <Modal.Header>
        {isPerfTimelineControlLoading ? (
          <ModalHeaderPlaceholder />
        ) : (
          <>
            <Header as={'h2'} color="black">
              <Header.Content style={{ marginLeft: '10px' }}>
                {renderHyphen(perfTimelineControl?.employee?.fullName)}
                <Header.Subheader>
                  {' '}
                  {renderHyphen(perfTimelineControl?.employee?.position?.name)}
                </Header.Subheader>
              </Header.Content>
            </Header>
          </>
        )}
      </Modal.Header>
      <Modal.Content scrolling>
        {isPerfTimelineControlLoading ? (
          <ModalContentPlaceholder />
        ) : (
          <>
            <Grid columns={'equal'} textAlign={'left'}>
              <Grid.Row>
                <Grid.Column>
                  <List selection size={'large'} className={'detail'}>
                    <List.Item>
                      Form Name
                      <List.Header>
                        {renderHyphen(
                          perfTimelineControl?.perfForm?.perfFormName?.name,
                        )}
                      </List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <List selection size={'large'} className={'detail'}>
                    <List.Item>
                      Timeline Status
                      <List.Header>
                        {renderEnum(perfTimelineControl?.timelineSeq?.timeline)}
                      </List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <List selection size={'large'} className={'detail'}>
                    <List.Item>
                      End Date
                      <List.Header>
                        {renderDate(perfTimelineControl?.timelineSeq?.endDate)}
                      </List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Segment className={'nopaddingh '}>
                    <Table
                      className={'nomargin'}
                      color={'black'}
                      singleLine
                      compact
                      fixed
                    >
                      <Table.Header>
                        <Table.Row>
                          <TableHeaderCell
                            width={5}
                            className={'margin'}
                            attribute={'previous'}
                            name={'Prev Timeline'}
                          />
                          <TableHeaderCell
                            width={5}
                            className={'margin'}
                            attribute={'updated'}
                            name={'New Timeline'}
                          />
                          <TableHeaderCell
                            width={3}
                            className={'margin'}
                            attribute={'date'}
                            name={'Date'}
                          />
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {!isPerfTimelineControlHistoryLoading &&
                          perfTimelineControlHistory?.map((data: any) => (
                            <Table.Row key={data?.id}>
                              <Table.Cell>
                                {renderEnum(data?.prevTimelineSeq?.timeline)}
                              </Table.Cell>
                              <Table.Cell>
                                {renderEnum(data?.timelineSeq?.timeline)}
                              </Table.Cell>
                              <Table.Cell>
                                {renderDate(data?.updatedAt)}
                              </Table.Cell>
                            </Table.Row>
                          ))}
                      </Table.Body>
                    </Table>
                  </Segment>
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

export default ModalPerfTimelineControlDetail;
