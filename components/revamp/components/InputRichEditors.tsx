import React, { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import '../../../node_modules/react-quill/dist/quill.snow.css';
import { FormikProps } from 'formik';
import { Form, Segment } from 'semantic-ui-react';
import { get } from 'lodash';
import renderHtml from '../../../lib/util/renderHtml';

const ReactQuill = dynamic(
  () => {
    return import('react-quill');
  },
  { ssr: false },
);

// let Quill: any;
// let Delta: any;
let modules: any;

if (typeof window === 'object') {
  // Quill = require('quill');
  // Delta = Quill.import('delta');

  modules = {
    clipboard: {
      matchVisual: false,
    },
  };
}

type EditorProps = {
  placeholder: string;
  label: string;
  labelDescription?: string;
  formik: FormikProps<any>;
  name: string;
  disabled?: boolean;
  required?: boolean;
};

const InputRichEditors = ({
  label,
  labelDescription,
  formik: { errors, touched, values, setFieldValue, setFieldTouched },
  name,
  disabled = false,
  placeholder,
  required = false,
}: EditorProps) => {
  const [customModule, setCustomModule] = useState({});
  const [value, setValue] = useState<any>('');
  const currentValue = get(values, name);

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  const handleChange = useCallback(
    (data) => {
      if (data === '<p><br></p>') {
        setValue('');
        setFieldValue(name, '');
      } else {
        setValue(data);
        setFieldValue(name, data);
      }
    },
    [name, setFieldValue],
  );

  const handleFocus = useCallback(() => {
    setCustomModule(modules);
  }, []);

  const handleFieldBlur = useCallback(() => {
    setFieldTouched(name, true);
  }, []);

  return !disabled ? (
    <Form.Field error={get(touched, name) && get(errors, name)}>
      <div className="rvflexs row start">
        <span className="rvtexts semibold text-xs">{label}</span>
        {required && (
          <span className="rvtext semibold text-xs rvcolors color-error-500">
            *
          </span>
        )}
      </div>
      {labelDescription && (
        <div className="rvflexs row start mt--02 mb-05">
          <span className="rvtexts regular text-xss rvcolors color-gray-600">
            {labelDescription}
          </span>
        </div>
      )}
      <ReactQuill
        readOnly={disabled}
        placeholder={placeholder}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={customModule}
        onFocus={handleFocus}
        className="rvrichtextareas"
        onBlur={handleFieldBlur}
      />
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
  ) : (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <Segment className="no-border-radius mt-0">
        {renderHtml(get(values, name) ?? '')}
      </Segment>
    </div>
  );
};

export default InputRichEditors;
