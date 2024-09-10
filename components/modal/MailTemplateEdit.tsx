import {
  Button,
  Form,
  Grid,
  Icon,
  Label,
  List,
  Modal,
} from 'semantic-ui-react';
import InputRichEditor from '../InputRichEditor';
import React, { useMemo } from 'react';
import useMailTemplate from '../../lib/data/mail/useMailTemplate';
import { useFormik } from 'formik';
import * as yup from 'yup';
import renderHyphen from '../../lib/util/renderHyphen';
import useMailTemplateEdit from '../../lib/data/mail/useMailTemplateEdit';
import Input from '../Input';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';
import Snippet from '../Snippet';

interface ModalMailTemplateEditProps {
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
}

const formMailTemplateEditSchema = yup.object({
  template: yup.string().required('Template is required'),
  name: yup.string().required('Name is required'),
});

const ModalMailTemplateEdit = ({
  id,
  isOpen,
  closePress,
}: ModalMailTemplateEditProps) => {
  const { mailTemplate, isMailTemplateLoading } = useMailTemplate(id);
  const { mailTemplateEdit, isMailTemplateEditLoading } = useMailTemplateEdit({
    onSuccess: closePress,
  });

  const initialMailTemplate = useMemo(
    () => ({
      code: mailTemplate?.code,
      name: mailTemplate?.name,
      description: mailTemplate?.description,
      template: mailTemplate?.template,
      subject: mailTemplate?.subject,
    }),
    [mailTemplate],
  );

  const formikMailTemplate = useFormik({
    initialValues: initialMailTemplate,
    onSubmit: (values) => {
      mailTemplateEdit({ ...values, id });
    },
    validationSchema: formMailTemplateEditSchema,
    enableReinitialize: true,
  });

  return (
    <Modal open={isOpen} closeOnDimmerClick={false}>
      <Modal.Header>
        {isMailTemplateLoading ? (
          <ModalHeaderPlaceholder />
        ) : (
          <>
            <Snippet title={formikMailTemplate?.values?.name} />
            <Label circular>
              <Icon name={'hashtag'} />
              {mailTemplate?.code}
            </Label>
          </>
        )}
      </Modal.Header>
      <Modal.Content scrolling>
        {!isMailTemplateLoading && !isMailTemplateEditLoading && (
          <Form
            id={'mail-template-edit-form'}
            loading={isMailTemplateLoading || isMailTemplateEditLoading}
          >
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
                          mailTemplate?.paramSubject
                            ?.split?.(',')
                            ?.join?.(', '),
                        )}
                      </List.Header>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <div className={'wrapper-form-list'}>
              <Input
                value={formikMailTemplate.values.name}
                placeholder={'Name'}
                label={'Name'}
                name={'name'}
                formik={formikMailTemplate}
              />
              <Input
                value={formikMailTemplate.values.subject}
                placeholder={'Subject'}
                label={'Subject'}
                name={'subject'}
                formik={formikMailTemplate}
              />
              <InputRichEditor
                placeholder={'Template'}
                label={'Template'}
                formik={formikMailTemplate}
                name={'template'}
              />
            </div>
          </Form>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Grid columns="equal">
          <Grid.Row>
            <Grid.Column>
              <Button size={'large'} onClick={closePress} fluid type={'button'}>
                <Icon name={'close'} />
                Close
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button
                primary
                fluid
                size={'large'}
                onClick={formikMailTemplate.handleSubmit as any}
                form={'mail-template-edit-form'}
              >
                <Icon name={'save'} />
                Save
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalMailTemplateEdit;
