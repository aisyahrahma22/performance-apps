import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateSlicer,
  statusResetSelector,
  updateStatusReset,
} from '../lib/slice/dashboard';
import { Divider, Header, Segment } from 'semantic-ui-react';
import { getPositionGroupingTypes } from '../lib/data/position/usePositionGroupingTypes';
import { getPositionGroupings } from '../lib/data/position/usePositionGroupings';
import { getPositions } from '../lib/data/position/usePositions';
import { getGrades } from '../lib/data/grade/useGrades';
import InputDropdownRemoteCheckbox from './InputDropdownRemoteCheckbox';
import { DatesRangeInput, YearInput } from 'semantic-ui-calendar-react';
import { getBoxes } from '../lib/data/boxes/useBoxes';
import { isEmpty } from 'lodash';
import { getPerfProgramList } from '../lib/data/performanceForm/usePerfProgramList';
import { getPerfNameList } from '../lib/data/performanceForm/usePerfNameList';
import useEmpHasDataAccess from '../lib/data/dataAccessMapping/useEmpHasDataAccess';
import { getPerfCodeList } from '../lib/data/performanceForm/usePerformancesFormCode';
import { EmpStatusEnum } from '../lib/data/employee/empStatus';
import { getEmployeesActive } from '../lib/data/employee/useEmployeesActive';
import { getEmpStatus } from '../lib/data/employee/useEmpStatus';

type SlicerProps = {
  showWorkLocation?: boolean;
  showWLGroups?: boolean;
  showWLGroupsType?: boolean;
  showPosition?: boolean;
  showPositionGroup?: boolean;
  showPositionGroupType?: boolean;
  showEmpType?: boolean;
  showJobGrade?: boolean;
  showYear?: boolean;
  showNineBox?: boolean;
  showPeriod?: boolean;
  showStatus?: boolean;
  showStatusPerf?: boolean;
  showPerfName?: boolean;
  showEmpName?: boolean;
  showPerfTerm?: boolean;
  headerSize?: string;
  showPerfCode?: boolean;
  showTermScore?: boolean;
  showEmpStatus?: boolean;
};

export const initialSlicer = {
  empWorkLocation: [],
  empWLGroupsGroup: [],
  empWLGroupsType: [],
  position: [],
  positionGroupsGroup: [],
  positionGroupsType: [],
  employmentType: [],
  gradeCode: [],
  year: '',
  box: [],
  period: '',
  status: [],
  refreshData: [],
  perfProgram: [],
  perfFormName: [],
  employee: [],
  perfTerm: [],
  perfCode: [],
  termScore: [],
  empStatus: [EmpStatusEnum.ACTIVE],
};

const Slicer = ({
  showWorkLocation,
  showWLGroups,
  showWLGroupsType,
  showPosition,
  showPositionGroup,
  showPositionGroupType,
  showEmpType,
  showJobGrade,
  showYear,
  showNineBox,
  showPeriod,
  showStatus,
  showStatusPerf,
  showPerfName,
  showEmpName,
  showPerfTerm,
  showPerfCode,
  showTermScore,
  showEmpStatus,
}: SlicerProps) => {
  const [slicer, setSlicer] = useState(initialSlicer);
  const dispatch = useDispatch();
  const statusResetSlicer = useSelector(statusResetSelector);

  const { isRequiredAccessMapping, isValidAccess } = useEmpHasDataAccess();

  useEffect(() => {
    dispatch(
      updateSlicer({
        ...slicer,
        position: slicer.position,
        isRequiredAccessMapping: isEmpty(slicer.position)
          ? isRequiredAccessMapping
          : false,
        isValidAccess,
      }),
    );
  }, [dispatch, isRequiredAccessMapping, isValidAccess, slicer]);

  useEffect(
    () => {
      dispatch(
        updateSlicer({
          ...slicer,
          isRequiredAccessMapping,
          isValidAccess,
        }),
      );
    },
    [
      // dispatch, isRequiredAccessMapping, isValidAccess, slicer
    ],
  );

  const setFieldValue = (field: string, value: any) => {
    setSlicer({
      ...slicer,
      [field]: value,
    });
  };

  useEffect(() => {
    if (statusResetSlicer) {
      setSlicer(initialSlicer);
      dispatch(updateStatusReset(false));
    }
  }, [dispatch, statusResetSlicer]);

  const formikSlicer = {
    errors: {},
    setFieldValue,
    values: slicer,
    touched: {},
  };
  return (
    <div>
      <Segment className={'no-shadow'}>
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '25px' }}>
          <div style={styles(showPositionGroupType).segmentInput}>
            <InputDropdownRemoteCheckbox
              placeholder={'Position Group Type'}
              label={'Position Group Type'}
              name={'positionGroupsType'}
              formik={formikSlicer}
              apiFetcher={getPositionGroupingTypes}
              apiSearchKeys={['name']}
              apiTextKey={['name']}
              apiValueKey={'code'}
              initialOptions={[]}
              apiSort={{ name: 'ASC' }}
              apiFilter={{
                isActive: true,
              }}
              className="slicer"
              style={
                styles(showPositionGroupType, slicer.positionGroupsType?.length)
                  .input
              }
            />
          </div>
          <div style={styles(showPositionGroup).segmentInput}>
            <InputDropdownRemoteCheckbox
              placeholder={'Position Group'}
              label={'Position Group'}
              name={'positionGroupsGroup'}
              formik={formikSlicer}
              apiFetcher={getPositionGroupings}
              apiSearchKeys={['name']}
              apiTextKey={['name']}
              apiValueKey={'code'}
              initialOptions={[]}
              apiSort={{ name: 'ASC' }}
              apiFilter={{
                isActive: true,
                type: {
                  code: slicer.positionGroupsType?.join(','),
                },
                isRequiredAccessMapping,
              }}
              className="slicer"
              style={
                styles(showPositionGroup, slicer.positionGroupsGroup?.length)
                  .input
              }
            />
          </div>
          <div style={styles(showPosition).segmentInput}>
            <InputDropdownRemoteCheckbox
              placeholder={'Position'}
              label={'Position'}
              name={'position'}
              formik={formikSlicer}
              apiFetcher={getPositions}
              apiSearchKeys={['name']}
              apiTextKey={['name']}
              apiValueKey={'code'}
              initialOptions={[]}
              apiSort={{ name: 'ASC' }}
              apiFilter={{
                flag: '2',
                isActive: true,
                groupType: {
                  code: slicer.positionGroupsType?.join(','),
                },
                group: {
                  code: slicer.positionGroupsGroup?.join(','),
                },
                isRequiredAccessMapping,
                isValidAccess,
              }}
              className="slicer"
              style={styles(showPosition, slicer.position?.length).input}
            />
          </div>
        </div>

        <Header as="h4" style={{ fontWeight: 800, marginTop: '-50px'}}>
          PERFORMANCE
        </Header>
        <Divider fitted />
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '25px' }}>
         
          <div style={styles(showJobGrade).segmentInput}>
            <InputDropdownRemoteCheckbox
              placeholder={'Job Grade'}
              label={'Job Grade'}
              name={'gradeCode'}
              formik={formikSlicer}
              apiFetcher={getGrades}
              apiSearchKeys={['name']}
              apiTextKey={['name']}
              apiValueKey={'code'}
              initialOptions={[]}
              apiSort={{ name: 'ASC' }}
              className="slicer"
              style={styles(showJobGrade, slicer.gradeCode?.length).input}
            />
          </div>
          <div style={styles(showNineBox).segmentInput}>
            <InputDropdownRemoteCheckbox
              placeholder={'Talent Mapping'}
              label={'Talent Mapping'}
              name={'box'}
              formik={formikSlicer}
              apiFetcher={getBoxes}
              apiSearchKeys={['name']}
              apiTextKey={['name']}
              apiValueKey={'code'}
              initialOptions={[]}
              apiSort={{ name: 'ASC' }}
              className="slicer"
              style={styles(showNineBox, slicer.box?.length).input}
            />
          </div>
          <div style={styles(showStatusPerf).segmentInput}>
            <InputDropdownRemoteCheckbox
              placeholder={'Performance Program Name'}
              label={'Performance Program Name'}
              name={'perfProgram'}
              apiFetcher={getPerfProgramList}
              apiSearchKeys={['name']}
              apiTextKey={['name']}
              apiValueKey={'code'}
              formik={formikSlicer}
              initialOptions={[]}
              className="slicer"
              style={styles(showStatusPerf, slicer.perfProgram?.length).input}
            />
          </div>

          <div style={styles(showYear).segmentInput}>
            <YearInput
              placeholder="Year"
              popupPosition="bottom right"
              className={`slicer-calendar ${
                slicer.year?.length ? 'active' : ''
              }`}
              name="year"
              animation="horizontal flip"
              duration={300}
              closable
              autoComplete="off"
              hideMobileKeyboard
              clearable
              value={slicer.year}
              icon={'dropdown'}
              iconPosition="right"
              onChange={(_e, { name, value }) =>
                setSlicer({ ...slicer, [name]: value })
              }
              maxDate={new Date()}
            />
          </div>
          <div style={styles(showPeriod).segmentInput}>
            <DatesRangeInput
              placeholder="Period"
              popupPosition="bottom right"
              className={`slicer-calendar ${
                slicer.period?.length ? 'active' : ''
              }`}
              name="period"
              animation="horizontal flip"
              duration={300}
              closable
              autoComplete="off"
              hideMobileKeyboard
              clearable
              value={slicer.period}
              icon={'dropdown'}
              iconPosition="right"
              onChange={(_e, { name, value }) =>
                setSlicer({ ...slicer, [name]: value })
              }
            />
          </div>
          <div style={styles(showEmpStatus).segmentInput}>
            <InputDropdownRemoteCheckbox
              placeholder={'Employment Type Status'}
              label={'Employment Type Status'}
              name={'empStatus'}
              formik={formikSlicer}
              apiFetcher={getEmpStatus}
              apiSearchKeys={['name']}
              apiTextKey={['name']}
              apiValueKey={'code'}
              initialOptions={
                !isEmpty(slicer.empStatus)
                  ? [
                      {
                        key: EmpStatusEnum.ACTIVE,
                        value: EmpStatusEnum.ACTIVE,
                        text: 'Active',
                      },
                    ]
                  : []
              }
              value={slicer?.empStatus || formikSlicer?.values?.empStatus}
              className="slicer"
              style={styles(showEmpStatus, slicer.empStatus?.length).input}
            />
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '25px' }}>
          <div style={styles(showEmpName).segmentInput}>
            <InputDropdownRemoteCheckbox
              placeholder={'Employee Name'}
              label={'Employee Name'}
              name={'employee'}
              formik={formikSlicer}
              apiFetcher={getEmployeesActive}
              apiSearchKeys={['codeName']}
              apiTextKey={['code', 'fullName']}
              apiValueKey={'code'}
              initialOptions={[]}
              className="slicer"
              style={styles(showEmpName, slicer.employee?.length).input}
            />
          </div>
          <div style={styles(showPerfName).segmentInput}>
            <InputDropdownRemoteCheckbox
              placeholder={'Performance Form Name'}
              label={'Performance Form Name'}
              name={'perfFormName'}
              formik={formikSlicer}
              apiFetcher={getPerfNameList}
              apiSearchKeys={['name']}
              apiTextKey={['name']}
              apiValueKey={'code'}
              initialOptions={[]}
              className="slicer"
              style={styles(showPerfName, slicer.perfFormName?.length).input}
            />
          </div>
          <div style={styles(showPerfCode).segmentInput}>
            <InputDropdownRemoteCheckbox
              placeholder={'Performance Code'}
              label={'Performance Code'}
              name={'perfCode'}
              formik={formikSlicer}
              apiFetcher={getPerfCodeList}
              apiSearchKeys={['performanceFormCode']}
              apiTextKey={['performanceFormCode']}
              apiValueKey={'performanceFormCode'}
              initialOptions={[]}
              className="slicer"
              style={styles(showPerfCode, slicer.perfCode?.length).input}
            />
          </div>
        </div>
      </Segment>
    </div>
  );
};

const styles = (isShow: boolean | undefined, dataLength?: number) => {
  return {
    segmentInput: {
      width: '24%',
      marginRight: '1%',
      marginBottom: '20px',
      display: isShow ? 'inline-block' : 'none',
      flex: 1,
    },
    input: {
      backgroundColor: dataLength ? '#d8e5fc' : '#F8F8F8',
      borderRadius: '16px',
      color: 'black',
      width: '100%',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
    },
  };
};

export default Slicer;
