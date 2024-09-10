import { last } from 'lodash';
import React from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { EmployeeProps } from '../../../lib/data/perfMidYear/interfaces/perfEmp.interface';
import { PerfFormProps } from '../../../lib/data/perfMidYear/interfaces/perfForm.interface';
import renderDate from '../../../lib/util/renderDate';
import renderEnum from '../../../lib/util/renderEnum';
import renderHyphen from '../../../lib/util/renderHyphen';
import Snippet from '../../Snippet';

interface PerfFormDescProps {
  data: PerfFormProps;
  dataEmployee?: EmployeeProps;
  showEmployee?: boolean;
}

const PerfFormDesc = ({
  data,
  dataEmployee,
  showEmployee = false,
}: PerfFormDescProps) => {
  return (
   <div>
  <Grid>
        <Grid.Row columns={'equal'}>
          <Column
            header="Program Code"
            content={data?.perfProgram?.code}
          />
          <Column
            header="Program Name"
            content={data?.perfProgram?.name}
          />
        </Grid.Row>
        <Grid.Row columns={'equal'} className={'pt-0'}>
          <Column
            header="Form Term"
            content={data?.perfProgram?.formTerm}
            isEnum
          />
          <Column
            header="Final Result Method"
            content={data?.perfProgram?.finalResultMethod}
            isEnum
          />
        </Grid.Row>
        <Grid.Row columns={'equal'} className={'pt-0'}>
          <Column
            header="Form Member"
            content={data?.perfProgram?.formMember}
            isEnum
            preContent="By "
          />
        </Grid.Row>
      </Grid>
   </div>
  );
};

type ColumnProps = {
  header: string;
  content: string;
  isDate?: boolean;
  isEnum?: boolean;
  preContent?: string;
};

const Column = ({
  header,
  content,
  isDate,
  isEnum,
  preContent = '',
}: ColumnProps) => {
  return (
    <Grid.Column>
      <Header as={'h4'}>
        <Header.Subheader style={{ marginBottom: '5px', fontSize: '13px' }}>
          {renderHyphen(header)}
        </Header.Subheader>
        {preContent}
        {isDate
          ? renderDate(content, 'dd/MM/yyyy')
          : isEnum
          ? renderEnum(content)
          : renderHyphen(content)}
      </Header>
    </Grid.Column>
  );
};

export default PerfFormDesc;
