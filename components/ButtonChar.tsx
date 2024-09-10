import React from 'react';
import Link from 'next/link';
import { Button, Icon } from 'semantic-ui-react';

type ButtonCharProps = {
  label: string;
  link: string;
  char: string;
};

const ButtonChar = ({ label, link, char }: ButtonCharProps) => {
  return (
    <Link passHref href={link}>
      <Button
        secondary
        circular
        style={{ width: '100%', textAlign: 'left', marginBottom: 10 }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {label}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                background: '#FFFFFF',
                padding: 4,
                borderRadius: '30%',
              }}
            >
              <span style={{ color: '#4736c7' }}>{char}</span>
            </div>
            <Icon name="angle right" style={{ marginLeft: 10 }} />
          </div>
        </div>
      </Button>
    </Link>
  );
};

export default ButtonChar;
