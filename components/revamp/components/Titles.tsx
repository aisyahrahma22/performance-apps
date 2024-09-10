import React, { useMemo } from 'react';
import { Button, Popup } from 'semantic-ui-react';
import { ButtonColorEnum } from '../enum/ButtonColorsEnum';
import LabelStatus from './LabelStatus';
import { LabelStatusEnum } from '../enum/LabelStatusEnum';

type TitlesProps = {
  firstPage?: string;
  secondPage?: string;
  pageTitle?: string;
  buttonTitle?: string;
  buttonOnClick?: () => void;
  buttonOnClickIcon?: () => void;
  additionalButton?: JSX.Element;
  statusTitle?: LabelStatusEnum | any;
  icon?: boolean;
  helpIconDescription?: string;
};

const Titles = ({
  firstPage,
  secondPage,
  pageTitle,
  buttonTitle,
  buttonOnClick,
  statusTitle,
  icon,
  helpIconDescription,
  buttonOnClickIcon,
  additionalButton,
}: TitlesProps) => {
  const helpIcon = useMemo(
    () => (
      <span
        className="material-icons-outlined rvcolors color-purple-500"
        style={{ cursor: 'pointer', marginLeft: '8px' }}
        onClick={buttonOnClickIcon}
      >
        help_outline
      </span>
    ),
    [buttonOnClickIcon],
  );

  return (
    <>
      <div className="rvflexs row space-between center">
        <div>
          <div>
            <span className="rvtexts regular text-xs rvcolors color-gray-600">
              {firstPage} / {secondPage}
            </span>
          </div>
          <div>
            <span className="rvtexts semibold xss rvcolors color-gray-900">
              {pageTitle}
            </span>
          </div>
        </div>

        <div className="rvflexs row end centers">
          {additionalButton && additionalButton}
          {buttonTitle && (
            <Button className={ButtonColorEnum.DEFAULT} onClick={buttonOnClick}>
              {buttonTitle}
            </Button>
          )}
          {statusTitle && <LabelStatus type={statusTitle} />}
          {icon &&
            (helpIconDescription ? (
              <Popup content={helpIconDescription} trigger={helpIcon} />
            ) : (
              helpIcon
            ))}
        </div>
      </div>
    </>
  );
};

export default Titles;
