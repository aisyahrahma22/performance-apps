import React, { useCallback, useMemo, useState } from 'react';
import Titles from '../revamp/components/Titles';
import Footers from '../revamp/components/Footers';
import {
  Grid,
  Button,
  Table,
  Card,
  Popup,
  Icon,
  Segment,
} from 'semantic-ui-react';
import { ButtonColorEnum } from '../revamp/enum/ButtonColorsEnum';
import { get, isEmpty } from 'lodash';
import { useFormik } from 'formik';
import renderEnum from '../../lib/util/renderEnum';
import useEditScheduler from '../../lib/data/scheduler/useSchedulerEdit';
import { SchedulerOptionEnum } from '../../lib/enums/scheduler';
import {
  dayScheduler,
  monthList,
  repeatationList,
} from '../../lib/data/scheduler/helper/schedulerOptions';
import Inputs from '../revamp/components/Inputs';
import DatePickers from '../revamp/components/DatePickers';
import Toggles from '../revamp/components/Toggles';
// import * as yup from 'yup';
import { repeatInformation } from './helper/repeatInfoScheduler';
import ConfirmationModal from './component/ConfirmationModal';
interface SchedulerDetailProps {
  data: any;
  onBack: any;
}
// const scheduleValSchema = yup.object({
//   schedulerName: yup.string().required('Scheduler Name is required'),
//   isRunning: yup.boolean().required('Status is required'),
//   repeat: yup.string().required('Repeatation is required'),
//   time: yup.string().required('Time is required'),
//   countDay: yup.number().required('Day(s) is required').max(5, 'Days Maximum 5'),
// });
const SchedulerDetail = ({ data, onBack }: SchedulerDetailProps) => {
  const [oneMonth, setOneMonth] = useState<any>('');
  const [selectedCalendar, setSelectedCalendar] = useState<any[]>([]);
  const initialForm = useMemo(() => {
    return {
      schedulerName: renderEnum(data?.schedulerName),
      isRunning: data?.isRunning,
      repeat: data?.repeat,
      date: data?.dates || [],
      countDay: data?.countDay || '',
      time: data?.time,
      days: data?.days || [],
      countWeek: data?.countWeek || '',
      countMonth: data?.countMonth || '',
      countYear: data?.countYear || '',
      monthName: data?.monthName || 0,
      isEach: false,
      isOn: false,
    };
  }, [data]);

  const [isModalSubmit, setIsModalSubmit] = useState(false);
  const modalIsModalSubmitOpenPress = useCallback(() => {
    setIsModalSubmit(true);
  }, []);

  const modalIsModalSubmitClosePress = useCallback(() => {
    setIsModalSubmit(false);
  }, [isModalSubmit]);

  const { editScheduler, isEditSchedulerLoading } = useEditScheduler({
    onSuccess: modalIsModalSubmitClosePress,
  });

  const formikFormEdit = useFormik({
    initialValues: initialForm,
    enableReinitialize: true,
    // validationSchema: scheduleValSchema,
    onSubmit: (values) => {
      const newValues = {
        schedulerName: values.schedulerName,
        isRunning: values.isRunning,
        time: values.time,
        repeat: values.repeat,
        daily: {
          countDay: Number(values.countDay),
        },
        weekly: {
          countWeek: Number(values.countWeek),
          days: values.days,
        },
        monthly: {
          countMonth: Number(values.countMonth),
          dates: values.date,
        },
        yearly: {
          countYear: Number(values.countYear),
          month: values.monthName,
          dates: values.date,
        },
      };
      editScheduler(newValues);
    },
  });

  const getFormikValue = (name: string) => {
    return get(formikFormEdit.values, name);
  };

  const handleDayChange = useCallback(
    (day) => {
      const { days } = formikFormEdit.values;
      const isSelected = days?.includes(day);
      const newSelectedDays = isSelected
        ? days.filter((selectedDay: any) => selectedDay !== day)
        : [...days, day];
      formikFormEdit.setFieldValue('days', newSelectedDays);
    },
    [formikFormEdit],
  );

  const handleCalendarChange = useCallback(
    (cellValue: any) => {
      const data = selectedCalendar.includes(cellValue)
        ? selectedCalendar.filter((cell) => cell !== cellValue)
        : [...selectedCalendar, cellValue];
      setSelectedCalendar(data);
      formikFormEdit.setFieldValue('date', data);
    },
    [selectedCalendar, formikFormEdit],
  );

  const handleMonthChange = useCallback(
    (cellValue: any) => {
      setOneMonth(cellValue);
      formikFormEdit.setFieldValue('monthName', cellValue);
    },
    [oneMonth, formikFormEdit],
  );

  const calendarRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < 4; i++) {
      const cells = [];
      for (let j = 1; j <= 7; j++) {
        const cellValue = i * 7 + j;
        const isSelected =
          getFormikValue('date')?.includes(cellValue) ||
          selectedCalendar.includes(cellValue);
        const cellClassName = isSelected ? 'rvbuttons color-blue' : '';
        cells.push(
          <Table.Cell
            textAlign="center"
            key={cellValue}
            onClick={() => handleCalendarChange(cellValue)}
            className={cellClassName}
          >
            {cellValue}
          </Table.Cell>,
        );
      }
      rows.push(<Table.Row key={i}>{cells}</Table.Row>);
    }
    return rows;
  }, [selectedCalendar, getFormikValue('date')]);

  const monthRows = useMemo(() => {
    const numRows = 3;
    const numCols = 4;
    const tableRows = [];
    for (let i = 0; i < numRows; i++) {
      const rowCells = [];
      for (let j = 0; j < numCols; j++) {
        const cellIndex = i * numCols + j;
        if (cellIndex < monthList.length) {
          const cellValue = monthList[cellIndex].text;
          const cellEnum = monthList[cellIndex].key;
          const isSelected =
            getFormikValue('monthName') == cellEnum || cellEnum == oneMonth;
          const cellClassName = isSelected ? 'rvbuttons color-blue' : '';
          rowCells.push(
            <Table.Cell
              textAlign="center"
              key={monthList[cellIndex].key}
              className={cellClassName}
              onClick={() => handleMonthChange(cellEnum)}
            >
              {cellValue}
            </Table.Cell>,
          );
        }
      }
      tableRows.push(<Table.Row key={i}>{rowCells}</Table.Row>);
    }
    return tableRows;
  }, [monthList, oneMonth, getFormikValue('monthName')]);

  const notes = useMemo(() => {
    const formikValues = {
      repeat: getFormikValue('repeat'),
      monthName: getFormikValue('monthName'),
      currentTime: getFormikValue('time'),
      days: getFormikValue('days'),
      dates: getFormikValue('date'),
      countDay: getFormikValue('countDay'),
      countWeek: getFormikValue('countWeek'),
      countMonth: getFormikValue('countMonth'),
      countYear: getFormikValue('countYear'),
      time: getFormikValue('time'),
    };
    const note = repeatInformation(formikValues);
    return note;
  }, [
    getFormikValue('repeat'),
    getFormikValue('monthName'),
    getFormikValue('time'),
    getFormikValue('days'),
    getFormikValue('date'),
    getFormikValue('countDay'),
    getFormikValue('countWeek'),
    getFormikValue('countMonth'),
    getFormikValue('countYear'),
  ]);

  const handleButtonClick = useCallback(
    (option: any) => {
      if (option !== SchedulerOptionEnum.WEEKLY) {
        if (isEmpty(initialForm.date)) formikFormEdit.setFieldValue('date', []);
        if (initialForm.countWeek == '')
          formikFormEdit.setFieldValue('countWeek', '');
      }

      if (option !== SchedulerOptionEnum.MONTHLY) {
        if (isEmpty(initialForm.days)) {
          formikFormEdit.setFieldValue('days', []);
          setSelectedCalendar([]);
        }
        if (initialForm.countMonth == '') {
          formikFormEdit.setFieldValue('countMonth', '');
          setSelectedCalendar([]);
        }
      }

      if (option == SchedulerOptionEnum.MONTHLY && initialForm.countYear !== '')
        formikFormEdit.setFieldValue('date', []);
      else formikFormEdit.setFieldValue('date', initialForm.date);

      if (option !== SchedulerOptionEnum.YEARLY) {
        if (initialForm.monthName == '') {
          formikFormEdit.setFieldValue('monthName', '');
          setOneMonth('');
        }
        if (initialForm.countYear == '')
          formikFormEdit.setFieldValue('countYear', '');
      }

      if (option !== SchedulerOptionEnum.DAILY) {
        if (initialForm.countDay == '')
          formikFormEdit.setFieldValue('countDay', '');
      }
      formikFormEdit.setFieldValue('repeat', option);
    },
    [formikFormEdit],
  );

  const renderInputBasedOnOption = useCallback(
    (item: any) => {
      switch (item) {
        case SchedulerOptionEnum.DAILY:
          return (
            <Popup
              trigger={
                <Inputs
                  placeholder="Day"
                  label="Every"
                  formik={formikFormEdit}
                  name="countDay"
                  isNumber={true}
                  labelProps="Day(s)"
                  labelPosition="right"
                  max={6}
                  min={1}
                />
              }
              content={
                'For daily repetition, you can select up to 6 days at most.'
              }
              inverted
              position="top center"
              size={'mini'}
            />
          );
        case SchedulerOptionEnum.WEEKLY:
          return (
            <Popup
              trigger={
                <Inputs
                  placeholder="Week"
                  label="Every"
                  formik={formikFormEdit}
                  name="countWeek"
                  isNumber={true}
                  labelProps="Week(s)"
                  labelPosition="right"
                  max={4}
                  min={1}
                />
              }
              content={
                'For weekly repetition, you can select up to 3 weeks at most.'
              }
              inverted
              position="top center"
              size={'mini'}
            />
          );
        case SchedulerOptionEnum.MONTHLY:
          return (
            <Popup
              trigger={
                <Inputs
                  placeholder="Month"
                  label="Every"
                  formik={formikFormEdit}
                  name="countMonth"
                  isNumber={true}
                  labelProps="Month(s)"
                  labelPosition="right"
                  max={11}
                  min={1}
                />
              }
              content={
                'For monthly repetition, you can select up to 11 months at most.'
              }
              inverted
              position="top center"
              size={'mini'}
            />
          );
        case SchedulerOptionEnum.YEARLY:
          return (
            <Popup
              trigger={
                <Inputs
                  placeholder="Year"
                  label="Every"
                  formik={formikFormEdit}
                  name="countYear"
                  isNumber={true}
                  labelProps="Year(s)"
                  labelPosition="right"
                  max={4}
                  min={1}
                />
              }
              content={
                'For yearly repetition, you can select up to 5 years at most.'
              }
              inverted
              position="top center"
              size={'mini'}
            />
          );
        default:
          return (
            <Inputs
              placeholder="Day"
              label="Every"
              formik={formikFormEdit}
              name="countDay"
              isNumber={true}
              labelProps="Day(s)"
              labelPosition="right"
              max={6}
              disabled
            />
          );
      }
    },
    [formikFormEdit.values],
  );

  const handleSubmitConfirmPress = async () => {
    await formikFormEdit.handleSubmit();
  };

  return (
    <>
      <Titles
        pageTitle="View Scheduler Detail"
        firstPage="Configuration"
        secondPage="Scheduler"
      />

      {/* CONTENT */}
      <Grid columns={2} stackable>
        <Grid.Column width={8}>
          <Card fluid>
            <Card.Content>
              <div className="rvpositioncontainer">
                <div className="rvpositioncontainer-inside">
                  <Inputs
                    placeholder={'Scheduler Name'}
                    label={'Name'}
                    formik={formikFormEdit}
                    name={'schedulerName'}
                    disabled={true}
                  />
                  <div className="rv-margins mg-top-1">
                    <div className="rvtexts semibold text-xs">Repeatation</div>
                    <Button.Group basic>
                      {repeatationList.map((option) => (
                        <Button
                          key={option.key}
                          onClick={() => handleButtonClick(option.key)}
                          active={getFormikValue('repeat') === option.key}
                          className={
                            getFormikValue('repeat') === option.key
                              ? 'rvbuttons color-blue'
                              : ''
                          }
                        >
                          <span
                            className={
                              getFormikValue('repeat') === option.key
                                ? 'rv-font color-blue'
                                : ''
                            }
                          >
                            {option.text}
                          </span>
                        </Button>
                      ))}
                    </Button.Group>
                  </div>
                  <div className="rv-margins mg-top-1">
                    {renderInputBasedOnOption(getFormikValue('repeat'))}
                  </div>
                  <div className="rv-margins mg-top-1">
                    {getFormikValue('repeat') == SchedulerOptionEnum.WEEKLY ? (
                      <>
                        <Button.Group basic>
                          {dayScheduler.map(({ day, label }) => (
                            <Button
                              key={day}
                              className={
                                getFormikValue('days')?.includes(day)
                                  ? 'rvbuttons color-blue'
                                  : ''
                              }
                              onClick={() => handleDayChange(day)}
                              disabled={getFormikValue('countWeek') == 0}
                            >
                              <span
                                className={
                                  getFormikValue('days')?.includes(day)
                                    ? 'rv-font color-blue'
                                    : ''
                                }
                              >
                                {label}
                              </span>
                            </Button>
                          ))}
                        </Button.Group>
                        {getFormikValue('days')?.length > 6 ? (
                          <div className="rv-margins mg-top-1 rv-font color-red">
                            <Icon name={'warning'} color={'red'} />
                            It is not recommended to select all days. If you
                            want to do that, it`s better to choose the daily
                            repetition instead.
                          </div>
                        ) : (
                          ''
                        )}
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                  {getFormikValue('repeat') == SchedulerOptionEnum.YEARLY &&
                  getFormikValue('countYear') ? (
                    <div className="rv-margins mg-top-1">
                      <div className="rvtexts semibold text-xs">In</div>
                      <Segment className={'nopadding'}>
                        <Table celled basic>
                          <Table.Body>{monthRows}</Table.Body>
                        </Table>
                      </Segment>
                    </div>
                  ) : (
                    ''
                  )}
                  {(getFormikValue('repeat') == SchedulerOptionEnum.YEARLY &&
                    getFormikValue('countYear') > 0 &&
                    formikFormEdit.values.monthName > 0) ||
                  (formikFormEdit.values.repeat ==
                    SchedulerOptionEnum.MONTHLY &&
                    getFormikValue('countMonth') > 0) ? (
                    <div className="rv-margins mg-top-1">
                      <div className="rvtexts semibold text-xs">On</div>
                      <Segment className={'nopadding'}>
                        <Table celled basic>
                          <Table.Body>{calendarRows}</Table.Body>
                        </Table>
                      </Segment>
                      {selectedCalendar.length > 27 ? (
                        <span className="rv-font color-red">
                          <Icon name={'warning'} color={'red'} />
                          It is not recommended to select all dates. If you want
                          to do that, it`s better to choose the daily repetition
                          instead.
                        </span>
                      ) : (
                        ''
                      )}
                    </div>
                  ) : (
                    ''
                  )}
                  <div className="rv-margins mg-top-1">
                    <DatePickers
                      placeholder={'Select Time'}
                      label={'Time'}
                      formik={formikFormEdit}
                      name={`time`}
                      dateOnly={false}
                      yearOnly={false}
                      timeOnly={true}
                      isPreventEnter
                      width={'twelve'}
                      fluid
                    />
                  </div>
                  <div className="rv-margins mg-top-1">
                    <Toggles
                      disabled
                      size="small"
                      // formik={formikFormEdit}
                      // name={'isRunning'}
                    />
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column width={8}>
          <Card fluid>
            <Card.Content>
              <div className="rvtexts semibold text-xs">Repeatation</div>
              <div className="rv-margins mg-top-1">
                <div className="rvtexts text-s">{notes}</div>
              </div>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
      {/* FOOTER */}
      <Footers>
        <div className="rvflexs row space-between center">
          <div></div>
          <div>
            <Button className={ButtonColorEnum.GHOSTED} onClick={onBack}>
              <span className="rvtexts regular text-s">Close</span>
            </Button>
            <Button
              className={ButtonColorEnum.DEFAULT}
              onClick={modalIsModalSubmitOpenPress}
              disabled={!formikFormEdit.dirty || isEditSchedulerLoading}
            >
              <span className="rvtexts regular text-s">Save</span>
            </Button>
          </div>
        </div>
      </Footers>
      {isModalSubmit && (
        <ConfirmationModal
          isOpen={isModalSubmit}
          onClose={modalIsModalSubmitClosePress}
          onClickConfirm={handleSubmitConfirmPress}
          tittle={'Submit Scheduler'}
          message={'Are you sure you want change scheduler data?'}
        />
      )}
    </>
  );
};

export default SchedulerDetail;
