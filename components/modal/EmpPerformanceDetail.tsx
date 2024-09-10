import {
  Button,
  Grid,
  List,
  Modal,
  Table,
  TableHeaderCell,
} from 'semantic-ui-react';
import renderHyphen from '../../lib/util/renderHyphen';
import React from 'react';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';
import Snippet from '../Snippet';
import useEmployeePerformanceDetail from '../../lib/data/employee/useEmployeePerformanceDetail';
import TablePlaceholder from '../placeholder/TablePlaceholder';
import useEmployeePerformance from '../../lib/data/employee/useEmployeePerformance';
import { last } from 'lodash';

interface EmpPerformanceDetailProps {
  id: any;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
}

const ModalEmpPerformanceDetail = ({
  id,
  isOpen,
  closePress,
}: EmpPerformanceDetailProps) => {
  const {
    empPerformanceDetail,
    isEmpPerformanceDetailLoading,
    isEmpPerformanceDetailError,
  } = useEmployeePerformanceDetail(id?.code);

  const {
    employeePerformance,
    isEmployeePerformanceLoading,
    isEmployeePerformanceError,
  } = useEmployeePerformance(id?.id);

  return (
    <Modal onClose={closePress} open={isOpen} size="small">
      <Modal.Header>
        {isEmpPerformanceDetailLoading ? (
          <ModalHeaderPlaceholder />
        ) : (
          <>
            {!isEmployeePerformanceLoading && employeePerformance.length === 0 && (
              <Table.Row>
                <Table.Cell textAlign={'center'} colSpan={3}>
                  {isEmployeePerformanceError
                    ? isEmployeePerformanceError.response?.data?.message ||
                      'Error'
                    : 'No Data'}
                </Table.Cell>
              </Table.Row>
            )}
            {!isEmployeePerformanceLoading && (
              <Snippet
                avatarSize={'70'}
                hasAvatar
                title={employeePerformance[0]?.employee?.fullName}
                description={`${renderHyphen(
                  employeePerformance[0]?.employee?.code,
                )} (${renderHyphen(employeePerformance[0]?.employee?.no)})`}
                src={
                  employeePerformance[0]?.employee?.profilePath
                    ? `/api/employee/profile/download/${last(
                        employeePerformance[0]?.employee?.profilePath.split(
                          '/',
                        ),
                      )}`
                    : ''
                }
              />
            )}
          </>
        )}
      </Modal.Header>
      <Modal.Content scrolling>
        <div>
          <Grid columns={'equal'} textAlign={'left'}>
            <Grid.Row>
              <Grid.Column>
                <List selection size={'large'} className={'detail'}>
                  <List.Item>
                    Code
                    <List.Header>
                      {renderHyphen(
                        empPerformanceDetail?.data[0]?.empPerformance?.code,
                      )}
                    </List.Header>
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column>
                <List selection size={'large'} className={'detail'}>
                  <List.Item>
                    PA Form
                    <List.Header>
                      {renderHyphen(
                        empPerformanceDetail?.data[0]?.empPerformance?.paForm,
                      )}
                    </List.Header>
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column>
                <List selection size={'large'} className={'detail'}>
                  <List.Item>
                    Year
                    <List.Header>
                      {renderHyphen(
                        empPerformanceDetail?.data[0]?.empPerformance?.year,
                      )}
                    </List.Header>
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Table
            selectable={!isEmpPerformanceDetailLoading}
            color={'teal'}
            compact
            fixed
            style={{ width: '100%' }}
          >
            <Table.Header>
              <Table.Row>
                <TableHeaderCell>Performance Code</TableHeaderCell>
                <TableHeaderCell>Performance Name</TableHeaderCell>
                <TableHeaderCell>Score</TableHeaderCell>
                <TableHeaderCell>Grade</TableHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isEmpPerformanceDetailLoading && (
                <TablePlaceholder rowCount={15} colCount={8} />
              )}
              {!isEmpPerformanceDetailLoading &&
                empPerformanceDetail.data.length === 0 && (
                  <Table.Row>
                    <Table.Cell textAlign={'center'} colSpan={4}>
                      {isEmpPerformanceDetailError
                        ? isEmpPerformanceDetailError.response?.data?.message ||
                          'Error'
                        : 'No Data'}
                    </Table.Cell>
                  </Table.Row>
                )}
              {!isEmpPerformanceDetailLoading &&
                empPerformanceDetail.data?.map((data: any) => (
                  <Table.Row key={data.id}>
                    <Table.Cell>
                      {renderHyphen(data.empPerformance?.code)}
                    </Table.Cell>
                    <Table.Cell>
                      {renderHyphen(data.performance?.name)}
                    </Table.Cell>
                    <Table.Cell>{renderHyphen(data.score)}</Table.Cell>
                    <Table.Cell>{renderHyphen(data.grade)}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
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

export default ModalEmpPerformanceDetail;
