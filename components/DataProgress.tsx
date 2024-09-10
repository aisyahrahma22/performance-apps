import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import useDataProgress, {
  DataProgressStatusEnum,
  DataProgressTypeEnum,
} from '../lib/data/dataProgress/useDataProgress';
import {
  Button,
  Divider,
  Grid,
  Icon,
  Label,
  List,
  ListItem,
  Modal,
  Popup,
  Segment,
  SemanticCOLORS,
  SemanticICONS,
  Statistic,
  Table,
} from 'semantic-ui-react';
import { format } from 'date-fns';
import { IconSizeProp } from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';
import { isEmpty } from 'lodash';
import Snippet from './Snippet';
import { getName } from '../lib/util/getName';
import TablePlaceholder from './placeholder/TablePlaceholder';
import { calculateElapsedTime } from '../lib/util/calculateElapsedTime';
import TablePaginationNew from './TablePaginationNew';

type DataProgressProps = {
  type: DataProgressTypeEnum;
  getDownload?: any;
  isButtonDownload?: boolean;
  isButtonStop?: boolean;
  getStop?: any;
  api?: string;
};

const renderLabel = (up: any) =>
  `${up?.progressCode} ${up?.progressName ? `- ${up?.progressName}.xlxs` : ''}`;

export const DataProgressStatusIcon = ({
  data,
  isList = false,
  size,
}: {
  data: any;
  isList?: boolean;
  size?: IconSizeProp;
}) => {
  const [iconName, iconLoading, iconColor] = useMemo<
    [SemanticICONS, boolean, SemanticCOLORS | undefined]
  >(() => {
    switch (data.status) {
      case DataProgressStatusEnum.PROCESSING:
        return ['circle notch', true, undefined];
      case DataProgressStatusEnum.FINISHED:
        return ['check circle', false, 'green'];
      case DataProgressStatusEnum.STOPPED:
        return ['stop circle', false, 'red'];
      case DataProgressStatusEnum.ERROR:
        return ['times circle', false, 'red'];
      default:
        return ['circle', false, undefined];
    }
  }, [data.status]);
  return isList ? (
    <List.Icon
      name={iconName}
      loading={iconLoading}
      color={iconColor}
      size={size}
      verticalAlign={isList ? 'middle' : undefined}
    />
  ) : (
    <Icon name={iconName} loading={iconLoading} color={iconColor} size={size} />
  );
};

const DataProgress = forwardRef(
  (
    {
      type,
      getDownload,
      isButtonDownload,
      isButtonStop,
      getStop,
      api,
    }: DataProgressProps,
    ref: any,
  ) => {
    const {
      dataProgress,
      isDataProgressEmpty,
      isDataProgressLoading,
      isDataProgressError,
      dataProgressTotalCount,
      dataProgressTotalPage,
      dataProgressPage,
      dataProgressRefreshPress,
      dataProgressPagePress,
      dataProgressNextFivePagePress,
      dataProgressPrevFivePagePress,
      dataProgressFirstPagePress,
      dataProgressLastPagePress,
    } = useDataProgress(type);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalData, setModalData] = useState<null | any>(null);

    useImperativeHandle(ref, () => ({
      refresh: () => {
        dataProgressRefreshPress();
      },
    }));

    const onStopDownload = async (id: string) => {
      await getStop(id);
      dataProgressRefreshPress();
    };

    const openModalPress = useCallback(
      (data) => () => {
        setModalData(data);
        setModalIsOpen(true);
      },
      [],
    );

    const closeModalPress = useCallback(() => {
      setModalData(null);
      setModalIsOpen(false);
    }, []);

    const onDownload = useCallback(
      (id: string) => {
        getDownload(api, id);
      },
      [api, getDownload],
    );

    return (
      <>
        <Button size={'tiny'} compact onClick={dataProgressRefreshPress}>
          <Icon name={'refresh'} loading={isDataProgressLoading} />
          Refresh
        </Button>
        <div>
          <Table
            selectable={!isDataProgressLoading}
            className={'nomargin'}
            singleLine
            fixed
          >
            <Table.Body>
              {isDataProgressLoading && (
                <TablePlaceholder rowCount={5} colCount={3} />
              )}
              {!isDataProgressLoading && isDataProgressEmpty && (
                <Table.Row>
                  <Table.Cell textAlign="center" colSpan={4}>
                    {isDataProgressError
                      ? isDataProgressError?.response?.data?.message || 'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
              {!isDataProgressLoading &&
                dataProgress?.map?.((up: any) => (
                  <Table.Row key={up?.id}>
                    <Table.Cell width={8} onClick={openModalPress(up)}>
                      <Popup
                        offset={[0, 10]}
                        position="top center"
                        wide
                        content={
                          <List>
                            <ListItem>
                              <DataProgressStatusIcon
                                data={up}
                                isList
                                size={'large'}
                              />
                              <List.Content>
                                <List.Header as="a">
                                  {renderLabel(up)}
                                </List.Header>
                                {up?.error && (
                                  <List.Description>
                                    {up?.error}
                                  </List.Description>
                                )}
                              </List.Content>
                            </ListItem>
                          </List>
                        }
                        trigger={
                          <List>
                            <ListItem>
                              <DataProgressStatusIcon
                                data={up}
                                isList
                                size={'large'}
                              />
                              <List.Content>
                                <List.Header as="a">
                                  {renderLabel(up)}
                                </List.Header>
                                <List.Description as="a">
                                  Started at{' '}
                                  {format(
                                    new Date(up.createdAt),
                                    'dd-MM-yyyy HH:mm:ss',
                                  )}{' '}
                                  by {getName(up.createdBy)}
                                </List.Description>
                              </List.Content>
                            </ListItem>
                          </List>
                        }
                      />
                    </Table.Cell>
                    <Table.Cell width={5}>
                      <List>
                        <List.Item>
                          <List.Content>
                            <List.Header
                              as="a"
                              style={{
                                margin: '5px 0',
                                wordBreak: 'break-all',
                              }}
                            >
                              Elapsed time:&nbsp;
                              {calculateElapsedTime(
                                new Date(up?.createdAt),
                                new Date(up?.finishedAt),
                              )}
                            </List.Header>
                            {up.status !== DataProgressStatusEnum.STOPPED && (
                              <List.Description as="a">
                                {up?.batch} of&nbsp;
                                {up?.totalBatch} batch processed
                              </List.Description>
                            )}
                          </List.Content>
                        </List.Item>
                      </List>
                    </Table.Cell>
                    <Table.Cell width={3}>
                      <List>
                        <List.Item>
                          <List.Content
                            floated="right"
                            verticalAlign={'middle'}
                          >
                            <Button.Group basic compact>
                              <Popup
                                trigger={
                                  <Button onClick={openModalPress(up)}>
                                    <Icon
                                      name={'check circle'}
                                      color={'blue'}
                                    />
                                    {up?.batch}
                                  </Button>
                                }
                                content="Total row succeed"
                                inverted
                                position="top center"
                                size={'mini'}
                              />
                              <Popup
                                trigger={
                                  <Button onClick={openModalPress(up)}>
                                    <Icon name={'info circle'} color={'black'} />
                                    {up?.totalBatch}
                                  </Button>
                                }
                                content="Total row"
                                inverted
                                position="top center"
                                size={'mini'}
                              />
                              {isButtonDownload && (
                                <Button
                                  onClick={() => onDownload(up?.id)}
                                  disabled={
                                    up?.status !==
                                    DataProgressStatusEnum.FINISHED
                                  }
                                >
                                  <Icon name={'download'} color={'green'} />
                                </Button>
                              )}
                              {isButtonStop && (
                                <Button
                                  onClick={() => onStopDownload(up?.id)}
                                  disabled={
                                    up?.status !==
                                    DataProgressStatusEnum.PROCESSING
                                  }
                                >
                                  <Icon name={'stop'} color={'red'} />
                                </Button>
                              )}
                            </Button.Group>
                          </List.Content>
                        </List.Item>
                      </List>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
          <Segment clearing basic className={'nomargin'}>
            {!isDataProgressLoading && !isDataProgressEmpty && (
              <>
                Showing <b>{dataProgress?.length}</b> of{' '}
                <b>{dataProgressTotalCount}</b> entries
                {dataProgressTotalPage > 1 && (
                  <TablePaginationNew
                    pagePress={dataProgressPagePress}
                    totalPage={dataProgressTotalPage}
                    activePage={dataProgressPage}
                    nextFivePagePress={dataProgressNextFivePagePress}
                    prevFivePagePress={dataProgressPrevFivePagePress}
                    firstPagePress={dataProgressFirstPagePress}
                    lastPagePress={dataProgressLastPagePress}
                  />
                )}
              </>
            )}
          </Segment>
        </div>
        <Modal onClose={closeModalPress} open={modalIsOpen} size="tiny">
          {modalData && (
            <>
              <Modal.Header>
                <Snippet
                  title={renderLabel(modalData)}
                  description={`Started at ${format(
                    new Date(modalData.createdAt),
                    'dd-MM-yyyy HH:mm:ss',
                  )} by ${getName(modalData.createdBy)}`}
                  size={'tiny'}
                />
                <Label circular>
                  <DataProgressStatusIcon data={modalData} /> {modalData.status}
                </Label>
              </Modal.Header>
              <Modal.Content scrolling>
                {modalData.status == DataProgressStatusEnum.ERROR ? (
                  modalData.error
                ) : (
                  <Grid>
                    <Grid.Row columns={3}>
                      <Grid.Column className={'centered'}>
                        <Statistic color={'green'} size={'small'}>
                          <Statistic.Value>{modalData.batch}</Statistic.Value>
                          <Statistic.Label>SUCCEED</Statistic.Label>
                        </Statistic>
                      </Grid.Column>
                      {/* <Grid.Column className={'centered'}>
                    <Statistic color={'red'} size={'small'}>
                      <Statistic.Value>{modalData.error}</Statistic.Value>
                      <Statistic.Label>ERROR</Statistic.Label>
                    </Statistic>
                  </Grid.Column> */}
                      <Grid.Column className={'centered'}>
                        <Statistic color={'blue'} size={'small'}>
                          <Statistic.Value>
                            {modalData.totalBatch}
                          </Statistic.Value>
                          <Statistic.Label>TOTAL BATCH</Statistic.Label>
                        </Statistic>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                )}
                {!isEmpty(modalData?.errors) && (
                  <>
                    <Divider />
                    <List selection verticalAlign="middle" size={'tiny'}>
                      {modalData?.errors.map(({ batch, message }: any) => (
                        <List.Item key={batch}>
                          <List.Icon bordered name={'warning'} color={'red'} />
                          <List.Content>
                            <List.Header>Batch: {batch}</List.Header>
                            {message}
                          </List.Content>
                        </List.Item>
                      ))}
                    </List>
                  </>
                )}
              </Modal.Content>
            </>
          )}
          <Modal.Actions>
            <Grid columns="equal">
              <Grid.Column>
                <Button fluid onClick={closeModalPress}>
                  Close
                </Button>
              </Grid.Column>
            </Grid>
          </Modal.Actions>
        </Modal>
      </>
    );
  },
);

DataProgress.displayName = 'DataProgress';

export default DataProgress;
