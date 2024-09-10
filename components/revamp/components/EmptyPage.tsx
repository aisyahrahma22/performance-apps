import React from 'react';
import { Button, Grid, Image, SemanticSIZES } from 'semantic-ui-react';
import { ButtonColorEnum } from '../enum/ButtonColorsEnum';

type EmptyProps = {
  title?: string;
  description?: string;
  icon?: string;
  iconSize?: SemanticSIZES | 'medium';
  buttonTitle?: string;
  buttonOnClick?: () => void;
};

const EmptyPage = ({
  title,
  description,
  icon,
  iconSize,
  buttonTitle,
  buttonOnClick,
}: EmptyProps) => {
  return (
    <Grid centered>
      <Grid.Row>
        <Image src={icon} size={iconSize} />
      </Grid.Row>
      <Grid.Row style={{ padding: '0' }}>
        <span className="rvtexts semibold xss rvcolors color-gray-900">
          {title}
        </span>
      </Grid.Row>
      <Grid.Row>
        <span
          className="rvtexts regular text-m rvcolors color-gray-900"
          style={{
            paddingLeft: '128px',
            paddingRight: '128px',
            // paddingTop: '4px',
          }}
        >
          {description}
        </span>
      </Grid.Row>
      {buttonTitle && buttonOnClick && (
        <Grid.Row>
          <Button className={ButtonColorEnum.DEFAULT} onClick={buttonOnClick}>
            New IDP
          </Button>
        </Grid.Row>
      )}
    </Grid>
  );
};

export default EmptyPage;
