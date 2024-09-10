import React from 'react';
import TextArea from 'semantic-ui-react/dist/commonjs/addons/TextArea/TextArea';
import TextareaAutosize from 'react-textarea-autosize';

interface TextAreaSectionProps {
  isTextAreaAutoHigh: boolean;
  value: any;
  rows: number;
  style?: any;
  noStyle?: boolean;
}

export default function TextAreaHistory({
  isTextAreaAutoHigh,
  value,
  rows,
  style,
  noStyle = false,
}: TextAreaSectionProps) {
  const styling = noStyle
    ? {
        border: 0,
        resize: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        margin: 0,
        padding: 0,
      }
    : style;
  return (
    <>
      {isTextAreaAutoHigh ? (
        <TextareaAutosize value={value} rows={rows} disabled style={styling} />
      ) : (
        <TextArea value={value} rows={rows} disabled style={styling} />
      )}
    </>
  );
}
