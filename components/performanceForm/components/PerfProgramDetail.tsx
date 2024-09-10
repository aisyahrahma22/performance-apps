import React, { useCallback, useState } from 'react';
import { Checkbox, Grid, Icon, List } from 'semantic-ui-react';
import renderHyphen from '../../../lib/util/renderHyphen';
import renderDate from '../../../lib/util/renderDate';
import renderEnum from '../../../lib/util/renderEnum';
import ModalEmployeeParticipant from './ModalEmployeeParticipant';
import ModalPositionParticipant from './ModalPositionParticipant';

interface PerfProgramDetail {
  performanceForm: any;
  formParticipantCount: any;
  isFormParticipantCountLoading: boolean;
}

const PerfProgramDetail = ({
  performanceForm,
  formParticipantCount,
  isFormParticipantCountLoading,
}: PerfProgramDetail) => {
  const [modalPositionParticipant, setModalPositionParticipant] =
    useState(false);

  const handleCloseModalPositionParticipant = useCallback(() => {
    setModalPositionParticipant(false);
  }, []);
  const handleOpenModalPositionParticipant = useCallback(() => {
    setModalPositionParticipant(true);
  }, []);

  const [modalEmployeeParticipant, setModalEmployeeParticipant] =
    useState(false);

  const handleCloseModalEmployeeParticipant = useCallback(() => {
    setModalEmployeeParticipant(false);
  }, []);
  const handleOpenModalEmployeeParticipant = useCallback(() => {
    setModalEmployeeParticipant(true);
  }, []);

  return (
    <section style={{ marginTop: '2vh', marginBottom: '4vh' }}>
      <Grid columns={'equal'} textAlign={'left'}>
        {/* Perf Program - Perf Program Code */}
        <Grid.Column>
          <List selection size={'large'} className={'detail'}>
            <List.Item>
              Program Code
              <List.Header>
                {renderHyphen(performanceForm?.perfProgram?.code)}
              </List.Header>
            </List.Item>
          </List>
          {/* Perf Program - Form Term */}
          <List selection size={'large'} className={'detail'}>
            <List.Item>
              Form Term
              <List.Header>
                {renderEnum(performanceForm?.perfProgram?.formTerm)}
              </List.Header>
            </List.Item>
          </List>
          {/* Perf Program - Start Date */}
          <List selection size={'large'} className={'detail'}>
            <List.Item>
              Start
              <List.Header>
                {renderDate(
                  performanceForm?.perfProgram?.startDate,
                  'dd MMMM yyyy',
                )}
              </List.Header>
            </List.Item>
          </List>
        </Grid.Column>
        {/* Perf Program - Final Result Method*/}
        <Grid.Column>
          {/* Perf Program - Perf Program Name */}
          <List selection size={'large'} className={'detail'}>
            <List.Item>
             Program Name
              <List.Header>
                {' '}
                {renderHyphen(performanceForm?.perfProgram?.name)}
              </List.Header>
            </List.Item>
          </List>
          <List selection size={'large'} className={'detail'}>
            <List.Item>
              Final Result
              <List.Header>
                {performanceForm?.perfProgram?.finalResultMethod ===
                'SINGLE' ? (
                  <>Single</>
                ) : (
                  <>Multiple</>
                )}
              </List.Header>
            </List.Item>
          </List>
          {/* Perf Program - End Date */}
          <List selection size={'large'} className={'detail'}>
            <List.Item>
              End
              <List.Header>
                {renderDate(
                  performanceForm?.perfProgram?.endDate,
                  'dd MMMM yyyy',
                )}
              </List.Header>
            </List.Item>
          </List>
        </Grid.Column>
      </Grid>
    </section>
  );
};

export default PerfProgramDetail;
