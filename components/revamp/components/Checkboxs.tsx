import React, { useCallback, useState } from 'react';
import { Icon } from 'semantic-ui-react';

type CheckboxsProps = {
  label: string;
  impediment?: boolean;
  disabled?: boolean;
};

const Checkboxs = ({ label, impediment, disabled }: CheckboxsProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isImpediment, setIsImpediment] = useState(false);

  const clickPress = useCallback(() => {
    if (impediment) {
      setIsImpediment((v) => (v = !v));
    } else {
      setIsClicked((v) => (v = !v));
    }
  }, [isClicked, impediment]);

  return (
    <>
      {disabled ? (
        <div className="rvcheckboxs">
          {isClicked ? (
            <div className="rvcheckicons disabled">
              <Icon name="check" />
            </div>
          ) : isImpediment ? (
            <div className="rvcheckicons disabled">
              <Icon name="minus" />
            </div>
          ) : (
            <div className="rvcheckicons"></div>
          )}

          <span className="rvtexts regular text-m rvcolors color-gray-900">
            {label}
          </span>
        </div>
      ) : (
        <div className="rvcheckboxs" onClick={clickPress}>
          {isClicked ? (
            <div className="rvcheckicons clicked">
              <Icon name="check" />
            </div>
          ) : isImpediment ? (
            <div className="rvcheckicons clicked">
              <Icon name="minus" />
            </div>
          ) : (
            <div className="rvcheckicons"></div>
          )}

          <span className="rvtexts regular text-m rvcolors color-gray-900">
            {label}
          </span>
        </div>
      )}
    </>
  );
};

export default Checkboxs;
