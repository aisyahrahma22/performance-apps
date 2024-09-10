import React, { useState } from 'react';
import { Button, Grid, Header, Segment } from 'semantic-ui-react';
import TableApproval from './TablePerfEmpAprovalGS';
import NotesPerformance from './NotesPerformance';
import usePerfEndYearEditForm from '../../../lib/data/PerfEndYear/usePerfEndYearEditForm';

interface ApprovalLogProps {
  id: string;
}

const ApprovalLog = ({ id }: ApprovalLogProps) => {
  const { formikEndYear } = usePerfEndYearEditForm({
    id,
  });
  const [isHide, setIsHide] = useState(false);

  return (
    <>
      <Segment raised style={{ marginTop: 40, marginBottom: 10 }}>
        <Grid>
          <Grid.Row verticalAlign={'middle'}>
            <Grid.Column width={'14'}>
              <Header as={'h4'} color={'blue'}>
                NOTES
              </Header>
            </Grid.Column>
            <Grid.Column width={'2'} verticalAlign={'middle'}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  icon={isHide ? 'chevron down' : 'chevron up'}
                  onClick={() => setIsHide(!isHide)}
                  size="small"
                  basic
                  compact
                />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {!isHide && (
          <>
            <NotesPerformance
              id={id}
              onViewDetail={true}
              formik={formikEndYear}
            />
          </>
        )}
      </Segment>
      <TableApproval id={id} />
    </>
  );
};

export default ApprovalLog;
