import React, { useState } from 'react';
import { Button, Grid, Header, List, Segment } from 'semantic-ui-react';
import { FormikProps } from 'formik';
import renderHyphen from '../../../lib/util/renderHyphen';
import renderDate from '../../../lib/util/renderDate';
import renderEnum from '../../../lib/util/renderEnum';

interface SectionDetail {
  formik: FormikProps<any>;
  data: any;
}

const FirstSectionPerfFormCreate = ({ data }: SectionDetail) => {
  const [isHide, setIsHide] = useState(false);

  return (
    <section>
      <Segment clearing>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <Header as={'h4'} color={'blue'}>
              {renderHyphen(data?.name)}
            </Header>
          </div>
          <Button
            icon={isHide ? 'chevron down' : 'chevron up'}
            onClick={() => setIsHide(!isHide)}
            basic
            compact
            size="small"
          />
        </div>
        {!isHide && (
          <section style={{ marginTop: '10px' }}>
            <Grid columns={'equal'} textAlign={'left'}>
              <Grid.Row>
                <Grid.Column>
                  <List selection size={'large'} className={'detail'}>
                    <List.Item>
                     Program Code
                      <List.Header>{renderHyphen(data?.code)}</List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <List selection size={'large'} className={'detail'}>
                    <List.Item>
                      Program Name
                      <List.Header> {renderHyphen(data?.name)}</List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <List selection size={'large'} className={'detail'}>
                    <List.Item>
                      Form Term
                      <List.Header>{renderEnum(data?.formTerm)}</List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <List selection size={'large'} className={'detail'}>
                    <List.Item>
                      Final Result
                      <List.Header>
                        {data?.finalResultMethod === 'SINGLE' ? (
                          <>Single</>
                        ) : (
                          <>Multiple</>
                        )}
                      </List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <List selection size={'large'} className={'detail'}>
                    <List.Item>
                      Start
                      <List.Header>
                        {renderDate(data?.startDate, 'dd MMMM yyyy')}
                      </List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column>
                  <List selection size={'large'} className={'detail'}>
                    <List.Item>
                      End
                      <List.Header>
                        {renderDate(data?.endDate, 'dd MMMM yyyy')}
                      </List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row></Grid.Row>
            </Grid>
          </section>
        )}
      </Segment>
    </section>
  );
};

export default FirstSectionPerfFormCreate;
