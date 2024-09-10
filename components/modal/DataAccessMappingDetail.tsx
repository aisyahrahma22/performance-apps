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
import { isEmpty, reduce } from 'lodash';
import ModalContentPlaceholder from '../placeholder/ModalContentPlaceholder';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';
import Snippet from '../Snippet';
import useDataAccessMapping from '../../lib/data/dataAccessMapping/useDataAccessMapping';

interface ModalDataAccessMappingDetailProps {
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
}

const ModalDataAccessMappingDetail = ({
  id,
  isOpen,
  closePress,
}: ModalDataAccessMappingDetailProps) => {
  const { dataAccessMapping, isDataAccessMappingLoading } =
    useDataAccessMapping(id);

  const Accesses = useMemo<any>(() => {
    return reduce(
      dataAccessMapping?.dataAccessMapping,
      (acc: any[], access: any) => {
        const layerEl: any = (
          <List.Item key={access.id}>
            <Label circular horizontal size={'tiny'} className={'nomarginh'}>
              <Icon name={'hashtag'} />
              {access.accessPosition?.code}
            </Label>
            <br />
            {access.accessPosition?.name}
          </List.Item>
        );
        acc.push(layerEl);
        return acc;
      },
      [],
    );
  }, [dataAccessMapping]);

  return (
    <Modal onClose={closePress} open={isOpen} size="small">
      <Modal.Header>
        {isDataAccessMappingLoading ? (
          <ModalHeaderPlaceholder />
        ) : (
          <>
            <Snippet
              title={dataAccessMapping?.name}
              description={dataAccessMapping?.description}
            />
            <Label circular>
              <Icon name={'hashtag'} />
              {dataAccessMapping?.code}
            </Label>
          </>
        )}
      </Modal.Header>
      <Modal.Content scrolling>
        {isDataAccessMappingLoading ? (
          <ModalContentPlaceholder />
        ) : isEmpty(Accesses) ? (
          <Header textAlign={'center'}>
            <Header.Subheader>{`Access haven't set yet`}</Header.Subheader>
          </Header>
        ) : (
          <Segment>
            <Segment clearing basic className={'nopadding'}>
              <Header color={'teal'}>Eligible To See</Header>
            </Segment>
            <List
              size={'large'}
              divided
              relaxed
              verticalAlign="middle"
              selection
            >
              {Accesses}
            </List>
          </Segment>
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

export default ModalDataAccessMappingDetail;
