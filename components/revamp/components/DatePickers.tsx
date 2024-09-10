import React, { useCallback, useMemo } from 'react';
import { Form } from 'semantic-ui-react';
import { FormikProps } from 'formik';
import { get } from 'lodash';
import {
  DateInput,
  DateTimeInput,
  TimeInput,
  YearInput,
} from 'semantic-ui-calendar-react';
import { format } from 'date-fns';
import { SemanticWIDTHS } from 'semantic-ui-react/src/generic';

type InputProps = {
  placeholder: string;
  label?: string;
  formik: FormikProps<any>;
  name: string;
  disableMinute?: boolean;
  onChange?: any;
  dateOnly?: boolean;
  yearOnly?: boolean;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  dateFormat?: string;
  isPreventEnter?: boolean;
  fluid?: boolean;
  required?: boolean;
  timeOnly?: boolean;
  width?: SemanticWIDTHS;
};

export const dateStringFormat = 'dd-MM-yyyy';
export const dateStringTimeFormat = 'dd-MM-yyyy HH:mm';

export function isIsoDate(str: string) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  const d = new Date(str);
  return d.toISOString() === str;
}

const DatePickers = ({
  label,
  formik: { errors, touched, setFieldValue, values, setFieldTouched },
  name,
  placeholder,
  disableMinute = false,
  dateOnly = false,
  yearOnly = false,
  disabled = false,
  minDate,
  maxDate,
  dateFormat,
  isPreventEnter = false,
  fluid,
  required = false,
  timeOnly = false,
  width,
}: InputProps) => {
  const value = useMemo(() => {
    const dateFormat = dateOnly ? dateStringFormat : dateStringTimeFormat;
    const curValue = get(values, name);
    if (isIsoDate(curValue)) {
      return format(new Date(curValue), dateFormat);
    } else return curValue;
  }, [values, dateOnly, name]);

  const preventEnter = useCallback((e) => {
    if (['Enter'].includes(e?.key)) {
      e?.preventDefault();
    }
  }, []);

  const handleDateBlur = useCallback(() => {
    setFieldTouched(name, true);
  }, [name]);

  return (
    <Form.Field width={width} error={get(touched, name) && get(errors, name)}>
      <div className="rvflexs row start">
        <span className="rvtexts semibold text-xs">{label}</span>
        {required && (
          <span className="rvtext semibold text-xs rvcolors color-error-500">
            *
          </span>
        )}
      </div>
      {dateOnly ? (
        <DateInput
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          iconPosition="right"
          onChange={(_e, { name, value }) => setFieldValue(name, value)}
          closable
          minDate={minDate}
          maxDate={maxDate}
          dateFormat={dateFormat ?? 'DD-MM-YYYY'}
          onKeyPress={isPreventEnter ? preventEnter : undefined}
          initialDate={minDate ?? ''}
          icon={'calendar outline'}
          fluid={fluid}
          onBlur={handleDateBlur}
        />
      ) : yearOnly ? (
        <YearInput
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          iconPosition="right"
          onChange={(_e, { name, value }) => setFieldValue(name, value)}
          closable
          minDate={minDate ?? ''}
          dateFormat={dateFormat ?? 'YYYY'}
          onKeyPress={isPreventEnter ? preventEnter : undefined}
          initialDate={minDate ?? ''}
          icon={'calendar outline'}
          fluid={fluid}
        />
      ) : (
        <>
          {timeOnly ? (
            <TimeInput
              name={name}
              placeholder={placeholder}
              disabled={disabled}
              value={value}
              iconPosition="right"
              onChange={(_e, { name, value }) => setFieldValue(name, value)}
              closable
              disableMinute={disableMinute}
              // minDate={minDate ?? ''}
              onKeyPress={isPreventEnter ? preventEnter : undefined}
              // initialDate={minDate ?? ''}
              fluid={fluid}
            />
          ) : (
            <DateTimeInput
              name={name}
              placeholder={placeholder}
              disabled={disabled}
              value={value}
              iconPosition="right"
              onChange={(_e, { name, value }) => setFieldValue(name, value)}
              closable
              disableMinute={disableMinute}
              minDate={minDate ?? ''}
              onKeyPress={isPreventEnter ? preventEnter : undefined}
              initialDate={minDate ?? ''}
              icon={'calendar outline'}
              fluid={fluid}
            />
          )}
        </>
      )}
      {get(touched, name) && get(errors, name) ? (
        <div
          className="rvflexs row start center error"
          style={{ marginTop: '4px' }}
        >
          <span
            className="material-icons-outlined rvcolors color-error-600"
            style={{ fontSize: '16px', marginRight: '4px' }}
          >
            report
          </span>
          <span className="rvcolors color-error-600 rvtexts regular text-xs">
            {get(errors, name)}
          </span>
        </div>
      ) : (
        ''
      )}
    </Form.Field>
  );
};

export default DatePickers;
