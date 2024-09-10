import { Button, Grid, Icon, List, Modal, Header } from 'semantic-ui-react';
import React from 'react';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';
import ModalContentPlaceholder from '../placeholder/ModalContentPlaceholder';
import usePerformanceFormsType from '../../lib/data/performanceFormType/usePerformanceFormsType';

interface ModalPerformanceFormTypeDetailProps {
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
}

const ModalPerformanceFormTypeDetail = ({
  id,
  isOpen,
  closePress,
}: ModalPerformanceFormTypeDetailProps) => {
  const { performance, isPerformanceLoading } = usePerformanceFormsType(id);
  return (
    <Modal onClose={closePress} open={isOpen} size="tiny">
      <Modal.Header>
        {isPerformanceLoading ? (
          <ModalHeaderPlaceholder />
        ) : (
          <>
            <Header as={'h4'} color="black">
              <Icon name={'info'} circular />
              <Header.Content>
               Key Data
                <Header.Subheader> Performance Form Type</Header.Subheader>
              </Header.Content>
            </Header>
          </>
        )}
      </Modal.Header>
      <Modal.Content scrolling>
        {isPerformanceLoading ? (
          <ModalContentPlaceholder />
        ) : (
          <>
            <Grid
              columns={'equal'}
              textAlign={'left'}
              style={{ marginBottom: '50px' }}
            >
              <Grid.Row>
                <Grid.Column>
                  <List selection size={'large'} className={'detail'}>
                    <List.Item>
                      Code
                      <List.Header>{performance?.code}</List.Header>
                    </List.Item>
                    <List.Item>
                      Name
                      <List.Header>{performance?.name}</List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </>
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

export default ModalPerformanceFormTypeDetail;
