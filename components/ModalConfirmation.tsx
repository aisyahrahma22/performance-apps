import { get, last, map } from 'lodash';
import React from 'react';
import Avatar from 'react-avatar';
import { Button, Grid, Header, Icon, List, Modal } from 'semantic-ui-react';

type ModalConfirmationProps = {
  onClose: any;
  onAction: any;
  open: boolean;
  message: any;
  isSelectedAll?: boolean;
  dataList?: any;
  showAvatar?: boolean;
  keyName: string;
  keyLabel?: string;
  label?: string;
  content?: any;
  isLoading?: boolean;
  isModalHeader?: boolean;
  header?: string;
};
const ModalConfirmation = ({
  onClose,
  onAction,
  open,
  message,
  isSelectedAll = true,
  dataList = [],
  showAvatar = false,
  keyName,
  keyLabel = '',
  label,
  content,
  isLoading = false,
  isModalHeader,
  header,
}: ModalConfirmationProps) => {
  return (
    <Modal onClose={onClose} open={open} size="tiny">
      {isModalHeader ? (
        <>
          <Modal.Header>
            <Header size="small">
              <Icon name={'attention'} color={'red'} size={'small'} />
              <Header.Content as={'h3'}>{header}</Header.Content>
            </Header>
          </Modal.Header>
          <Modal.Content>{message}</Modal.Content>
        </>
      ) : (
        <Header size={'medium'} textAlign={'center'} icon>
          {message}
        </Header>
      )}
      <Modal.Content>
        {!isSelectedAll && (
          <List selection verticalAlign="middle" celled>
            {map(dataList, (data) => (
              <List.Item key={data.id}>
                <Grid>
                  {showAvatar && (
                    <Grid.Column width={'one'}>
                      <Avatar
                        className={'avatar'}
                        size={'30'}
                        round
                        name={get(data, keyName)}
                        src={
                          data?.profilePath
                            ? `/api/employee/profile/download/${last(
                                data.profilePath.split('/'),
                              )}`
                            : ''
                        }
                      />
                    </Grid.Column>
                  )}
                  <Grid.Column width={'ten'} style={{ marginLeft: '.5em' }}>
                    <List.Content>
                      {label}
                      <List.Header>{get(data, keyName)}</List.Header>
                      {get(data, keyLabel)}
                    </List.Content>
                  </Grid.Column>
                </Grid>
              </List.Item>
            ))}
          </List>
        )}
        {content && content}
      </Modal.Content>
      <Modal.Actions>
        <Grid columns="equal">
          <Grid.Column>
            <Button fluid onClick={onClose}>
              <Icon name="remove" /> No
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button fluid primary loading={isLoading} onClick={onAction}>
              <Icon name="checkmark" /> Yes
            </Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalConfirmation;
