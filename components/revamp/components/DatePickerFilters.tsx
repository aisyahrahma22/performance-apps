import React, { useCallback, useMemo } from 'react';
import { Form } from 'semantic-ui-react';
import { FormikProps } from 'formik';
import { get } from 'lodash';
import {
  DateInput,
  DateTimeInput,
  YearInput,
} from 'semantic-ui-calendar-react';
import { format } from 'date-fns';

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
  dateFormat?: string;
  isPreventEnter?: boolean;
  fluid?: boolean;
  required?: boolean;
  active?: boolean;
};

export const dateStringFormat = 'dd-MM-yyyy';
export const dateStringTimeFormat = 'dd-MM-yyyy HH:mm';

export function isIsoDate(str: string) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  const d = new Date(str);
  return d.toISOString() === str;
}

const DatePickerFilters = ({
  label,
  formik: { errors, touched, setFieldValue, values },
  name,
  placeholder,
  disableMinute = false,
  dateOnly = false,
  yearOnly = false,
  disabled = false,
  minDate,
  dateFormat,
  isPreventEnter = false,
  fluid,
  required = false,
  active,
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

  return (
    <Form.Field error={get(touched, name) && get(errors, name)}>
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
          minDate={minDate ?? ''}
          dateFormat={dateFormat ?? 'DD-MM-YYYY'}
          onKeyPress={isPreventEnter ? preventEnter : undefined}
          initialDate={minDate ?? ''}
          icon={'calendar outline'}
          fluid={fluid}
          className={active ? 'rvfilters-active' : 'rvfilters'}
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
          className={active ? 'rvfilters-active' : 'rvfilters'}
          style={{ width: '175px' }}
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
          className={active ? 'rvfilters-active' : 'rvfilters'}
        />
      )}
      {get(errors, name) ? (
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

export default DatePickerFilters;
