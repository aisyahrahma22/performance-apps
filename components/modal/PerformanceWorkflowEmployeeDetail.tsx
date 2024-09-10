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
import usePerformanceWorkflowEmployee from '../../lib/data/performanceWorkflowEmployee/usePerformanceWorkflowEmployee';
import { PFWorkflowTypeEnum } from '../../lib/enums/PerformanceEnum';

interface ModalPerformanceWorkflowEmployeeProps {
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
}

const workflowStatus = (type: PFWorkflowTypeEnum): [any, string] => {
  switch (type) {
    case PFWorkflowTypeEnum.PF_WORKFLOW_APPROVER:
      return [
        <Icon key={type} color={'black'} name={'check circle'} />,
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
        <div style={{display: 'flex'}}>
          <div><Label horizontal size={'tiny'} className={'nomarginh'}>
            {IconStatus}
            {content}
          </Label></div>
          <br />
        <div style={{marginLeft: '5px'}}>{workflow.assigneeEmployee?.fullName}</div>
        </div>
        </List.Item>
      );
    })}
  </List>
);

const ModalPerformanceWorkflowEmployeeDetail = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceWorkflowEmployeeProps) => {
  const { performanceWorkflowEmployee, isPerformanceWorkflowEmployeeLoading } =
    usePerformanceWorkflowEmployee(id);

  const Workflows = useMemo<any>(() => {
    const groupedWorkflows = groupBy(
      sortBy(
        filter(
          performanceWorkflowEmployee?.PFWorkflowEmp,
          (workflow) =>
            workflow.type == PFWorkflowTypeEnum.PF_WORKFLOW_APPROVER,
        ),
        'level',
      ),
      'level',
    );

    const readerWorkflows = filter(
      performanceWorkflowEmployee?.PFWorkflowEmp,
      (workflow) => workflow.type == PFWorkflowTypeEnum.PF_WORKFLOW_READER,
    );

    const checkerReader = [[readerWorkflows, 'Reader']];

    const result = reduce(
      groupedWorkflows,
      (acc: any[], value: any, idx: any) => {
        const layerEl: any = (
         <div>
            <Segment clearing basic className={'nopadding'}>
              <Header color={'blue'}>Layer {idx} Approver</Header>
            </Segment>
            <div>{workflowList(value)}</div>
         </div>
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
          <div>
             <Segment clearing basic className={'nopadding'}>
              <Header color={'blue'}>{type}</Header>
            </Segment>
            {workflowList(value)}
          </div>
        );
        acc.push(layerEl);
        return acc;
      },
      result,
    );
  }, [performanceWorkflowEmployee]);

  return (
    <Modal onClose={closePress} open={isOpen} size="small">
      <Modal.Header>
        {isPerformanceWorkflowEmployeeLoading ? (
          <ModalHeaderPlaceholder />
        ) : (
          <>
            <Snippet
              title={performanceWorkflowEmployee?.fullName}
              description={performanceWorkflowEmployee?.description}
            />
            <Label circular>
              <Icon name={'hashtag'} />
              {performanceWorkflowEmployee?.code}
            </Label>
          </>
        )}
      </Modal.Header>
      <Modal.Content scrolling>
        {isPerformanceWorkflowEmployeeLoading ? (
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

export default ModalPerformanceWorkflowEmployeeDetail;
