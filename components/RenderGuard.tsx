import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Segment } from 'semantic-ui-react';
import { RightEnum } from '../lib/enums/RightEnum';
import {
  currentActionsSelector,
  loadingAuthStateSelector,
} from '../lib/slice/auth';

interface RenderGuardProps {
  children: JSX.Element;
  actionKey: RightEnum;
}

interface RenderGuardListProps {
  children: JSX.Element;
  actionList: string[];
}

interface NoAccessGuardProps {
  actionList: string[];
}

export const RenderGuard = ({ actionKey, children }: RenderGuardProps) => {
  const currentActions = useSelector(currentActionsSelector);
  const componentAction = currentActions.includes(actionKey);
  return <>{!!componentAction && children}</>;
};

export const RenderGuardList = ({
  actionList,
  children,
}: RenderGuardListProps) => {
  const currentActions = useSelector(currentActionsSelector);
  const accessGuard = currentActions.some((action) =>
    actionList.includes(action),
  );
  return <>{!!accessGuard && children}</>;
};

export const NoAccessRenderGuard = ({ actionList }: NoAccessGuardProps) => {
  const currentActions = useSelector(currentActionsSelector);
  const loadingAuth = useSelector(loadingAuthStateSelector);

  const accessGuard = useMemo(() => {
    return currentActions.some((action) => actionList.includes(action));
  }, [currentActions, actionList]);

  return (
    <>{!accessGuard && <Segment loading={loadingAuth}>No Access</Segment>}</>
  );
};
