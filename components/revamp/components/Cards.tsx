import React from 'react';
import { Card, SemanticCOLORS } from 'semantic-ui-react';

interface CardsProps {
  children?: JSX.Element;
  style?: any;
  classNames?: any;
  onClick?: () => void;
  color?: SemanticCOLORS;
  fluid?: boolean;
  padded?: boolean;
  id?: any;
}

const Cards = ({
  children,
  style,
  classNames,
  onClick,
  color,
  fluid,
  padded = true,
  id,
}: CardsProps) => {
  return (
    <Card
      className={classNames ? 'rvcards ' + classNames : 'rvcards'}
      style={style}
      color={color}
      fluid={fluid}
      onClick={onClick}
      id={id}
    >
      {/* <Placeholder>
        <PlaceholderImage />
      </Placeholder> */}
      {padded ? (
        <div style={{ padding: '8px 16px' }}>{children}</div>
      ) : (
        <div>{children}</div>
      )}
    </Card>
  );
};

export default Cards;
