import React, { useEffect, useState } from 'react';
import { Button, Modal, Image } from 'semantic-ui-react';
import { ButtonColorEnum } from '../enum/ButtonColorsEnum';

interface ModalsProps {
  title?: string;
  size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen';
  isOpen?: boolean;
  disableConfirm?: boolean;
  onClose?: () => void;
  onClickConfirm?: () => void;
  confirmMessage?: string | undefined;
  cancelMessage?: string | undefined;
  cancelColor?: ButtonColorEnum;
  cancelTextColor?: string;
  topAdditionButtonText?: string | undefined;
  topAdditionButtonColor?: ButtonColorEnum;
  topAdditionButtonOnClick?: () => void;
  bottomAdditionButton?: {
    color: ButtonColorEnum;
    text: string;
    textColor: string;
    onClick: () => void;
  };
  children?: JSX.Element;
  footer?: boolean;
  headerless?: boolean;
  closeIcon?: boolean;
  id?: any;
  closeOnDimmerClick?: boolean;
  loading?: boolean;
}

const Modals = ({
  title,
  size,
  isOpen,
  onClose,
  disableConfirm = false,
  onClickConfirm,
  confirmMessage,
  cancelMessage,
  children,
  footer,
  headerless = false,
  closeIcon = true,
  topAdditionButtonText,
  topAdditionButtonColor,
  topAdditionButtonOnClick,
  bottomAdditionButton,
  cancelColor = ButtonColorEnum.GHOSTED,
  cancelTextColor = 'rvcolors color-gray-800',
  closeOnDimmerClick,
  id,
  loading = false,
}: ModalsProps) => {
  const [styleCondition, setStyleCondition] = useState('');

  useEffect(() => {
    if (headerless && !footer) {
      setStyleCondition('12px');
    } else if (headerless) {
      setStyleCondition('12px 12px 0 0');
    } else if (!footer) {
      setStyleCondition('0 0 12px 12px');
    } else {
      setStyleCondition('');
    }
  }, [footer, headerless]);

  return (
    <Modal
      onClose={onClose}
      open={isOpen}
      className="rvmodals"
      size={size}
      closeOnDimmerClick={closeOnDimmerClick}
      // closeIcon
      id={id}
    >
      {!headerless && (
        <Modal.Header>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="rvtexts semibold text-l">{title}</span>
            <div
              className="rvflexs row"
              style={{ width: topAdditionButtonText ? '13vw' : '2vw' }}
            >
              {topAdditionButtonText && (
                <Button
                  className={topAdditionButtonColor}
                  onClick={topAdditionButtonOnClick}
                >
                  <span className="rvtexts regular text-xs ">
                    {topAdditionButtonText}
                  </span>
                </Button>
              )}
              {closeIcon && (
                <Image
                  src="/icons-revamp/close.svg"
                  onClick={onClose}
                  style={{ cursor: 'pointer' }}
                />
              )}
            </div>
          </div>
        </Modal.Header>
      )}
      <Modal.Content style={{ borderRadius: styleCondition }} scrolling>
        <>{children}</>
      </Modal.Content>
      {footer && (
        <Modal.Actions>
          {bottomAdditionButton && (
            <Button
              onClick={bottomAdditionButton?.onClick}
              className={bottomAdditionButton?.color}
            >
              <span
                className={
                  'rvtexts regular text-s ' + bottomAdditionButton?.textColor
                }
              >
                {bottomAdditionButton?.text}
              </span>
            </Button>
          )}
          {cancelMessage && (
            <Button
              //   color="black"
              onClick={onClose}
              className={cancelColor}
            >
              <span className={'rvtexts regular text-s ' + cancelTextColor}>
                {cancelMessage}
              </span>
            </Button>
          )}

          {confirmMessage && (
            <Button
              disabled={disableConfirm || loading}
              onClick={onClickConfirm}
              className={ButtonColorEnum.DEFAULT}
              type="submit"
              loading={loading}
            >
              <span className={'rvtexts regular text-s rvcolors color-gray-25'}>
                {confirmMessage}
              </span>
            </Button>
          )}
        </Modal.Actions>
      )}
    </Modal>
  );
};

export default Modals;
