import {
  Button,
  Divider,
  Grid,
  Icon,
  Label,
  List,
  Modal,
} from 'semantic-ui-react';
import parse from 'html-react-parser';
import React, { useMemo } from 'react';
import useMailTemplate from '../../lib/data/mail/useMailTemplate';
import renderHyphen from '../../lib/util/renderHyphen';
import ModalContentPlaceholder from '../placeholder/ModalContentPlaceholder';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';
import Snippet from '../Snippet';

interface ModalMailTemplateDetailProps {
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
}

const ModalMailTemplateDetail = ({
  id,
  isOpen,
  closePress,
}: ModalMailTemplateDetailProps) => {
  const { mailTemplate, isMailTemplateLoading } = useMailTemplate(id);

  const parsedMailTemplateText = useMemo(
    () => parse(mailTemplate?.template || ''),
    [mailTemplate],
  );

  return (
    <Modal open={isOpen} onClose={closePress}>
      <Modal.Header>
        {isMailTemplateLoading ? (
          <ModalHeaderPlaceholder />
        ) : (
          <>
            <Snippet title={mailTemplate?.name} />
            <Label circular>
              <Icon name={'hashtag'} />
              {mailTemplate?.code}
            </Label>
          </>
        )}
      </Modal.Header>
      <Modal.Content scrolling>
        {isMailTemplateLoading ? (
          <ModalContentPlaceholder />
        ) : (
          <Grid columns={'equal'} textAlign={'left'}>
            <Grid.Row>
              <Grid.Column>
                <List selection size={'large'} className={'detail'}>
                  <List.Item>
                    Available Body Parameters
                    <List.Header>
                      {renderHyphen(
                        mailTemplate?.parameter?.split?.(',')?.join?.(', '),
                      )}
                    </List.Header>
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column>
                <List selection size={'large'} className={'detail'}>
                  <List.Item>
                    Available Subject Parameters
                    <List.Header>
                      {renderHyphen(
                        mailTemplate?.paramSubject?.split?.(',')?.join?.(', '),
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
                    Subject
                    <List.Header>
                      {renderHyphen(mailTemplate?.subject)}
                    </List.Header>
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <List selection size={'large'} className={'detail'}>
                  <List.Item active>
                    Email Template
                    <Divider />
                    <code>{parsedMailTemplateText}</code>
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
          </Grid>
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

export default ModalMailTemplateDetail;
