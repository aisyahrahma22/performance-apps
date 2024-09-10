import React, {
  useEffect,
  useCallback,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  Segment,
  Header,
  Divider,
  Button,
  Icon,
  List,
  Modal,
  Grid,
} from 'semantic-ui-react';
import useReviewMeetingDocument from '../../lib/data/reviewMeeting/useReviewMeetingDocument';
import { getReviewMeetingDocument } from '../../lib/data/reviewMeeting/useReviewMeetingDocumentDownload';
import { postReviewMeetingDocUpload } from '../../lib/data/reviewMeeting/useReviewMeetingDocumentUpload';
import InputFile from '../InputFile';

const ReviewMeetingUpload = ({ ReviewMeetingId }: any) => {
  const extraBody = {
    id: ReviewMeetingId,
  };
  const reviewMeetingDocumentRef = useRef<any>();
  const uploadSuccess = useCallback(() => {
    reviewMeetingDocumentRef.current?.refresh();
  }, []);

  return (
    <>
      <Segment raised>
        <Header as="h4" color={'purple'}>
          Upload Form
        </Header>
        <InputFile
          accept={'.xlsx,.xls,.jpg,.jpeg,.pdf'}
          uploadFetcher={postReviewMeetingDocUpload}
          extraBody={extraBody}
          multiple
          onUploadSuccess={uploadSuccess}
        />
        <Divider />
        <ReviewMeetingDocument
          id={ReviewMeetingId}
          ref={reviewMeetingDocumentRef}
        />
      </Segment>
    </>
  );
};

const ReviewMeetingDocument = forwardRef(({ id }: any, ref: any) => {
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [modalDeleteData, setModalDeleteData] = useState<string[]>([]);
  const {
    reviewMeetingDocument,
    reviewMeetingDocumentRefreshPress,
    isReviewMeetingDocumentLoading,
    setReviewMeetingDocumentFilter,
    reviewMeetingDocumentDeletePress,
  } = useReviewMeetingDocument();

  useImperativeHandle(ref, () => ({
    refresh: () => {
      reviewMeetingDocumentRefreshPress();
    },
  }));

  useEffect(() => {
    setReviewMeetingDocumentFilter({ talentMeeting: { id: id } });
  }, [id, setReviewMeetingDocumentFilter]);

  // Modal Delete
  const modalDeleteClosePress = useCallback(() => {
    setModalDeleteData([]);
    setIsModalDelete(false);
  }, []);

  const modalDeleteYesPress = useCallback(() => {
    reviewMeetingDocumentDeletePress(modalDeleteData.map((d: any) => d.id));
    setIsModalDelete(false);
  }, [modalDeleteData, reviewMeetingDocumentDeletePress]);

  const deleteOnePress = useCallback(
    (data) => () => {
      setModalDeleteData([data]);
      setIsModalDelete(true);
    },
    [],
  );

  return (
    <>
      <Button size={'tiny'} compact onClick={reviewMeetingDocumentRefreshPress}>
        <Icon name={'refresh'} loading={isReviewMeetingDocumentLoading} />
        Refresh
      </Button>
      <List relaxed selection divided>
        {reviewMeetingDocument?.map?.((up: any) => (
          <List.Item key={up.id}>
            <List.Content floated="right">
              {/* <Icon
                name={'download'}
                onClick={() => getReviewMeetingDocument(up.fileName)}
              /> */}
              <Button.Group icon basic size="medium" compact>
                <Button
                  icon={'download'}
                  onClick={() => getReviewMeetingDocument(up.fileName)}
                />
                <Button icon={'trash'} onClick={deleteOnePress(up)} />
              </Button.Group>
            </List.Content>
            <List.Content>
              <List.Header>{up.fileName}</List.Header>
            </List.Content>
          </List.Item>
        ))}
      </List>
      {/* Delete Modal */}
      <Modal onClose={modalDeleteClosePress} open={isModalDelete} size="tiny">
        <Modal.Content>
          <Header size={'tiny'} textAlign={'center'} icon>
            <Icon name={'trash'} inverted circular />
            Are you sure want to delete this file?
          </Header>
        </Modal.Content>
        <Modal.Actions>
          <Grid columns="equal">
            <Grid.Column>
              <Button fluid onClick={modalDeleteClosePress}>
                <Icon name="remove" /> No
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button fluid primary onClick={modalDeleteYesPress}>
                <Icon name="checkmark" /> Yes
              </Button>
            </Grid.Column>
          </Grid>
        </Modal.Actions>
      </Modal>
    </>
  );
});

ReviewMeetingDocument.displayName = 'ReviewMeetingDocument';

export default ReviewMeetingUpload;
