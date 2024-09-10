import Avatar from 'react-avatar';
import { Header, List, SemanticCOLORS } from 'semantic-ui-react';
import React from 'react';
import { toUpper } from 'lodash';

interface SnippetProps {
  title: string;
  description?: string;
  avatarSize?: string;
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'huge';
  hasAvatar?: boolean;
  onClick?: any;
  isJustifyCenter?: boolean;
  className?: string;
  avatarName?: string;
  inverted?: boolean;
  fullWidth?: boolean;
  children?: any;
  src?: string;
  inputLike?: boolean;
  colorHeader?: SemanticCOLORS;
  color?: SemanticCOLORS;
}

const Snippet = ({
  title,
  description,
  avatarSize = '40',
  hasAvatar,
  size = 'medium',
  onClick,
  isJustifyCenter,
  className = '',
  avatarName = title,
  inverted,
  fullWidth,
  children,
  src,
  inputLike,
  colorHeader,
  color,
}: SnippetProps) => {
  if (inputLike)
    return (
      <List>
        <List.Item>
          <label
            style={{
              fontSize: '0.7em',
              opacity: 0.5,
              fontWeight: 'bold',
            }}
          >
            {toUpper(title)}
          </label>
          {description && <List.Header>{description}</List.Header>}
          {children && <List.Header>{children}</List.Header>}
        </List.Item>
      </List>
    );
  return (
    <div onClick={onClick} className={`snippet ${className}`}>
      <div className={`content ${fullWidth ? 'w-100' : ''}`}>
        {hasAvatar && (
          <Avatar
            className={'avatar'}
            round
            name={avatarName}
            size={avatarSize}
            src={src}
          />
        )}
        <Header
          color={color || colorHeader}
          size={size}
          className={`nomargin ${isJustifyCenter ? 'column-flex-center' : ''} ${
            fullWidth ? 'w-100' : ''
          }`}
        >
          {!inverted ? (
            <>
              {title}
              {description && (
                <Header.Subheader>{description}</Header.Subheader>
              )}
              {children && children}
            </>
          ) : (
            <>
              <Header.Subheader>{title}</Header.Subheader>
              {description && description}
              {children && children}
            </>
          )}
        </Header>
      </div>
    </div>
  );
};

export default Snippet;
