import { FormikProps } from 'formik';
import { find, get } from 'lodash';
import React, { useMemo } from 'react';
import { Grid, Header, Segment, SegmentProps } from 'semantic-ui-react';
import { PerfEmpProps } from '../../../lib/data/perfMidYear/interfaces/perfEmp.interface';
import { PerfFormTypeKPIDetailProps } from '../../../lib/data/perfMidYear/interfaces/perfForm.interface';
import renderHtml from '../../../lib/util/renderHtml';

type PerfEmpItemKPIDescProps = {
  formik: FormikProps<PerfEmpProps>;
  name: string;
  formTypeItemKPIDetails: PerfFormTypeKPIDetailProps[];
} & SegmentProps;

const PerfEmpItemKPIDescMid = ({
  formik,
  name,
  formTypeItemKPIDetails,
  ...rest
}: PerfEmpItemKPIDescProps) => {
  const kpi = useMemo(() => {
    const id = get(formik.values, name) || '';
    if (!id) return;

    return find(formTypeItemKPIDetails, (detail) => detail?.kpi?.id === id)
      ?.kpi;
  }, [formik, name, formTypeItemKPIDetails]);

  return (
    <Segment raised {...rest}>
      <Grid columns={'equal'}>
        <Grid.Row>
          <Grid.Column>
            <Header as={'h4'}>
              <Header.Content>
                Description
                <Header.Subheader>
                  {renderHtml(kpi?.description || '')}
                </Header.Subheader>
              </Header.Content>
            </Header>
          </Grid.Column>
          <Grid.Column>
            <Header as={'h4'}>
              <Header.Content>
                Key Action
                <Header.Subheader>
                  {renderHtml(kpi?.keyAction || '')}
                </Header.Subheader>
              </Header.Content>
            </Header>
          </Grid.Column>
          <Grid.Column>
            <Header as={'h4'}>
              <Header.Content>
                Behaviour
                <Header.Subheader>
                  {renderHtml(kpi?.behaviour || '')}
                </Header.Subheader>
              </Header.Content>
            </Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default PerfEmpItemKPIDescMid;
