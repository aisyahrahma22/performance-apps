import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react';
import useUploadProgress, {
  UploadProgressStatusEnum,
  UploadProgressTypeEnum,
} from '../lib/data/uploadProgress/useUploadProgress';
import {
  Button,
  Icon,
  List,
  ListItem,
  Popup,
  SemanticCOLORS,
  SemanticICONS,
  Table,
} from 'semantic-ui-react';
import { format } from 'date-fns';
import { IconSizeProp } from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';
import TablePlaceholder from './placeholder/TablePlaceholder';
import TablePaginationNew from './TablePaginationNew';

type UploadProgressProps = {
  type: UploadProgressTypeEnum;
};

export const UploadProgressStatusIcon = ({
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
      case UploadProgressStatusEnum.PROCESSING:
        return ['circle notch', true, undefined];
      case UploadProgressStatusEnum.FINISHED:
        return ['check circle', false, 'green'];
      case UploadProgressStatusEnum.STOPPED:
        return ['stop circle', false, 'red'];
      case UploadProgressStatusEnum.ERROR:
        return ['times circle', false, 'red'];
      case UploadProgressStatusEnum.WAITING:
        return ['time', false, 'blue'];
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

const UploadProgress = forwardRef(({ type }: UploadProgressProps, ref: any) => {
  const uploadProgress = useUploadProgress(type);

  useImperativeHandle(ref, () => ({
    refresh: () => {
      uploadProgress.uploadProgressRefreshPress();
    },
  }));

  return (
    <>
      <div>
        <Table
          selectable={!uploadProgress.isUploadProgressLoading}
          className={'nomargin'}
          singleLine
          fixed
          basic
        >
          <Table.Body>
            {uploadProgress.isUploadProgressLoading && (
              <TablePlaceholder rowCount={5} colCount={3} />
            )}
            {!uploadProgress.isUploadProgressLoading &&
              uploadProgress.isUploadProgressEmpty && (
                <Table.Row>
                  <Table.Cell textAlign="center" colSpan={4}>
                    {uploadProgress.isUploadProgressError
                      ? uploadProgress?.isUploadProgressError?.response?.data
                          ?.message || 'Error'
                      : 'No Data'}
                  </Table.Cell>
                </Table.Row>
              )}
            {!uploadProgress.isUploadProgressLoading &&
              uploadProgress.uploadProgress?.map?.((up: any) => (
                <Table.Row key={up?.id}>
                  <Table.Cell width={6}>
                    <Popup
                      offset={[0, 10]}
                      position="top center"
                      wide
                      content={
                        <List>
                          <ListItem>
                            <UploadProgressStatusIcon
                              data={up}
                              isList
                              size="large"
                            />
                            <List.Content>
                              <List.Header as="a">
                                {up.value.filename}
                              </List.Header>
                              {up?.error && (
                                <List.Description>{up?.error}</List.Description>
                              )}
                            </List.Content>
                          </ListItem>
                        </List>
                      }
                      trigger={
                        <List>
                          <ListItem>
                            <UploadProgressStatusIcon
                              data={up}
                              isList
                              size="large"
                            />
                            <List.Content>
                              <List.Header as="a">
                                {up.value.filename}
                              </List.Header>
                              <List.Description as="a">
                                Begin at{' '}
                                {format(
                                  new Date(up.createdAt),
                                  'dd-MM-yyyy HH:mm:ss',
                                )}{' '}
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
                        <List.Content floated="right" verticalAlign={'middle'}>
                          <Button.Group basic compact>
                            <Popup
                              trigger={
                                <Button>
                                  <Icon name={'check circle'} color={'blue'} />
                                  {up.value.totalSucceed}
                                </Button>
                              }
                              content="succeed"
                              inverted
                              position="top center"
                              size={'mini'}
                            />
                            <Popup
                              trigger={
                                <Button>
                                  <Icon
                                    name={'exclamation circle'}
                                    color={'black'}
                                  />
                                  {up.value.totalFailedRow}
                                </Button>
                              }
                              content="failed"
                              inverted
                              position="top center"
                              size={'mini'}
                            />
                          </Button.Group>
                        </List.Content>
                      </List.Item>
                    </List>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
        <div style={{marginBottom: '15px'}}>
        {!uploadProgress.isUploadProgressLoading &&
            !uploadProgress.isUploadProgressEmpty && (
              <>
                Showing <b>{uploadProgress?.uploadProgress?.length}</b> of{' '}
                <b>{uploadProgress?.uploadProgressTotalCount}</b> entries
                {uploadProgress.uploadProgressTotalPage > 1 && (
                  <TablePaginationNew
                    pagePress={uploadProgress.uploadProgressPagePress}
                    totalPage={uploadProgress.uploadProgressTotalPage}
                    activePage={uploadProgress.uploadProgressPage}
                    nextFivePagePress={
                      uploadProgress.uploadProgressNextFivePagePress
                    }
                    prevFivePagePress={
                      uploadProgress.uploadProgressPrevFivePagePress
                    }
                    firstPagePress={uploadProgress.uploadProgressFirstPagePress}
                    lastPagePress={uploadProgress.uploadProgressLastPagePress}
                  />
                )}
              </>
            )}
        </div>
      </div>
    </>
  );
});

UploadProgress.displayName = 'UploadProgress';

export default UploadProgress;
