import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import useSyncProgress, {
  SyncProgressKeyEnum,
  SyncProgressStatusEnum,
} from '../lib/data/syncProgress/useSyncProgress';
import {
  Button,
  Divider,
  Grid,
  Icon,
  Label,
  List,
  Modal,
  Popup,
  SemanticCOLORS,
  SemanticICONS,
  Statistic,
  Placeholder,
} from 'semantic-ui-react';
import { format } from 'date-fns';
import { IconSizeProp } from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';
import { isEmpty } from 'lodash';
import Snippet from './Snippet';
import { getName } from '../lib/util/getName';
import produceLooping from '../lib/util/produceLooping';
import TablePaginationNew from './TablePaginationNew';

type SyncProgressProps = {
  syncKey: SyncProgressKeyEnum;
};

const SyncProgressStatusIcon = ({
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
      case SyncProgressStatusEnum.PROCESSING:
        return ['circle notch', true, undefined];
      case SyncProgressStatusEnum.DONE:
        return ['check circle', false, 'green'];
      case SyncProgressStatusEnum.ERROR:
        return ['times circle', false, 'yellow'];
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

const SyncProgress = forwardRef(({ syncKey }: SyncProgressProps, ref?: any) => {
  const {
    syncProgress,
    syncProgressRefreshPress,
    isSyncProgressLoading,
    isSyncProgressEmpty,
    syncProgressPage,
    syncProgressPagePress,
    syncProgressTotalCount,
    syncProgressTotalPage,
    syncProgressNextFivePagePress,
    syncProgressPrevFivePagePress,
    syncProgressFirstPagePress,
    syncProgressLastPagePress,
  } = useSyncProgress(syncKey);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalData, setModalData] = useState<null | any>(null);

  useImperativeHandle(ref, () => ({
    refresh: () => {
      syncProgressRefreshPress();
    },
  }));

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

  return (
    <>
      <Button size={'tiny'} compact onClick={syncProgressRefreshPress}>
        <Icon name={'refresh'} loading={isSyncProgressLoading} />
        Refresh
      </Button>
      <List relaxed selection divided>
        {isSyncProgressLoading &&
          produceLooping(5).map((i) => (
            <List.Item key={i}>
              <List.Description>
                <Placeholder>
                  <Placeholder.Header image>
                    <Placeholder.Line />
                    <Placeholder.Line />
                  </Placeholder.Header>
                </Placeholder>
              </List.Description>
            </List.Item>
          ))}
        {!isSyncProgressLoading &&
          syncProgress?.map?.((up: any) => (
            <List.Item key={up.id} onClick={openModalPress(up)}>
              <List.Content floated="right" verticalAlign={'middle'}>
                {!up.errorMessage ? (
                  <Button.Group basic compact>
                    <Popup
                      trigger={
                        <Button>
                          <Icon name={'check circle'} color={'green'} />
                          {up.value.totalSucceed}
                        </Button>
                      }
                      content="Total row succeed"
                      inverted
                      position="top center"
                      size={'mini'}
                    />
                    <Popup
                      trigger={
                        <Button>
                          <Icon name={'exclamation circle'} color={'red'} />
                          {up.value.totalFailedRow}
                        </Button>
                      }
                      content="Total row failed"
                      inverted
                      position="top center"
                      size={'mini'}
                    />
                    <Popup
                      trigger={
                        <Button>
                          <Icon name={'info circle'} color={'blue'} />
                          {up.value.totalRow}
                        </Button>
                      }
                      content="Total row"
                      inverted
                      position="top center"
                      size={'mini'}
                    />
                  </Button.Group>
                ) : (
                  <>
                    <Button.Group basic compact>
                      <Button>
                        <Icon name={'warning'} color={'yellow'} />
                        {up.errorMessage}
                      </Button>
                    </Button.Group>
                  </>
                )}
              </List.Content>
              <SyncProgressStatusIcon data={up} isList size={'large'} />
              <List.Content>
                <List.Header as="a">{up.value.filename}</List.Header>
                <List.Description as="a">
                  Started at{' '}
                  {format(new Date(up.createdAt), 'dd-MM-yyyy HH:mm:ss')} by{' '}
                  {getName(up.createdBy) ?? 'system'}
                </List.Description>
              </List.Content>
            </List.Item>
          ))}
      </List>
      {!isSyncProgressLoading && !isSyncProgressEmpty && (
        <div style={{ margin: '10px 0' }}>
          Showing <b>{syncProgress?.length}</b> of{' '}
          <b>{syncProgressTotalCount}</b> entries
          {syncProgressTotalPage > 1 && (
            <TablePaginationNew
              pagePress={syncProgressPagePress}
              totalPage={syncProgressTotalPage}
              activePage={syncProgressPage}
              nextFivePagePress={syncProgressNextFivePagePress}
              prevFivePagePress={syncProgressPrevFivePagePress}
              firstPagePress={syncProgressFirstPagePress}
              lastPagePress={syncProgressLastPagePress}
            />
          )}
        </div>
      )}
      <Modal onClose={closeModalPress} open={modalIsOpen} size="tiny">
        {modalData && (
          <>
            <Modal.Header>
              <Snippet
                title={modalData.value?.filename}
                description={`Started at ${format(
                  new Date(modalData.createdAt),
                  'dd-MM-yyyy HH:mm:ss',
                )} by ${getName(modalData.createdBy) ?? 'system'}`}
                size={'tiny'}
              />
              <Label circular>
                <SyncProgressStatusIcon data={modalData} /> {modalData.status}
              </Label>
            </Modal.Header>
            <Modal.Content scrolling>
              {!modalData.errorMessage ? (
                <Grid>
                  <Grid.Row columns={3}>
                    <Grid.Column className={'centered'}>
                      <Statistic color={'green'} size={'small'}>
                        <Statistic.Value>
                          {modalData.value?.totalSucceed}
                        </Statistic.Value>
                        <Statistic.Label>SUCCEED</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                    <Grid.Column className={'centered'}>
                      <Statistic color={'red'} size={'small'}>
                        <Statistic.Value>
                          {modalData.value?.totalFailedRow}
                        </Statistic.Value>
                        <Statistic.Label>FAILED</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                    <Grid.Column className={'centered'}>
                      <Statistic color={'blue'} size={'small'}>
                        <Statistic.Value>
                          {modalData.value?.totalRow}
                        </Statistic.Value>
                        <Statistic.Label>TOTAL</Statistic.Label>
                      </Statistic>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              ) : (
                <Grid>
                  <Grid.Row columns={1}>
                    <Grid.Column className={'centered'}>
                      <Statistic color={'yellow'} size={'mini'}>
                        <Statistic.Value>
                          {modalData?.errorMessage}
                        </Statistic.Value>
                      </Statistic>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              )}

              {!isEmpty(modalData.value.errors) && (
                <>
                  <Divider />
                  <List selection verticalAlign="middle" size={'tiny'}>
                    {modalData.value.errors.map(
                      ({ rowNumber, message }: any) => (
                        <List.Item key={rowNumber}>
                          <List.Icon bordered name={'warning'} color={'red'} />
                          <List.Content>
                            <List.Header>Row: {rowNumber}</List.Header>
                            {message}
                          </List.Content>
                        </List.Item>
                      ),
                    )}
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
});

SyncProgress.displayName = 'SyncProgress';

export default SyncProgress;
