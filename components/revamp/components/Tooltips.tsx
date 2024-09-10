import React from 'react';
import { Header, Button, Popup, Grid } from 'semantic-ui-react';
import {
  TooltipsTypeColorEnum,
  TooltipsTypeEnum,
} from '../enum/TooltipsTypeColorEnum';
import { ButtonColorEnum } from '../enum/ButtonColorsEnum';

type TooltipsProps = {
  trigger: any;
  title?: string;
  message?: string | null;
  type?: TooltipsTypeEnum;
  position?: 'right' | 'top';
};

const Tooltips = ({
  trigger,
  type,
  position,
  title,
  message,
}: TooltipsProps) => {
  function Contents() {
    return (
      <Grid divided>
        <Grid.Column>
          <Header as="h4">
            <span className="rvtexts semibold text-s rvcolors color-gray-800">
              {title}
            </span>
          </Header>
          <p className="rvtexts regular text-xs rvcolors color-gray-800">
            {message}
          </p>
          <Button>Choose</Button>
        </Grid.Column>
      </Grid>
    );
  }

  function ContentsWhite() {
    return (
      <Grid divided>
        <Grid.Column>
          <Header as="h4">
            <span className="rvtexts semibold text-s rvcolors color-gray-25">
              {title}
            </span>
          </Header>
          <p className="rvtexts regular text-xs rvcolors color-gray-25">
            {message}
          </p>
          <Button className={ButtonColorEnum.DEFAULT} floated="right">
            Okay
          </Button>
        </Grid.Column>
      </Grid>
    );
  }

  switch (type) {
    case 'Default':
      return (
        <Popup
          trigger={trigger}
          flowing
          hoverable
          position={position == 'top' ? 'top center' : 'right center'}
          className={TooltipsTypeColorEnum.DEFAULT}
          open
        >
          <Contents />
        </Popup>
      );

    case 'Success':
      return (
        <Popup
          trigger={trigger}
          flowing
          hoverable
          position={position == 'top' ? 'top center' : 'right center'}
          className={TooltipsTypeColorEnum.SUCCESS}
          open
        >
          <Contents />
        </Popup>
      );

    case 'Primary':
      return (
        <Popup
          trigger={trigger}
          flowing
          hoverable
          position={position == 'top' ? 'top center' : 'right center'}
          className={TooltipsTypeColorEnum.PRIMARY}
          open
        >
          <ContentsWhite />
        </Popup>
      );

    default:
      return (
        <Popup
          trigger={trigger}
          flowing
          hoverable
          position={position == 'top' ? 'top center' : 'right center'}
          className={TooltipsTypeColorEnum.DEFAULT}
          open
        >
          <Contents />
        </Popup>
      );
  }
};

export default Tooltips;
