import React, { ReactChild } from 'react';

interface PointerProps {
  children: ReactChild;
  onClick?: any;
  highlight?: boolean;
  style?: any;
}

export default function Pointer({
  children,
  onClick,
  highlight,
  style,
}: PointerProps) {
  return (
    <div onClick={onClick} className={'pointer'} style={style}>
      {highlight ? <a>{children}</a> : children}
    </div>
  );
}
