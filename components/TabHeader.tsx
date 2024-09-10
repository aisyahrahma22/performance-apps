import React from 'react';
import {
  Breadcrumb,
  Button,
  Header,
  Icon,
  SemanticCOLORS,
  SemanticICONS,
} from 'semantic-ui-react';

type TabHeaderProps = {
  icon?: SemanticICONS;
  name: string;
  showBackButton?: boolean;
  onClickBack?: () => void;
  onClickAction?: () => void;
  parentName?: string;
  subParentName?: string;
  lastSubHeaderName?: string;
  actionButtonTitle?: string;
  actionButtonColor?: SemanticCOLORS;
};

const TabHeader: React.FC<TabHeaderProps> = ({
  icon,
  name,
  parentName,
  subParentName,
  showBackButton = false,
  onClickBack,
  lastSubHeaderName = '',
  actionButtonTitle,
  actionButtonColor,
  onClickAction,
}) => (
  <Header>
    {actionButtonTitle && (
      <Button
        floated="right"
        onClick={onClickAction}
        color={actionButtonColor}
      >
        {actionButtonTitle}
      </Button>
    )}
    {showBackButton ? (
      <span onClick={onClickBack}>
        <Icon name="arrow left" className="pointer" />
      </span>
    ) : (
      <Icon
        circular
        inverted
        color="black"
        name={icon}
        rotated={icon === 'refresh' ? 'clockwise' : undefined}
      />
    )}
    <Header.Content>
      {name}
      {parentName && (
        <Header.Subheader>
          <Breadcrumb>
            <Breadcrumb.Section>{parentName}</Breadcrumb.Section>
            {subParentName && (
              <>
                <Breadcrumb.Divider icon="right arrow" />
                <Breadcrumb.Section>{subParentName}</Breadcrumb.Section>
              </>
            )}
            <Breadcrumb.Divider icon="right arrow" />
            <Breadcrumb.Section active>
              {lastSubHeaderName || name}
            </Breadcrumb.Section>
          </Breadcrumb>
        </Header.Subheader>
      )}
    </Header.Content>
  </Header>
);

export default TabHeader;
