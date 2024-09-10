import {
  Button,
  Grid,
  Icon,
  List,
  Modal,
  Header,
  Segment,
  Label,
} from 'semantic-ui-react';
import React, { useCallback, useState } from 'react';
import ModalHeaderPlaceholder from '../../placeholder/ModalHeaderPlaceholder';
import ModalContentPlaceholder from '../../placeholder/ModalContentPlaceholder';
import renderHyphen from '../../../lib/util/renderHyphen';
import renderDate from '../../../lib/util/renderDate';
import usePerformanceInquiryDetail from '../../../lib/data/performanceInquiry/usePerformanceInquiryDetail';
import ModalPerformanceInquiryChangeApprover from './PerformanceInquiryChangeApprover';
import usePerfGoalSetting from '../../../lib/data/performanceGoalSetting/usePerfGoalSetting';
import usePerfProgram from '../../../lib/data/performanceGoalSetting/usePerfProgram';
import usePerfGoalSettingDetails from '../../../lib/data/performanceGoalSetting/usePerfGoalSettingDetails';
import PerformanceTypeSection from '../components/PerformanceTypeSection';
import renderEnum from '../../../lib/util/renderEnum';
import { RenderGuard } from '../../RenderGuard';
import { RightEnum } from '../../../lib/enums/RightEnum';
import { last } from 'lodash';
import Avatar from 'react-avatar';
import TotalWeightBottom from '../../performanceGoalSetting/components/TotalWeightBottom';
import ApprovalLog from '../../performanceGoalSetting/components/NoteAndApprovalLog';

interface ModalPerformanceInquiryDetailProps {
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
  paTeamRecord?: boolean;
  isPARecord?: boolean;
}

const ModalPerformanceInquiryDetail = ({
  id,
  isOpen,
  closePress,
  paTeamRecord,
  isPARecord,
}: ModalPerformanceInquiryDetailProps) => {
  const { performanceInquiry, isPerformanceInquiryLoading } =
    usePerformanceInquiryDetail(id);

  const { perfGoalSetting, isPerfGoalSettingLoading } = usePerfGoalSetting(id);
  const { perfProgram, isPerfProgramLoading } = usePerfProgram(id);
  const { perfGoalSettingDetails, isPerfGoalSettingDetailsLoading } =
    usePerfGoalSettingDetails(id);
  const [activeIndex, setActiveIndex] = useState('');

  const [
    isModalPerformanceInquiryChangeApprover,
    setIsModalPerformanceInquiryChangeApprover,
  ] = useState(false);
  const [
    modalPerformanceInquiryChangeApproverData,
    setModalPerformanceInquiryChangeApproverData,
  ] = useState<any>(null);

  // Modal Detail
  const modalPerformanceInquiryChangeApproverPress = useCallback(
    (performanceId) => () => {
      setModalPerformanceInquiryChangeApproverData(performanceId);
      setIsModalPerformanceInquiryChangeApprover(true);
    },
    [],
  );

  const modalPerformanceInquiryChangeApproverClosePress = useCallback(() => {
    setIsModalPerformanceInquiryChangeApprover(false);
  }, []);

  return (
    <>
      <Modal
        open={isOpen}
        size={'large'}
        style={{ height: '70%', top: '10%' }}
        closeOnDimmerClick={false}
      >
        <Modal.Header style={{ maxHeight: '13%' }}>
          {isPerfGoalSettingLoading || isPerfProgramLoading ? (
            <ModalHeaderPlaceholder />
          ) : (
            <div style={{ marginBottom: '10vh' }}>
              <Header as={'h3'} color="black" floated={'left'}>
                <Icon name={'edit'} circular />
                <Header.Content>
                  {perfProgram?.perfForm?.perfFormName?.name}
                  <Header.Subheader>
                    {perfProgram?.perfForm?.performanceFormCode}
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </div>
          )}
        </Modal.Header>
        <Modal.Content scrolling className={`modal-content-perf-form-mid`}>
          {isPerfGoalSettingLoading &&
          isPerfProgramLoading &&
          isPerfGoalSettingDetailsLoading &&
          isPerformanceInquiryLoading ? (
            <ModalContentPlaceholder />
          ) : (
           <div>
            <Grid columns={'equal'} textAlign={'left'}>
                <Grid.Row verticalAlign={'middle'} textAlign={'left'}>
                  <List
                    style={{
                      margin: '.3em',
                      marginLeft: '.8em',
                    }}
                  >
                  </List>
                  <Grid.Column>
                    <List selection size={'large'} className={'detail'}>
                      <List.Item>
                        <List.Header
                          size={'medium'}
                          style={{
                            marginBottom: '.3em',
                            fontStyle: 'bolder',
                          }}
                        >
                          {renderHyphen(
                            performanceInquiry?.performanceForm?.employee
                              .fullName,
                          )}
                        </List.Header>
                        <List.Header
                          style={{
                            marginBottom: '.3em',
                            fontStyle: '',
                            fontSize: '14px',
                          }}
                        >
                          {renderHyphen(
                            performanceInquiry?.performanceForm?.employee
                              ?.position?.name,
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
                        Program Code
                        <List.Header>
                          {renderHyphen(
                            performanceInquiry?.performanceForm?.perfForm
                              ?.perfProgram?.code,
                          )}
                        </List.Header>
                      </List.Item>
                    </List>
                  </Grid.Column>
                  <Grid.Column>
                    <List selection size={'large'} className={'detail'}>
                      <List.Item>
                        Program Name
                        <List.Header>
                          {renderHyphen(
                            performanceInquiry?.performanceForm?.perfForm
                              ?.perfProgram?.name,
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
                        Start
                        <List.Header>
                          {renderDate(
                            performanceInquiry?.performanceForm?.perfForm
                              ?.perfProgram?.startDate,
                            'dd MMMM yyyy',
                          )}
                        </List.Header>
                      </List.Item>
                    </List>
                  </Grid.Column>
                  <Grid.Column>
                    <List selection size={'large'} className={'detail'}>
                      <List.Item>
                        End
                        <List.Header>
                          {renderDate(
                            performanceInquiry?.performanceForm?.perfForm
                              ?.perfProgram?.endDate,
                            'dd MMMM yyyy',
                          )}
                        </List.Header>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid.Row>
                
                <Grid.Row></Grid.Row>
              </Grid>
           </div>
          )}
          {isPerfGoalSettingLoading &&
          isPerfProgramLoading &&
          isPerfGoalSettingDetailsLoading &&
          isPerformanceInquiryLoading ? (
            <ModalContentPlaceholder />
          ) : (
            <>
              <PerformanceTypeSection
                perfEmpItemTypeObjArr={perfGoalSettingDetails?.perfEmpItemType}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
              />
              <ApprovalLog id={id} />
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
    </>
  );
};

export default ModalPerformanceInquiryDetail;
