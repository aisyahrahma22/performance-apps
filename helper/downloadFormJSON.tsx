import React, { useState, useMemo, useCallback } from 'react';
import { Button } from 'semantic-ui-react';
import { format } from 'date-fns';

interface DownloadFormJSONProps {
  formik: {
    values: {
      employee?: {
        fullName?: string;
      };
      id?: string;
      [key: string]: any;
    };
  };
}

export const DownloadFormJSON: React.FC<DownloadFormJSONProps> = ({
  formik,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const empName = useMemo(() => {
    return (
      formik?.values?.employee?.fullName ||
      formik?.values?.id ||
      'debug-performance-form'
    );
  }, [formik?.values?.employee?.fullName, formik?.values?.id]);

  const handleDownloadClick = useCallback(() => {
    const jsonStr = JSON.stringify(formik.values, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${empName}-${format(
      new Date(),
      'yyyy-MM-dd-HHmmssSSSS',
    )}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [formik.values, empName]);

  return (
    <Button
      icon="file"
      type="button"
      size="small"
      basic
      color="grey"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      style={{
        position: 'absolute',
        top: '46px',
        right: '16px',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
      onClick={handleDownloadClick}
    />
  );
};
