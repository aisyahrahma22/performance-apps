import { Button, Grid, List, Modal, Segment, Tab } from 'semantic-ui-react';
import useEmployee from '../../lib/data/employee/useEmployee';
import Snippet from '../Snippet';
import renderHyphen from '../../lib/util/renderHyphen';
import React, { useMemo } from 'react';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';
import ModalContentPlaceholder from '../placeholder/ModalContentPlaceholder';
import renderDate from '../../lib/util/renderDate';
import { calculateAge } from '../../lib/util/calculateAge';
import TABS from '../../helper/tabs';
// import TableEmployeePerformance from '../table/EmployeePerformance';
// import TableEmployeeTraining from '../table/EmployeeTraining';
// import TableTalentProfileDetail from '../table/TalentProfileDetail';
// import TableIDPProfile from '../table/IDPProfile';
// import TableEmpSuccessProfile from '../table/EmpSuccessProfile';
// import TableEmpEducationList from '../table/EmpEducation';
// import TableEmpCareerList from '../table/EmpCareer';
// import TableEmpDisciplineList from '../table/EmpDiscipline';
// import TableEmployeeLAHistory from '../table/EmployeeLAHistory';
import { differenceInCalendarMonths, monthsToYears } from 'date-fns';
import { last } from 'lodash';
// import TablePARecord from '../performanceAssessmentRecord/TablePARecord';

interface ModalEmployeeDetailProps {
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
  hiddenTabs?: Array<
    | 'employeeProfileLeadership'
    | 'employeeProfileCA'
    | 'employeeProfilePerformance'
    | 'employeeProfileTraining'
    | 'employeeTalentReview'
    | 'employeeProfilePerformanceAssessmentRecord'
    | 'idpProfile'
    | 'successProfile'
    | 'masterDataEmployeeEducation'
    | 'masterDataEmployeeCareer'
    | 'masterDataEmployeeDiscipline'
    | ''
  >;
  currentUser?: boolean;
}

type ListBasicProfileData = Array<
  Array<{
    title: string;
    data: any;
    width?: any;
    isElement?: boolean;
  }>
>;

const ModalEmployeeDetail = ({
  id,
  isOpen,
  closePress,
  hiddenTabs,
  currentUser,
}: ModalEmployeeDetailProps) => {
  const { employee, isEmployeeLoading } = useEmployee(id, currentUser);
  const panes = useMemo(() => {
    const tabs = [];
    // if (!hiddenTabs?.includes('employeeProfileLeadership'))
    //   tabs.push({
    //     menuItem: TABS.employeeProfileLeadership,
    //     render: () => <TableEmployeeLAHistory id={id} />,
    //   });

    // if (!hiddenTabs?.includes('successProfile'))
    //   tabs.push({
    //     menuItem: TABS.successProfile,
    //     render: () => <TableEmpSuccessProfile employeeId={id} />,
    //   });


    // if (!hiddenTabs?.includes('employeeTalentReview'))
    //   tabs.push({
    //     menuItem: TABS.employeeTalentReview,
    //     render: () => (
    //       <TableTalentProfileDetail
    //         showFilter
    //         employeeId={id}
    //         hideFields={['viewDetail']}
    //         editable={false}
    //       />
    //     ),
    //   });

    // employeeProfilePerformance updated to employeeProfilePerformanceAssessmentRecord after PA Record developed
    
    // return tabs;
    return []
  }, [id, hiddenTabs]);

  const expInYears = useMemo(
    () =>
      employee?.experienceDate
        ? monthsToYears(
            differenceInCalendarMonths(
              new Date(),
              new Date(employee?.experienceDate),
            ),
          )
        : employee?.startDate
        ? monthsToYears(
            differenceInCalendarMonths(
              new Date(),
              new Date(employee?.startDate),
            ),
          )
        : employee?.fullJoinDate
        ? monthsToYears(
            differenceInCalendarMonths(
              new Date(),
              new Date(employee?.fullJoinDate),
            ),
          )
        : -1,
    [employee],
  );

  const practicalExp = useMemo(
    () =>
      expInYears === -1
        ? ''
        : expInYears < 1
        ? `< 1 year`
        : `${expInYears} <> ${expInYears + 1} years`,
    [expInYears],
  );

  const latestEducation = useMemo(
    () =>
      employee?.educations?.sort(
        (a: any, b: any) => b.degree?.level - a.degree?.level,
      ),
    [employee],
  );

  const basicProfiles: ListBasicProfileData = useMemo(
    () => [
      [
        { title: 'Employee ID', data: employee?.code },
        {
          title: 'Education',
          width: 8,
          data:
            employee?.educations?.length > 0
              ? `${latestEducation?.[0].degree?.name} ${latestEducation?.[0]?.major?.name}`
              : '—',
        },
        { title: 'Employment Type', data: employee?.employmentType?.name },
      ],
      [
        {
          title: 'Age',
          data: calculateAge(employee?.birthDate || ''),
          isElement: true,
        },
        { title: 'Birth Date', data: renderDate(employee?.birthDate) },
        { title: 'Gender', data: employee?.gender?.name },
        { title: 'Marital Status', data: employee?.maritalStatus?.name },
      ],
      [
        { title: 'Grade Code', data: employee?.gradeCode?.name },
        { title: 'Job Title', data: employee?.jobTitle?.name },
        { title: 'Years of Experience', data: practicalExp },
        { title: 'Work Location', data: employee?.workLocation?.name },
      ],
      [{ title: 'Position', data: employee?.position?.name }],
    ],
    [employee],
  );

  const profileData = (
    <Grid columns={'equal'} textAlign={'left'}>
      {basicProfiles.map((row, r) => (
        <Grid.Row key={r}>
          {row.map(({ title, data, isElement, width }, i) => (
            <Grid.Column key={i} width={width}>
              <List selection size={'large'} className={'detail'}>
                <List.Item>
                  {title}
                  <List.Header>
                    {isElement ? data : renderHyphen(data)}
                  </List.Header>
                </List.Item>
              </List>
            </Grid.Column>
          ))}
        </Grid.Row>
      ))}
    </Grid>
  );

  return (
    <Modal className="tab" onClose={closePress} open={isOpen} size="fullscreen">
      <Modal.Header>
        {isEmployeeLoading ? (
          <ModalHeaderPlaceholder />
        ) : (
          <>
            <Snippet
              avatarSize={'80'}
              hasAvatar
              size={'large'}
              title={employee?.fullName}
              description={`${renderHyphen(employee?.email)}`}
              src={
                employee?.profilePath
                  ? `/api/employee/profile/download/${last(
                      employee.profilePath.split('/'),
                    )}`
                  : ''
              }
            />
          </>
        )}
      </Modal.Header>
      <Modal.Content scrolling>
        {isEmployeeLoading ? (
          <ModalContentPlaceholder />
        ) : (
          <>
            <Segment>{profileData}</Segment>
            <Tab
              menu={{
                color: 'black',
                inverted: true,
                attached: false,
                size: 'large',
                className: 'wrapper',
              }}
              panes={panes}
            />
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

export default ModalEmployeeDetail;
