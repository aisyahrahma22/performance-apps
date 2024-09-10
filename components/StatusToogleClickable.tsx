import React from 'react';
import StatusToggle from './StatusToggle';

type StatusToggleProps = {
  active: boolean;
  onClick: any;
};

export const StatusToogleClickable = ({
  onClick,
  active,
}: StatusToggleProps) => {
  return (
    <div className="pointer" onClick={onClick}>
      <StatusToggle active={active} />
    </div>
  );
};
