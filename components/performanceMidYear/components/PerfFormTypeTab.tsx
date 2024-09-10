import React from 'react';
import { Button, Grid } from 'semantic-ui-react';
import { PerfFormTypeProps } from '../../../lib/data/perfMidYear/interfaces/perfForm.interface';
import renderHyphen from '../../../lib/util/renderHyphen';

interface PerfFormTypeTabProps {
  data: PerfFormTypeProps[];
  activeFormTypeId: string;
  setActiveFormTypeId: React.Dispatch<React.SetStateAction<string>>;
}

const PerfFormTypeTab = ({
  data,
  activeFormTypeId,
  setActiveFormTypeId,
}: PerfFormTypeTabProps) => {
  return (
    <Grid columns={4}>
      {data?.map((type) => (
        <Grid.Column key={`form-type-tab-${type?.id}`}>
          <Button
            color={'blue'}
            fluid
            circular
            inverted={activeFormTypeId !== type?.id}
            onClick={() => setActiveFormTypeId(type?.id)}
          >
            {renderHyphen(type?.perfType?.name)}
          </Button>
        </Grid.Column>
      ))}
    </Grid>
  );
};

export default PerfFormTypeTab;
