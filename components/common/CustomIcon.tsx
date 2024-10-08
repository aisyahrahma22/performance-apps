import React from 'react';
import { get } from 'lodash';
import { useMemo } from 'react';

interface CustomIconProps {
  icon: string;
}

export default function CustomIcon({ icon }: CustomIconProps) {
  const iconObj = useMemo(
    () => ({
      close: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_20358_105014"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="24"
            height="24"
          >
            <rect width="24" height="24" fill="#C4C4C4" />
          </mask>
          <g mask="url(#mask0_20358_105014)"></g>
          <path
            d="M9.17181 16.2418L11.9998 13.4138L14.8278 16.2418L16.2418 14.8278L13.4138 11.9998L16.2418 9.17181L14.8278 7.75781L11.9998 10.5858L9.17181 7.75781L7.75781 9.17181L10.5858 11.9998L7.75781 14.8278L9.17181 16.2418Z"
            fill="#1F1F1F"
          />
          <path
            d="M12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22ZM12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4Z"
            fill="#1F1F1F"
          />
        </svg>
      ),
    }),
    [],
  );

  return get(iconObj, icon);
}
