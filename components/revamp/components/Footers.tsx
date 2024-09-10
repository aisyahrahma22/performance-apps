import React, { forwardRef, ReactNode } from 'react';
import PropTypes from 'prop-types';

interface FootersProps {
  children?: ReactNode;
}

const Footers = forwardRef<HTMLDivElement, FootersProps>(
  ({ children }, ref) => {
    return (
      <div className="rvfooters" ref={ref}>
        <div>{children}</div>
      </div>
    );
  },
);

Footers.displayName = 'Footers';

Footers.propTypes = {
  children: PropTypes.node,
};

export default Footers;
