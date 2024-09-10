import React from 'react';
import { Icon } from 'semantic-ui-react';

type StatusToggleProps = {
  active: boolean;
};

const StatusToggle = (props: StatusToggleProps) => {
  return props.active ? (
    <Icon size="large" color="green" name="toggle on" />
  ) : (
    <Icon size="large" name="toggle off" />
  );
};

export default StatusToggle;
