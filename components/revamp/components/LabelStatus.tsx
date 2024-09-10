import React from 'react';
import { Label, SemanticSIZES, Image } from 'semantic-ui-react';
import { ColorStatusEnum, LabelStatusEnum } from '../enum/LabelStatusEnum';

type LabelStatusProps = {
  type: LabelStatusEnum;
  size?: SemanticSIZES;
};

const LabelStatus = ({ type, size }: LabelStatusProps) => {
  const status = type;
  const statusUpdate =
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  switch (statusUpdate) {
    case 'Approved':
      return (
        <Label
          size={size}
          className={ColorStatusEnum.Approved}
          style={{
            display: 'flex',
            justiyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Image
            src="/icons-revamp/Approved.svg"
            style={{ marginRight: '4px' }}
          />
          <span className="rvtexts semibold text-xs rvcolors color-gray-25">
            {statusUpdate}
          </span>
        </Label>
      );

    case 'Requested':
      return (
        <Label size={size} className={ColorStatusEnum.Requested}>
          <div className="rvflexs row start center">
            <Image
              src="/icons-revamp/Requested.svg"
              style={{ width: '14px', marginRight: '4px' }}
            />
            <span className="rvtexts semibold text-xs rvcolors color-gray-25">
              {statusUpdate}
            </span>
          </div>
        </Label>
      );

    case 'Draft':
      return (
        <Label size={size} className={ColorStatusEnum.Draft}>
          <div className="rvflexs row start center">
            <Image
              src="/icons-revamp/Draft.svg"
              style={{ width: '14px', marginRight: '4px' }}
            />
            <span className="rvtexts semibold text-xs rvcolors color-gray-25">
              {statusUpdate}
            </span>
          </div>
        </Label>
      );

    case 'In Progress':
      return (
        <Label size={size} className={ColorStatusEnum.InProgress}>
          <div className="rvflexs row start center">
            <Image
              src="/icons-revamp/InProgress.svg"
              style={{ width: '14px', marginRight: '4px' }}
            />
            <span className="rvtexts semibold text-xs rvcolors color-gray-25">
              {statusUpdate}
            </span>
          </div>
        </Label>
      );

    case 'Rejected':
      return (
        <Label size={size} className={ColorStatusEnum.Rejected}>
          <div className="rvflexs row start center">
            <Image
              src="/icons-revamp/Rejected.svg"
              style={{ width: '14px', marginRight: '4px' }}
            />
            <span className="rvtexts semibold text-xs rvcolors color-gray-25">
              {statusUpdate}
            </span>
          </div>
        </Label>
      );

    case 'Verified':
      return (
        <Label size={size} className={ColorStatusEnum.Verified}>
          <div className="rvflexs row start center">
            <Image
              src="/icons-revamp/Verified.svg"
              style={{ width: '14px', marginRight: '4px' }}
            />
            <span className="rvtexts semibold text-xs rvcolors color-gray-25">
              {statusUpdate}
            </span>
          </div>
        </Label>
      );

    default:
      return (
        <Label size={size} className={ColorStatusEnum.Requested}>
          <div className="rvflexs row start center">
            {/* <Image
              src="/icons-revamp/Requested.svg"
              style={{ width: '14px', marginRight: '4px' }}
            /> */}
            <span className="rvtexts semibold text-xs rvcolors color-gray-25">
              {statusUpdate}
            </span>
          </div>
        </Label>
      );
  }
};

export default LabelStatus;
