import {
  Button,
  Grid,
  Header,
  Icon,
  Label,
  List,
  Modal,
  Segment,
} from 'semantic-ui-react';
import React, { useMemo } from 'react';
import { filter, groupBy, isEmpty, reduce, sortBy } from 'lodash';
import ModalContentPlaceholder from '../placeholder/ModalContentPlaceholder';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';
import Snippet from '../Snippet';
import usePerformanceWorkflowPosition from '../../lib/data/performanceWorkflowPosition/usePerformanceWorkflowPosition';
import { PFWorkflowTypeEnum } from '../../lib/enums/PerformanceEnum';

interface ModalPerformanceWorkflowPositionProps {
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
}

const workflowStatus = (type: PFWorkflowTypeEnum): [any, string] => {
  switch (type) {
    case PFWorkflowTypeEnum.PF_WORKFLOW_APPROVER:
      return [
        <Icon key={type} color={'green'} name={'check circle'} />,
        'APPROVER',
      ];
    case PFWorkflowTypeEnum.PF_WORKFLOW_READER:
      return [
        <Icon key={type} color={'blue'} name={'info circle'} />,
        'READER',
      ];
    default:
      return [<Icon key={type} name={'circle'} />, 'UNKNOWN'];
  }
};

const workflowList = (value: any) => (
  <List size={'large'} relaxed divided verticalAlign="middle" selection>
    {value.map((workflow: any) => {
      const [IconStatus, content] = workflowStatus(workflow.type);
      return (
        <List.Item key={workflow.id}>
          <Label horizontal size={'tiny'} className={'nomarginh'}>
            {IconStatus}
            {content}
          </Label>
          <br />
          {workflow.assigneePosition?.name}
        </List.Item>
      );
    })}
  </List>
);

const ModalPerformanceWorkflowPositionDetail = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceWorkflowPositionProps) => {
  const { performanceWorkflowPosition, isPerformanceWorkflowPositionLoading } =
    usePerformanceWorkflowPosition(id);

  const Workflows = useMemo<any>(() => {
    const groupedWorkflows = groupBy(
      sortBy(
        filter(
          performanceWorkflowPosition?.PFWorkflowPst,
          (workflow) =>
            workflow.type == PFWorkflowTypeEnum.PF_WORKFLOW_APPROVER,
        ),
        'level',
      ),
      'level',
    );

    const readerWorkflows = filter(
      performanceWorkflowPosition?.PFWorkflowPst,
      (workflow) => workflow.type == PFWorkflowTypeEnum.PF_WORKFLOW_READER,
    );

    const checkerReader = [[readerWorkflows, 'Reader']];

    const result = reduce(
      groupedWorkflows,
      (acc: any[], value: any, idx: any) => {
        const layerEl: any = (
          <Segment key={idx}>
            <Segment clearing basic className={'nopadding'}>
              <Header color={'teal'}>Layer {idx} Approver</Header>
            </Segment>
            {workflowList(value)}
          </Segment>
        );
        acc.push(layerEl);
        return acc;
      },
      [],
    );

    return reduce(
      checkerReader,
      (acc: any[], values: any, idx: any) => {
        const [value, type] = values;
        const layerEl: any = (
          <Segment key={idx}>
            <Segment clearing basic className={'nopadding'}>
              <Header color={'teal'}>{type}</Header>
            </Segment>
            {workflowList(value)}
          </Segment>
        );
        acc.push(layerEl);
        return acc;
      },
      result,
    );
  }, [performanceWorkflowPosition]);

  return (
    <Modal onClose={closePress} open={isOpen} size="small">
      <Modal.Header>
        {isPerformanceWorkflowPositionLoading ? (
          <ModalHeaderPlaceholder />
        ) : (
          <>
            <Snippet
              title={performanceWorkflowPosition?.name}
              description={performanceWorkflowPosition?.description}
            />
            <Label circular>
              <Icon name={'hashtag'} />
              {performanceWorkflowPosition?.code}
            </Label>
          </>
        )}
      </Modal.Header>
      <Modal.Content scrolling>
        {isPerformanceWorkflowPositionLoading ? (
          <ModalContentPlaceholder />
        ) : isEmpty(Workflows) ? (
          <Header textAlign={'center'}>
            <Header.Subheader>{`Workflows haven't set yet`}</Header.Subheader>
          </Header>
        ) : (
          Workflows
        )}
      </Modal.Content>
      <Modal.Actions>
        <Grid columns="equal">
          <Grid.Column>
            <Button size={'large'} fluid onClick={closePress}>
              Close
            </Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalPerformanceWorkflowPositionDetail;
