import {
  Button,
  Divider,
  Form,
  Grid,
  Header,
  Icon,
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
import renderHyphen from '../../lib/util/renderHyphen';
import InputWithLabel from '../InputWithLabel';
import {
  LearningUnitEnum,
  optionsReminderInput,
} from '../../helper/learningVariables';
import { last, split } from 'lodash';

interface ModalSystemConfigurationEditProps {
  code: SystemConfigurationCodeEnum;
  isOpen?: boolean;
  closePress?: any;
  isInputUnit?: boolean;
  isPage?: boolean;
}

const formSystemConfigurationEditSchema = yup.object({
  value: yup.number().min(1).required('Value is required'),
});

const formSystemConfigurationUnitInputEditSchema = yup.object({
  value: yup.string().required('Value is required'),
});

const ModalSystemConfigurationEdit = ({
  isOpen,
  closePress,
  code,
  isInputUnit = false,
  isPage,
}: ModalSystemConfigurationEditProps) => {
  const { systemConfiguration, isSystemConfigurationLoading } =
    useSystemConfiguration(code);

  const { systemConfigurationEditPosting, isSystemConfigurationEditLoading } =
    useSystemConfigurationEdit(
      {
        onSuccess: closePress,
      },
      code,
    );

  const initialSystemConfigurations = useMemo(
    () => ({
      code: systemConfiguration?.code,
      name: systemConfiguration?.name,
      description: systemConfiguration?.description,
      value: systemConfiguration?.value,
      valueLabel: systemConfiguration?.value?.slice(0, -1),
    }),
    [systemConfiguration],
  );

  const initialFormat = useMemo(
    () => ({
      valueFormat: last(split(systemConfiguration?.value, '')),
    }),
    [systemConfiguration],
  );

  const formikSystemConfigurationEdit = useFormik({
    initialValues: initialSystemConfigurations,
    enableReinitialize: true,
    onSubmit: (values) => {
      systemConfigurationEditPosting({ ...values, code });
    },
    validationSchema: isInputUnit
      ? formSystemConfigurationUnitInputEditSchema
      : formSystemConfigurationEditSchema,
  });

  const onlyNumbers = (e: any) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <>
      {isPage ? (
        /** full page systemConfiguration */
        <div>
          <Segment raised>
            <Form
              id={'systemConfigurations-edit-form'}
              loading={
                isSystemConfigurationEditLoading || isSystemConfigurationLoading
              }
            >
              <InputWithLabel
                placeholder={'Value'}
                label={'Value'}
                formik={formikSystemConfigurationEdit}
                name={'valueLabel'}
                type={'text'}
                optionsDropdown={optionsReminderInput}
                defaultValue={
                  initialFormat.valueFormat || (LearningUnitEnum.DAYS as any)
                }
                dropdownName={'value'}
                onKeyPress={onlyNumbers}
              />
              <Input
                placeholder={'Description'}
                label={'Description'}
                formik={formikSystemConfigurationEdit}
                name={'description'}
                type={'text'}
                disabled
              />
            </Form>
            <Divider hidden />
            <Grid>
              <Grid.Column width={3} floated="left">
                <Button
                  fluid
                  primary
                  size={'large'}
                  type={'submit'}
                  form={'systemConfigurations-edit-form'}
                  onClick={formikSystemConfigurationEdit.handleSubmit as any}
                  disabled={isSystemConfigurationEditLoading}
                >
                  Save
                </Button>
              </Grid.Column>
            </Grid>
          </Segment>
        </div>
      ) : (
        /** modal systemConfiguration */
        <Modal onClose={closePress} open={isOpen} size="small">
          <Modal.Header>
            <Header as={'h4'} color="teal">
              <Icon name={'pencil'} circular />
              <Header.Content>
                System Configuration
                <Header.Subheader>
                  {renderHyphen(formikSystemConfigurationEdit?.values?.name)}
                </Header.Subheader>
              </Header.Content>
            </Header>
          </Modal.Header>
          <Modal.Content>
            <Form
              id={'systemConfigurations-edit-form'}
              loading={
                isSystemConfigurationEditLoading || isSystemConfigurationLoading
              }
            >
              {isInputUnit ? (
                <InputWithLabel
                  placeholder={'Value'}
                  label={'Value'}
                  formik={formikSystemConfigurationEdit}
                  name={'valueLabel'}
                  type={'text'}
                  optionsDropdown={optionsReminderInput}
                  defaultValue={
                    initialFormat.valueFormat || (LearningUnitEnum.DAYS as any)
                  }
                  dropdownName={'value'}
                  onKeyPress={onlyNumbers}
                />
              ) : (
                <Input
                  placeholder={'Value'}
                  label={'Value'}
                  formik={formikSystemConfigurationEdit}
                  name={'value'}
                  type={'text'}
                />
              )}
              <Input
                placeholder={'Description'}
                label={'Description'}
                formik={formikSystemConfigurationEdit}
                name={'description'}
                type={'text'}
                disabled
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Grid columns="equal">
              <Grid.Column>
                <Button
                  size={'large'}
                  fluid
                  onClick={closePress}
                  disabled={isSystemConfigurationEditLoading}
                >
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
                  disabled={isSystemConfigurationEditLoading}
                >
                  <Icon name={'save'} />
                  Save
                </Button>
              </Grid.Column>
            </Grid>
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
};

export default ModalSystemConfigurationEdit;
