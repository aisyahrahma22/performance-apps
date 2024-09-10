import React from 'react';
import { Form, InputProps as SURInputProps, Grid } from 'semantic-ui-react';
import { includes, toUpper } from 'lodash';
import InputFile from './InputFile';

type InputProps = {
  label?: string;
  isRequired?: boolean;
  uploadFetcher: any;
  onUploadSuccess: any;
  urlImage?: string;
} & SURInputProps;

const InputImage = ({
  label,
  name,
  isRequired = false,
  uploadFetcher,
  onUploadSuccess,
  urlImage,
}: InputProps) => {
  return (
    <Form.Field>
      <label htmlFor={name}>
        {toUpper(label)}{' '}
        {isRequired && (
          <span style={{ color: 'red', fontSize: '1.2em' }}>*</span>
        )}
      </label>
      <Grid.Row>
        {urlImage && !includes(urlImage, 'undefined') && (
          <img src={`${urlImage}`} height={120} />
        )}
      </Grid.Row>
      <Grid.Row>
        <InputFile
          accept={'.png'}
          uploadFetcher={uploadFetcher}
          onUploadSuccess={onUploadSuccess}
        />
      </Grid.Row>
      {/* {!hideError && <label className={'error'}>{get(errors, name)}</label>} */}
    </Form.Field>
  );
};

export default InputImage;
