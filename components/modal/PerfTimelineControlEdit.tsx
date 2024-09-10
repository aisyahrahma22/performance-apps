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
import React, { useMemo } from 'react';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';
import ModalContentPlaceholder from '../placeholder/ModalContentPlaceholder';
import usePerfTimelineControlId from '../../lib/data/perfTimelineControl/usePerfTimelineControlId';
import renderDate from '../../lib/util/renderDate';
import Avatar from 'react-avatar';
import { useFormik } from 'formik';
import usePerfTimelineControlEdit from '../../lib/data/perfTimelineControl/usePerfTimelineControlEdit';
import * as yup from 'yup';
import TableHeaderCell from '../TableHeaderCell';
import usePerfTimelineControlHistory from '../../lib/data/perfTimelineControl/usePerfTimelineControlHistoryData';
import usePerfTimelineDropdown from '../../lib/data/perfTimelineControl/usePerfTimelineDropdown';
import renderEnum from '../../lib/util/renderEnum';
import InputDropdownSimple from '../InputDropdownSimple';
import { unionBy } from 'lodash';

interface ModalPerfTimelineControlEditProps {
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
  ids: string;
}

const formPerfTimelineControlEditSchema = yup.object({
  timelines: yup.string().required('Timelines is required'),
});

const ModalPerfTimelineControlEdit = ({
  id,
  isOpen,
  closePress,
}: ModalPerfTimelineControlEditProps) => {
  const { perfTimelineControl, isPerfTimelineControlLoading } =
    usePerfTimelineControlId(id);
  const { perfTimelineControlHistory, isPerfTimelineControlHistoryLoading } =
    usePerfTimelineControlHistory(id);
  const { perfTimelineDropdown, isPerfTimelineDropdownLoading } =
    usePerfTimelineDropdown(perfTimelineControl?.perfForm?.id);

  const { perfTimelineControlEditPosting } = usePerfTimelineControlEdit({
    onSuccess: closePress,
  });

  const initialItems = useMemo<any>(() => {
    return {
      id: perfTimelineControl?.id,
      timelines: perfTimelineControl?.timelineSeq?.id,
    };
  }, [perfTimelineControl]);

  const initialDropdownName =
    perfTimelineDropdown?.map((i: any) => ({
      key: i?.id,
      value: i?.id,
      text: renderEnum(i?.timeline),
    })) || [];

  const initialDropdown = useMemo(() => {
    const opt = unionBy(initialDropdownName, initialItems, 'value');
    return opt;
  }, [perfTimelineDropdown]);

  const formikPerfTimelineControlEdit = useFormik({
    initialValues: initialItems,
    enableReinitialize: true,
    onSubmit: (values) => {
      perfTimelineControlEditPosting({ ...values, id });
    },
    validationSchema: formPerfTimelineControlEditSchema,
  });

  return (
    <Modal
      onClose={closePress}
      open={isOpen}
      size="small"
      style={{ height: '30vh', top: '10%' }}
      closeOnDimmerClick={false}
    >
      {/* Header section of modal */}
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

            {/* <br />
            <br /> */}
          </>
        )}
      </Modal.Header>
      <Modal.Content scrolling style={{ minHeight: 'calc(30vh - 10em)' }}>
        {isPerfTimelineControlLoading ? (
          <ModalContentPlaceholder />
        ) : (
          <>
            <Segment clearing basic className={'nopadding'}>
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
                          {renderEnum(
                            perfTimelineControl?.timelineSeq?.timeline,
                          )}
                        </List.Header>
                      </List.Item>
                    </List>
                  </Grid.Column>
                  <Grid.Column>
                    <List selection size={'large'} className={'detail'}>
                      <List.Item>
                        End Date
                        <List.Header>
                          {renderDate(
                            perfTimelineControl?.timelineSeq?.endDate,
                          )}
                        </List.Header>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Grid>
                <Grid.Row>
                  <Grid.Column verticalAlign="middle">
                    {!isPerfTimelineDropdownLoading ? (
                      <>
                        <label
                          style={{
                            fontSize: '13px',
                            paddingBottom: '20px',
                            fontWeight: 'lighter',
                            color: 'grey',
                          }}
                        >
                          Change Timeline
                        </label>
                        <div style={{ marginBottom: '7px' }}></div>
                        <InputDropdownSimple
                          name={'timelines'}
                          formik={formikPerfTimelineControlEdit}
                          placeholder={'Change Timeline'}
                          label={''}
                          type={'text'}
                          selectOnBlur={false}
                          options={initialDropdown}
                          selection
                          search
                          allowAdditions
                        />
                      </>
                    ) : (
                      <>Loading</>
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Grid>
                <Grid.Row>
                  <Grid.Column>
                    <Segment className={'nopaddingh'}>
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
                        {!isPerfTimelineControlHistoryLoading &&
                        perfTimelineControlHistory?.length > 0 ? (
                          <>
                            {perfTimelineControlHistory?.map((data: any) => (
                              <Table.Body key={data?.id}>
                                <Table.Row>
                                  <Table.Cell>
                                    {renderEnum(
                                      data?.prevTimelineSeq?.timeline,
                                    )}
                                  </Table.Cell>
                                  <Table.Cell>
                                    {renderEnum(data?.timelineSeq?.timeline)}
                                  </Table.Cell>
                                  <Table.Cell>
                                    {renderDate(data?.updatedAt)}
                                  </Table.Cell>
                                </Table.Row>
                              </Table.Body>
                            ))}
                          </>
                        ) : (
                          <>
                            <Table.Body>
                              <Table.Row>
                                <Table.Cell textAlign={'center'} colSpan={5}>
                                  <div
                                    style={{
                                      marginBottom: '7px',
                                      textAlign: 'center',
                                    }}
                                  >
                                    No Data
                                  </div>
                                </Table.Cell>
                              </Table.Row>
                            </Table.Body>
                          </>
                        )}
                      </Table>
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          </>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Grid columns="equal">
          <Grid.Column>
            <Button size={'large'} onClick={closePress} fluid type={'button'}>
              Close
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button
              color={'black'}
              fluid
              size={'large'}
              onClick={formikPerfTimelineControlEdit.handleSubmit as any}
              type={'submit'}
              disabled={!formikPerfTimelineControlEdit.dirty}
            >
              Save
            </Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalPerfTimelineControlEdit;
