import { Popup } from 'semantic-ui-react';
import React from 'react';
import Snippet from './Snippet';
import renderHyphen from '../lib/util/renderHyphen';
import { getName } from '../lib/util/getName';
import { last } from 'lodash';

interface PopupNameProps {
  trigger: any;
  data: any;
}

const PopupName = ({ trigger, data }: PopupNameProps) => {
  return (
    <Popup
      content={
        <Snippet
          avatarSize={'30'}
          hasAvatar
          size={'tiny'}
          title={renderHyphen(getName(data))}
          description={`${renderHyphen(data?.employee?.code || data?.code)}`}
          src={
            data?.employee?.profilePath
              ? `/api/employee/profile/download/${last(
                  data.employee.profilePath.split('/'),
                )}`
              : ''
          }
        />
      }
      trigger={trigger}
    />
  );
};

export default PopupName;
