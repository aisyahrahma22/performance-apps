import React from 'react';
import { Image } from 'semantic-ui-react';
import Modals from '../../revamp/components/Modals';

type ConfirmationProps = {
  isOpen?: boolean;
  onClickConfirm?: () => void;
  onClose?: () => void;
  tittle?: any;
  message?: any;
};

const ConfirmationModal = ({
  isOpen,
  onClickConfirm,
  onClose,
  tittle,
  message,
}: ConfirmationProps) => {
  return (
    <Modals
      isOpen={isOpen}
      onClose={onClose}
      onClickConfirm={onClickConfirm}
      footer
      confirmMessage="Yes"
      cancelMessage="No"
      size="tiny"
      closeIcon={false}
      title={tittle}
    >
      <div className="rvflexs column centers">
        <Image
          src={'/icons-revamp/icon-save.svg'}
          style={{ width: '56px', marginBottom: '16px' }}
        />
        <span
          className="rvtexts regular text-m rvcolors color-gray-900"
          style={{ textAlign: 'center' }}
        >
          {message}
        </span>
      </div>
    </Modals>
  );
};

export default ConfirmationModal;
