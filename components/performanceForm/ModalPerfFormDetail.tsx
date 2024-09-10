import React, { useCallback, useState } from 'react';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form/Form';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid/Grid';
import Table from 'semantic-ui-react/dist/commonjs/collections/Table/Table';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header/Header';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input/Input';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label/Label';
import List from 'semantic-ui-react/dist/commonjs/elements/List/List';
import Segment from 'semantic-ui-react/dist/commonjs/elements/Segment/Segment';
import Checkbox from 'semantic-ui-react/dist/commonjs/modules/Checkbox/Checkbox';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';
import usePerformanceForm, {
  DataKPI,
  DataKRA,
  DataPerfCategory,
  DataPerfType,
  DataTarget,
} from '../../lib/data/performanceForm/usePerformanceForm';
import usePerformanceFormFilled from '../../lib/data/performanceForm/usePerformanceFormFilled';
import usePerfFormRecall from '../../lib/data/performanceForm/usePerformanceFormRecall';
import { PerfFormStatusEnum } from '../../lib/enums/PerfForm';
import renderHyphen from '../../lib/util/renderHyphen';
import { renderNumber } from '../../lib/util/renderNumber';
import ModalPublishConfirmation from '../ModalPublishConfirmation';
import ModalContentPlaceholder from '../placeholder/ModalContentPlaceholder';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';
import Snippet from '../Snippet';
import TableHeaderCell from '../TableHeaderCell';
import TableTimelineSequence from './components/TimelineSequence';
import PerfProgramDetail from './components/PerfProgramDetail';
import useParticipantCount from '../../lib/data/performanceForm/useParticipantCount';

interface ModalPerformanceFormDetailProps {
  data: any;
  isOpen: boolean;
  sync: boolean;
  closePress: () => void;
}

function ModalPerfFormDetail({
  data,
  isOpen,
  closePress,
  sync,
}: ModalPerformanceFormDetailProps) {
  // API
  const {
    performanceForm,
    isPerformanceFormLoading,
    performanceFormRefreshPress,
  } = usePerformanceForm(data.id);

  const {
    performanceFormFilled,
    isPerformanceFormFilledError,
    isPerformanceFormFilledLoading,
  } = usePerformanceFormFilled(data.id);

  // perf form label color
  const statusLabelColor = (status: string | undefined) => {
    switch (status) {
      case PerfFormStatusEnum.PUBLISHED:
        return 'teal';
      default:
        return undefined;
    }
  };

  // perf program hide toggle
  const [isHide, setIsHide] = useState(false);

  // Modal Form Recall toggle
  const [isModalPerfFormRecall, setIsModalPerfFormRecall] = useState(false);

  const perfFormRecallOpenPress = useCallback(() => {
    setIsModalPerfFormRecall(true);
  }, []);

  const perfFormRecallClosePress = useCallback(() => {
    performanceFormRefreshPress();
    setIsModalPerfFormRecall(false);
  }, [performanceFormRefreshPress]);

  const { perfFormRecallPosting, isPerfFormRecallLoading } = usePerfFormRecall({
    onSuccess: closePress,
  });

  const recallPerfForm = useCallback(
    (id) => () => {
      perfFormRecallPosting(id);
    },
    [perfFormRecallPosting],
  );
  // dipindahkan kesini agar bisa tau loadingnya sehingga disable recall agar data tidak berantakan
  const { formParticipantCount, isFormParticipantCountLoading } =
    useParticipantCount(data.id, data.formMember);
  return (
    <Modal
      onClose={closePress}
      open={isOpen}
      closeOnDimmerClick={false}
      size={'large'} 
      style={{ height: '93%'}}
    >
      <Modal.Header>
        {isPerformanceFormLoading || !performanceForm ? (
          <ModalHeaderPlaceholder />
        ) : (
          <div>
            <Snippet title={performanceForm.perfFormName.name} />
          </div>
        )}
      </Modal.Header>
      <Modal.Content scrolling className={`modal-content-perf-form-mid`}>
        {isPerformanceFormLoading || !performanceForm ? (
          <ModalContentPlaceholder />
        ) : (
          <>
            {/* Performance Program Component */}
            <div>
            <Header as={'h4'} color={'blue'} style={{ marginBottom: '20px' }}>
                PROGRAM PERFORMANCE 
              </Header>
              <Grid>
                <Grid.Row>
                  <Grid.Column>
                    <Segment clearing>
                      {/* Performance Program Title Section */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Header as={'h4'} color={'blue'}>
                          {renderHyphen(performanceForm?.perfProgram?.name)}
                        </Header>
                        <Button
                          icon={isHide ? 'chevron down' : 'chevron up'}
                          onClick={() => setIsHide(!isHide)}
                          basic
                          compact
                          size="small"
                        />
                      </div>
                      {/* Performance Program Detail Section */}
                      {!isHide && (
                        <PerfProgramDetail
                          performanceForm={performanceForm}
                          formParticipantCount={formParticipantCount}
                          isFormParticipantCountLoading={
                            isFormParticipantCountLoading
                          }
                        />
                      )}
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
            {/* Timeline Component */}
            <TableTimelineSequence
              isModalView={true}
              sequencesResponse={performanceForm?.sequences}
            />

            <Segment clearing basic>
              <Header as={'h4'} color={'black'}>
                TYPE OF PERFORMANCE
              </Header>
            </Segment>
            <PerfFormSectionDetails
              dataPerfTypeArr={performanceForm?.dataPerfType}
              loading={isPerformanceFormLoading}
            />
          </>
        )}
      </Modal.Content>

      <Modal.Actions>
        <Grid>
          <Grid.Column>
            <Button size={'large'} fluid onClick={closePress} style={{marginTop: '10px'}}>
              Close
            </Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
}

type PerfFormSectionProps = {
  dataPerfTypeArr: DataPerfType[];
  loading: false;
};

const PerfFormSectionDetails = ({
  dataPerfTypeArr,
  loading,
}: PerfFormSectionProps) => {
  const [showItem, setShowItem] = useState(true);
  return (
    <>
      {!loading &&
        dataPerfTypeArr?.map((dataPerfType) => (
          <Segment key={dataPerfType?.id} padded={showItem ? true : false}>
            <Grid columns={'equal'}>
              <Grid.Row className={showItem ? 'nopaddingb' : ''}>
                <Grid.Column verticalAlign="middle" width={12}>
                  <Header
                    size={'small'}
                    color={'blue'}
                    style={{ marginTop: '0px' }}
                  >
                    {dataPerfType?.perfTypeId?.name}
                  </Header>
                </Grid.Column>
                <Grid.Column verticalAlign="middle" floated="right" width={3}>
                  <Header size={'small'} color={'black'}>
                    Performance Type Weight : {dataPerfType?.weight} %
                  </Header>
                </Grid.Column>
                <Grid.Column width={1} floated="right">
                  <Button
                    size={'tiny'}
                    floated="right"
                    onClick={() => setShowItem(!showItem)}
                    basic
                    icon
                  >
                    <Icon name={showItem ? 'angle down' : 'angle up'} />
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            {showItem && (
              <Grid columns={'equal'}>
                <Grid.Row>
                  <Grid.Column>
                    <List selection size={'large'} className={'detail'}>
                      <List.Item>
                        Using Mid Year Score
                        <List.Header>
                          {dataPerfType?.isMidYearScore ? 'Yes' : 'No'}
                        </List.Header>
                      </List.Item>
                    </List>
                  </Grid.Column>
                  <Grid.Column>
                    <List selection size={'large'} className={'detail'}>
                      <List.Item>
                        Measurement Template
                        <List.Header>
                          {renderHyphen(
                            dataPerfType?.perfMeasurementTempId?.templateName,
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
                        Category Weight
                        <List.Header>
                          {dataPerfType?.isCategoryWeightCalc ? 'Yes' : 'No'}
                        </List.Header>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <CategorySection
                      dataPerfType={dataPerfType}
                      isCategory={dataPerfType?.isCategory}
                      isKRA={dataPerfType?.isKRA}
                      isTarget={dataPerfType?.isTarget}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            )}
          </Segment>
        ))}
    </>
  );
};

type CategorySectionProps = {
  dataPerfType: DataPerfType;
  isCategory: boolean;
  isKRA: boolean;
  isTarget: boolean;
};

const CategorySection = ({
  dataPerfType,
  isCategory,
  isKRA,
  isTarget,
}: CategorySectionProps) => {
  return (
    <section>
      <Header size={'small'} color={'black'}>
        CATEGORY
      </Header>

      {dataPerfType?.dataCategory.map((dataCategory) => (
        <CategorySectionDetailItem
          key={dataCategory?.id}
          dataPerfCategory={dataCategory}
          isCategory={isCategory}
          isCategoryWeightCalc={dataPerfType?.isCategoryWeightCalc}
          isKRA={isKRA}
          isTarget={isTarget}
        />
      ))}
    </section>
  );
};

type CategorySectionDetailItemProps = {
  dataPerfCategory: DataPerfCategory;
  isCategory: boolean;
  isCategoryWeightCalc: boolean;
  isKRA: boolean;
  isTarget: boolean;
};

const CategorySectionDetailItem = ({
  dataPerfCategory,
  isCategory,
  isCategoryWeightCalc,
  isKRA,
  isTarget,
}: CategorySectionDetailItemProps) => {
  const [showItem, setShowItem] = useState(true);
  const [activeIndex, setActiveIndex] = useState(isKRA ? 0 : 1);

  const handleChangeTab = useCallback(
    (data: number) => {
      setActiveIndex(data);
    },
    [setActiveIndex],
  );

  return (
   <div>
     <Grid>
        <Grid.Row columns="equal">
          <Grid.Column verticalAlign="middle" width={12}>
            <Header
              size={'small'}
              color={'blue'}
              style={{ marginTop: '0px' }}
            >
              {isCategory
                ? `${dataPerfCategory?.perfCategory?.name}`
                : `No Category`}
            </Header>
          </Grid.Column>
          {isCategoryWeightCalc && (
            <Grid.Column verticalAlign="middle" floated="right" width={3}>
              <Header size={'small'} color={'black'} floated="right">
                {isCategory === true
                  ? ` Category Weight: ${renderNumber(
                      dataPerfCategory?.categoryWeight,
                    )} %`
                  : ''}
              </Header>
            </Grid.Column>
          )}
          <Grid.Column width={1} floated="right">
            <Button
              size={'tiny'}
              floated="right"
              onClick={() => setShowItem(!showItem)}
              basic
              icon
            >
              <Icon name={showItem ? 'angle down' : 'angle up'} />
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      {showItem && (
        <Grid columns={'equal'}>
          <Grid.Row>
            <Grid.Column>
              <Button
                color="blue"
                fluid
                inverted={activeIndex !== 0}
                onClick={() => handleChangeTab(0)}
                circular
                disabled={!isKRA}
              >
                KRA
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button
                color="blue"
                fluid
                inverted={activeIndex != 1}
                onClick={() => handleChangeTab(1)}
                circular
              >
                KPI
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button
                color="blue"
                fluid
                inverted={activeIndex != 2}
                onClick={() => handleChangeTab(2)}
                circular
                disabled={!isTarget}
              >
                Target
              </Button>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            {activeIndex === 0 && isKRA && (
              <Grid.Column>
                <KRASection dataKRA={dataPerfCategory?.dataKRA} />
              </Grid.Column>
            )}
            {activeIndex === 1 && (
              <Grid.Column>
                <KPISection dataKPI={dataPerfCategory?.dataKPI} isKRA={isKRA} />
              </Grid.Column>
            )}
            {activeIndex === 2 && isTarget && (
              <Grid.Column>
                <TargetSection dataTarget={dataPerfCategory?.dataTarget} />
              </Grid.Column>
            )}
          </Grid.Row>
        </Grid>
      )}
   </div>
  );
};

type KRASectionProps = {
  dataKRA: DataKRA;
};

const KRASection = ({ dataKRA }: KRASectionProps) => {
  return (
    <>
      {/* KRA Predefined Options */}
      <section>
        <p style={{ color: 'grey', fontSize: '12px' }}>KRA Options</p>

        <Grid columns={'equal'} textAlign={'left'}>
          {dataKRA.dataKRADetails.map((dataKRADetails) => (
            <Grid.Row key={dataKRADetails?.id}>
              <Grid.Column>
                <Input
                  fluid
                  value={dataKRADetails?.performanceKRA?.name}
                  disabled
                />
              </Grid.Column>
            </Grid.Row>
          ))}
        </Grid>
      </section>
    </>
  );
};

type KPISectionProps = {
  dataKPI: DataKPI;
  isKRA: boolean;
};

const KPISection = ({ dataKPI, isKRA }: KPISectionProps) => {
  return (
    <>
      {/* KPI Type */}
      <section>
        <Grid columns={'equal'} textAlign={'left'}>
          <Grid.Row>
            <Grid.Column>
              <Form.Field>
                <Checkbox
                  label={<label className="mb-20">User Define</label>}
                  checked={dataKPI?.isUserDefine}
                  disabled
                />
              </Form.Field>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </section>
      {/* KPI Setting */}
      {dataKPI?.isUserDefine && (
        <section>
          <p style={{ color: 'grey', fontSize: '12px' }}>KPI Detail</p>

          <Grid columns={'equal'} textAlign={'left'}>
            {/* KPI Count */}
            <Grid.Row>
              <Grid.Column>
                <List selection size={'large'} className={'detail'}>
                  <List.Item>
                    KPI Count
                    <List.Header>
                      {dataKPI?.typeMaxKPICount || '--'}
                    </List.Header>
                  </List.Item>
                </List>
              </Grid.Column>

              <Grid.Column>
                <List selection size={'large'} className={'detail'}>
                  <List.Item>
                    Minimum Input
                    <List.Header>
                      {dataKPI?.typeMaxKPICount == 'UNLIMITED'
                        ? '--'
                        : dataKPI?.minKPICountInput}
                    </List.Header>
                  </List.Item>
                </List>
              </Grid.Column>

              <Grid.Column>
                <List selection size={'large'} className={'detail'}>
                  <List.Item>
                    Maximum Input
                    <List.Header>
                      {dataKPI?.typeMaxKPICount == 'UNLIMITED'
                        ? '--'
                        : dataKPI?.maxKPICountInput}
                    </List.Header>
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
            {/* KPI Weight */}
            <Grid.Row>
              <Grid.Column>
                <List selection size={'large'} className={'detail'}>
                  <List.Item>
                    KPI Weight
                    <List.Header>
                      {dataKPI?.typeMaxKPIWeight || '--'}
                    </List.Header>
                  </List.Item>
                </List>
              </Grid.Column>

              <Grid.Column>
                <List selection size={'large'} className={'detail'}>
                  <List.Item>
                    Minimum Weight
                    <List.Header>
                      {dataKPI?.typeMaxKPIWeight == 'UNLIMITED'
                        ? '--'
                        : dataKPI?.minKPIWeightInput}
                    </List.Header>
                  </List.Item>
                </List>
              </Grid.Column>

              <Grid.Column>
                <List selection size={'large'} className={'detail'}>
                  <List.Item>
                    Maximum Weight
                    <List.Header>
                      {dataKPI?.typeMaxKPIWeight == 'UNLIMITED'
                        ? '--'
                        : dataKPI?.maxKPIWeightInput}
                    </List.Header>
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </section>
      )}
      {/* KPI Predefined Options */}
      {(dataKPI?.isSelection || !dataKPI?.isUserDefine) && (
        <section className={dataKPI?.isUserDefine ? 'mt-20' : ''}>
          <p style={{ color: 'grey', fontSize: '12px' }}>KPI Option</p>
          <Table color={'teal'} singleLine>
            <Table.Header>
              {isKRA && (
                <TableHeaderCell width={5} attribute={'kra'} name={'KRA'} />
              )}
              <TableHeaderCell width={5} attribute={'kpi'} name={'KPI'} />
              {!dataKPI?.isUserDefine ? (
                <TableHeaderCell
                  width={4}
                  attribute={'weight'}
                  name={'Weight'}
                />
              ) : (
                ''
              )}
              {!dataKPI?.isUserDefine && dataKPI?.isSelection && (
                <TableHeaderCell
                  width={2}
                  attribute={'predefine'}
                  name={'Predefine'}
                />
              )}
            </Table.Header>
            <Table.Body>
              {dataKPI?.dataKPIDetails?.map((dataKPIDetails) => (
                <Table.Row key={dataKPIDetails?.id}>
                  {isKRA && (
                    <Table.Cell width={6}>
                      {dataKPIDetails.performanceKRA?.name}
                    </Table.Cell>
                  )}
                  <Table.Cell width={isKRA ? 6 : 12}>
                    {dataKPIDetails.performanceKPI?.name}
                  </Table.Cell>
                  {!dataKPI?.isUserDefine ? (
                    <Table.Cell width={3}>{dataKPIDetails?.weight}</Table.Cell>
                  ) : (
                    ''
                  )}
                  {!dataKPI?.isUserDefine && dataKPI?.isSelection && (
                    <Table.Cell width={2}>
                      <Checkbox
                        checked={dataKPIDetails?.isPredefine}
                        toggle
                        fitted
                      />
                    </Table.Cell>
                  )}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </section>
      )}
    </>
  );
};

type TargetSectionProps = {
  dataTarget: DataTarget;
};

const TargetSection = ({ dataTarget }: TargetSectionProps) => {
  return (
    <>
      {/* Target Type */}
      <section>
        <p style={{ color: 'grey', fontSize: '12px' }}>Target Type</p>

        <Grid columns={'equal'} textAlign={'left'}>
          <Grid.Row>
            <Grid.Column>
              <Form.Field>
                <Checkbox
                  label={<label className="mb-20">User Define</label>}
                  checked={dataTarget?.isUserDefine}
                  disabled
                />
              </Form.Field>
            </Grid.Column>
            <Grid.Column>
              <Form.Field>
                <Checkbox
                  label={<label className="mb-20">Editable</label>}
                  checked={dataTarget?.isEditable}
                  disabled
                />
              </Form.Field>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </section>
      {/* Target Predefined Options */}
      <section>
        {dataTarget?.isUserDefine && dataTarget?.isEditable ? (
          ''
        ) : (
          <>
            <p style={{ color: 'grey', fontSize: '12px' }}>Target Options</p>
            <Table color={'teal'}>
              <Table.Header>
                <TableHeaderCell width={6} attribute={'kpi'} name={'KPI'} />
                <TableHeaderCell
                  width={6}
                  attribute={'target'}
                  name={'Target'}
                />
              </Table.Header>

              <Table.Body>
                {dataTarget?.dataTargetDetails?.map((dataTargetDetails) => (
                  <Table.Row key={dataTargetDetails?.id}>
                    <Table.Cell width={6}>
                      {dataTargetDetails.performanceKPI?.name}
                    </Table.Cell>
                    <Table.Cell width={6}>
                      {dataTargetDetails.performanceTarget?.name}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </>
        )}
      </section>
    </>
  );
};

export default ModalPerfFormDetail;
