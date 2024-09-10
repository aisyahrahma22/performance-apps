import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Message,
  Modal,
  Segment,
} from 'semantic-ui-react';
import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import Input from '../Input';
import * as yup from 'yup';
import {
  SystemConfigurationCodeEnum,
  useSystemConfiguration,
} from '../../lib/data/systemConfiguration/useSystemConfiguration';
import useSystemConfigurationEdit from '../../lib/data/systemConfiguration/useSystemConfigurationEdit';

interface ModalMailSystemConfigurationEditProps {
  isOpen: boolean;
  closePress: any;
}

const MAIL_HTTPS_OPTIONS = [
  { text: 'True', value: 'true' },
  { text: 'False', value: 'false' },
];

const formSystemConfigurationEditSchema = yup.object({
  MailHost: yup.object({
    value: yup.string().required('Value is required'),
  }),
  MailHttps: yup.object({
    value: yup.string().required('Value is required'),
  }),
  MailPort: yup.object({
    value: yup.string().required('Value is required'),
  }),
  MailTLS: yup.object({
    value: yup.string().required('Value is required'),
  }),
  MailAuthUser: yup.object({
    value: yup.string().required('Value is required'),
  }),
  MailAuthPass: yup.object({
    value: yup.string().required('Value is required'),
  }),
  MailDefaultFromName: yup.object({
    value: yup.string().required('Value is required'),
  }),
  MailDefaultFromMail: yup.object({
    value: yup.string().required('Value is required'),
  }),
});

const ModalMailSystemConfigurationEdit = ({
  isOpen,
  closePress,
}: ModalMailSystemConfigurationEditProps) => {
  const MailHostEnum = SystemConfigurationCodeEnum.MAIL_HOST;
  const MailHttpsEnum = SystemConfigurationCodeEnum.MAIL_HTTPS;
  const MailPortEnum = SystemConfigurationCodeEnum.MAIL_PORT;
  const MailTLSEnum = SystemConfigurationCodeEnum.MAIL_TLS;
  const MailAuthUserEnum = SystemConfigurationCodeEnum.MAIL_AUTH_USER;
  const MailAuthPassEnum = SystemConfigurationCodeEnum.MAIL_AUTH_PASS;
  const MailDefaultFromNameEnum =
    SystemConfigurationCodeEnum.MAIL_DEFAULT_FROM_NAME;
  const MailDefaultFromMailEnum =
    SystemConfigurationCodeEnum.MAIL_DEFAULT_FROM_MAIL;

  const {
    systemConfiguration: MailHost,
    isSystemConfigurationLoading: isMailHostLoading,
  } = useSystemConfiguration(MailHostEnum);
  const {
    systemConfiguration: MailHttps,
    isSystemConfigurationLoading: isMailHttpsLoading,
  } = useSystemConfiguration(MailHttpsEnum);
  const {
    systemConfiguration: MailPort,
    isSystemConfigurationLoading: isMailPortLoading,
  } = useSystemConfiguration(MailPortEnum);
  const {
    systemConfiguration: MailTLS,
    isSystemConfigurationLoading: isMailTLSLoading,
  } = useSystemConfiguration(MailTLSEnum);
  const {
    systemConfiguration: MailAuthUser,
    isSystemConfigurationLoading: isMailAuthUserLoading,
  } = useSystemConfiguration(MailAuthUserEnum);
  const {
    systemConfiguration: MailAuthPass,
    isSystemConfigurationLoading: isMailAuthPassLoading,
  } = useSystemConfiguration(MailAuthPassEnum);
  const {
    systemConfiguration: MailDefaultFromName,
    isSystemConfigurationLoading: isMailDefaultFromNameLoading,
  } = useSystemConfiguration(MailDefaultFromNameEnum);
  const {
    systemConfiguration: MailDefaultFromMail,
    isSystemConfigurationLoading: isMailDefaultFromMailLoading,
  } = useSystemConfiguration(MailDefaultFromMailEnum);

  const {
    systemConfigurationEditPosting: MailHostEdit,
    isSystemConfigurationEditLoading: MailHostEditLoading,
  } = useSystemConfigurationEdit(
    {
      onSuccess: closePress,
    },
    MailHostEnum,
  );
  const {
    systemConfigurationEditPosting: MailHttpsEdit,
    isSystemConfigurationEditLoading: MailHttpsEditLoading,
  } = useSystemConfigurationEdit(
    {
      onSuccess: closePress,
    },
    MailHttpsEnum,
  );
  const {
    systemConfigurationEditPosting: MailPortEdit,
    isSystemConfigurationEditLoading: MailPortEditLoading,
  } = useSystemConfigurationEdit(
    {
      onSuccess: closePress,
    },
    MailPortEnum,
  );
  const {
    systemConfigurationEditPosting: MailTLSEdit,
    isSystemConfigurationEditLoading: MailTLSEditLoading,
  } = useSystemConfigurationEdit(
    {
      onSuccess: closePress,
    },
    MailTLSEnum,
  );
  const {
    systemConfigurationEditPosting: MailAuthUserEdit,
    isSystemConfigurationEditLoading: MailAuthUserEditLoading,
  } = useSystemConfigurationEdit(
    {
      onSuccess: closePress,
    },
    MailAuthUserEnum,
  );
  const {
    systemConfigurationEditPosting: MailAuthPassEdit,
    isSystemConfigurationEditLoading: MailAuthPassEditLoading,
  } = useSystemConfigurationEdit(
    {
      onSuccess: closePress,
    },
    MailAuthPassEnum,
  );
  const {
    systemConfigurationEditPosting: MailDefaultFromNameEdit,
    isSystemConfigurationEditLoading: MailDefaultFromNameEditLoading,
  } = useSystemConfigurationEdit(
    {
      onSuccess: closePress,
    },
    MailDefaultFromNameEnum,
  );
  const {
    systemConfigurationEditPosting: MailDefaultFromMailEdit,
    isSystemConfigurationEditLoading: MailDefaultFromMailEditLoading,
  } = useSystemConfigurationEdit(
    {
      onSuccess: closePress,
    },
    MailDefaultFromMailEnum,
  );

  const initialSystemConfigurations = useMemo<any>(
    () => ({
      MailHost: {
        code: MailHost?.code,
        name: MailHost?.name,
        description: MailHost?.description,
        value: MailHost?.value,
      },
      MailPort: {
        code: MailPort?.code,
        name: MailPort?.name,
        description: MailPort?.description,
        value: MailPort?.value,
      },
      MailTLS: {
        code: MailTLS?.code,
        name: MailTLS?.name,
        description: MailTLS?.description,
        value: MailTLS?.value,
      },
      MailAuthUser: {
        code: MailAuthUser?.code,
        name: MailAuthUser?.name,
        description: MailAuthUser?.description,
        value: MailAuthUser?.value,
      },
      MailAuthPass: {
        code: MailAuthPass?.code,
        name: MailAuthPass?.name,
        description: MailAuthPass?.description,
        value: MailAuthPass?.value,
      },
      MailDefaultFromName: {
        code: MailDefaultFromName?.code,
        name: MailDefaultFromName?.name,
        description: MailDefaultFromName?.description,
        value: MailDefaultFromName?.value,
      },
      MailDefaultFromMail: {
        code: MailDefaultFromMail?.code,
        name: MailDefaultFromMail?.name,
        description: MailDefaultFromMail?.description,
        value: MailDefaultFromMail?.value,
      },
      MailHttps: {
        code: MailHttps?.code,
        name: MailHttps?.name,
        description: MailHttps?.description,
        value: MailHttps?.value,
      },
    }),
    [
      MailHost,
      MailPort,
      MailTLS,
      MailAuthUser,
      MailAuthPass,
      MailDefaultFromName,
      MailDefaultFromMail,
      MailHttps,
    ],
  );

  const formikSystemConfigurationEdit = useFormik({
    initialValues: initialSystemConfigurations,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (MailHost.value !== values.MailHost.value) {
        MailHostEdit(values.MailHost, MailHostEnum);
      }
      if (MailPort.value !== values.MailPort.value) {
        MailPortEdit(values.MailPort, MailPortEnum);
      }
      if (MailTLS.value !== values.MailTLS.value) {
        MailTLSEdit(values.MailTLS, MailTLSEnum);
      }
      if (MailAuthUser.value !== values.MailAuthUser.value) {
        MailAuthUserEdit(values.MailAuthUser, MailAuthUserEnum);
      }
      if (MailAuthPass.value !== values.MailAuthPass.value) {
        MailAuthPassEdit(values.MailAuthPass, MailAuthPassEnum);
      }
      if (MailDefaultFromName.value !== values.MailDefaultFromName.value) {
        MailDefaultFromNameEdit(
          values.MailDefaultFromName,
          MailDefaultFromNameEnum,
        );
      }
      if (MailDefaultFromMail.value !== values.MailDefaultFromMail.value) {
        MailDefaultFromMailEdit(
          values.MailDefaultFromMail,
          MailDefaultFromMailEnum,
        );
      }
      if (MailHttps.value !== values.MailHttps.value) {
        MailHttpsEdit(values.MailHttps, MailHttpsEnum);
      }
    },
    validationSchema: formSystemConfigurationEditSchema,
  });

  return (
    <Modal
      onClose={closePress}
      open={isOpen}
      size="large"
      closeOnDimmerClick={false}
    >
      <Modal.Header>
        <Header as={'h4'} color="teal">
          <Icon name={'pencil'} circular />
          <Header.Content>
            System Configuration
            <Header.Subheader>Mail Account Configuration</Header.Subheader>
          </Header.Content>
        </Header>
      </Modal.Header>
      <Modal.Content scrolling>
        <Message warning>
          <p>
            <b>NOTE</b> the changes will be applied in the next day!
          </p>
        </Message>
        <Form
          id={'systemConfigurations-edit-form'}
          loading={
            MailHostEditLoading ||
            MailPortEditLoading ||
            MailTLSEditLoading ||
            MailAuthUserEditLoading ||
            MailAuthPassEditLoading ||
            MailDefaultFromNameEditLoading ||
            MailDefaultFromMailEditLoading ||
            MailHttpsEditLoading ||
            isMailHostLoading ||
            isMailPortLoading ||
            isMailTLSLoading ||
            isMailAuthUserLoading ||
            isMailAuthPassLoading ||
            isMailDefaultFromNameLoading ||
            isMailDefaultFromMailLoading ||
            isMailHttpsLoading
          }
        >
          <Grid basic padded="vertically">
            <Grid.Row>
              <Grid.Column>
                <Segment clearing>
                  <Input
                    placeholder={'Value'}
                    label={MailHost?.description}
                    formik={formikSystemConfigurationEdit}
                    name={`MailHost.value`}
                    type={'text'}
                  />
                  <Input
                    value={`MailHttps.value`}
                    placeholder={'Description'}
                    label={MailHttps?.description}
                    formik={formikSystemConfigurationEdit}
                    name={`MailHttps.value`}
                    type={'text'}
                    select
                    options={MAIL_HTTPS_OPTIONS}
                  />
                  <Input
                    placeholder={'Value'}
                    label={MailPort?.description}
                    formik={formikSystemConfigurationEdit}
                    name={`MailPort.value`}
                    type={'text'}
                  />
                  <Input
                    placeholder={'Value'}
                    label={MailTLS?.description}
                    formik={formikSystemConfigurationEdit}
                    name={`MailTLS.value`}
                    type={'text'}
                  />
                  <Input
                    placeholder={'Value'}
                    label={MailAuthUser?.description}
                    formik={formikSystemConfigurationEdit}
                    name={`MailAuthUser.value`}
                    type={'text'}
                  />
                  <Input
                    placeholder={'Value'}
                    label={MailAuthPass?.description}
                    formik={formikSystemConfigurationEdit}
                    name={`MailAuthPass.value`}
                    type={'text'}
                  />
                  <Input
                    placeholder={'Value'}
                    label={MailDefaultFromName?.description}
                    formik={formikSystemConfigurationEdit}
                    name={`MailDefaultFromName.value`}
                    type={'text'}
                  />
                  <Input
                    placeholder={'Value'}
                    label={MailDefaultFromMail?.description}
                    formik={formikSystemConfigurationEdit}
                    name={`MailDefaultFromMail.value`}
                    type={'text'}
                  />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Grid columns="equal">
          <Grid.Column>
            <Button size={'large'} fluid onClick={closePress}>
              Close
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button
              fluid
              primary
              size={'large'}
              type={'submit'}
              form={'systemConfigurations-edit-form'}
              onClick={formikSystemConfigurationEdit.handleSubmit as any}
            >
              <Icon name={'save'} />
              Save
            </Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalMailSystemConfigurationEdit;
