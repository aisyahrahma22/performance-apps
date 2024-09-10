import React, { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import '../node_modules/react-quill/dist/quill.snow.css';
import { FormikProps } from 'formik';
import { Form, Segment } from 'semantic-ui-react';
import { get } from 'lodash';
import renderHtml from '../lib/util/renderHtml';

const ReactQuill = dynamic(
  () => {
    return import('react-quill');
  },
  { ssr: false },
);

let Quill: any;
let Delta: any;
let modules: any;

if (typeof window === 'object') {
  Quill = require('quill');
  Delta = Quill.import('delta');

  modules = {
    //   // toolbar: [['code-block']],
    clipboard: {
      matchers: [
        [
          Node.ELEMENT_NODE,
          (node: any) => {
            const plaintext = node.innerText;
            return new Delta().insert(plaintext);
          },
        ],
      ],
    },
  };
}

type EditorProps = {
  placeholder: string;
  label: string;
  formik: FormikProps<any>;
  name: string;
  disabled?: boolean;
};

const InputRichEditor = ({
  label,
  formik: { errors, touched, values, setFieldValue },
  name,
  disabled = false,
  placeholder,
}: EditorProps) => {
  const [customModule, setCustomModule] = useState({});

  const handleChange = useCallback(
    (data) => {
      if (data === '<p><br></p>') setFieldValue(name, '');
      else setFieldValue(name, data);
    },
    [name, setFieldValue],
  );

  const handleFocus = useCallback(() => {
    setCustomModule(modules);
  }, []);

  return !disabled ? (
    <Form.Field error={get(touched, name) && get(errors, name)}>
      <label htmlFor={name}>{label}</label>
      <ReactQuill
        readOnly={disabled}
        placeholder={placeholder}
        theme="snow"
        value={get(values, name) ?? ''}
        onChange={handleChange}
        modules={customModule}
        onFocus={handleFocus}
      />
      <label className={'error'}>{get(errors, name)}</label>
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

export default InputRichEditor;
