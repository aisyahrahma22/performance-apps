import {
  Button,
  Divider,
  Form,
  Grid,
  Header,
  Icon,
  Label,
  Message,
  Modal,
  Segment,
} from 'semantic-ui-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isEmpty, isString } from 'lodash';
import * as yup from 'yup';
import { useFormik } from 'formik';
import ModalContentPlaceholder from '../placeholder/ModalContentPlaceholder';
import ModalHeaderPlaceholder from '../placeholder/ModalHeaderPlaceholder';
import Snippet from '../Snippet';
import { getPositions } from '../../lib/data/position/usePositions';
import InputDropdownRemote from '../InputDropdownRemote';
import getGuid from '../../lib/util/getGuid';
import useDataAccessMapping from '../../lib/data/dataAccessMapping/useDataAccessMapping';
import useDataAccessMappingEdit from '../../lib/data/dataAccessMapping/useDataAccessMappingEdit';

interface ModalDataAccessMappingEditProps {
  id: string;
  isOpen: boolean;
  closePress: any;
  openPress?: any;
}

const formDataAccessMappingEditSchema = yup.object({
  accesses: yup.array().of(
    yup.object({
      accessPosition: yup.object({
        id: yup.string().required('Access Position is required'),
      }),
    }),
  ),
});

const ModalDataAccessMappingEdit = ({
  id,
  isOpen,
  closePress,
}: ModalDataAccessMappingEditProps) => {
  const [accesses, setAccesses] = useState<any>([]);
  const { dataAccessMapping, isDataAccessMappingLoading } =
    useDataAccessMapping(id);
  const { dataAccessMappingEdit, isDataAccessMappingEditLoading } =
    useDataAccessMappingEdit({
      onSuccess: closePress,
    });

  useEffect(() => {
    setAccesses(dataAccessMapping?.dataAccessMapping);
  }, [dataAccessMapping]);

  const initialDataAccessMapping = useMemo<any>(
    () => ({
      accesses: dataAccessMapping?.dataAccessMapping,
    }),
    [dataAccessMapping],
  );

  const formikDataAccessMapping = useFormik({
    initialValues: initialDataAccessMapping,
    onSubmit: (values) => {
      dataAccessMappingEdit({
        id,
        dataAccessMapping: values.accesses,
      });
    },
    validationSchema: formDataAccessMappingEditSchema,
    enableReinitialize: true,
  });

  const addAccess = useCallback(() => {
    const newValues = [...formikDataAccessMapping.values.accesses];
    newValues.push({});
    formikDataAccessMapping.setValues({ accesses: newValues });

    setAccesses((access: any[]) => {
      const newValues = [...access];
      newValues.push({
        id: getGuid(),
      });
      return newValues;
    });
  }, [formikDataAccessMapping]);

  const removeAccess = useCallback(
    (idx) => () => {
      const newValues = [...formikDataAccessMapping.values.accesses];
      newValues.splice(idx, 1);
      formikDataAccessMapping.setValues({ accesses: newValues });

      setAccesses((access: any[]) => {
        const newValues = [...access];
        newValues.splice(idx, 1);
        return newValues;
      });
    },
    [formikDataAccessMapping],
  );

  return (
    <Modal open={isOpen} size="small">
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
        ) : (
          <>
            <Form
              id={'fsp-access-edit-form'}
              loading={
                isDataAccessMappingLoading || isDataAccessMappingEditLoading
              }
            >
              <Segment key={`access`}>
                <Segment clearing basic className={'nopadding'}>
                  <Header color={'teal'} floated={'left'}>
                    Eligible To See
                  </Header>
                </Segment>
                <Divider hidden />
                <Grid>
                  {accesses?.map(({ id, ...access }: any, accessIdx: any) => {
                    return (
                      <Grid.Row key={`access-${id}`} className={'nopaddingt'}>
                        <Grid.Column width={14}>
                          <InputDropdownRemote
                            placeholder={`Position ${accessIdx + 1}`}
                            label={`Position ${accessIdx + 1}`}
                            name={`accesses[${accessIdx}].accessPosition.id`}
                            formik={formikDataAccessMapping}
                            initialOptions={
                              !isEmpty(access)
                                ? [
                                    {
                                      key: access.accessPosition?.id,
                                      value: access.accessPosition?.id,
                                      text: access.accessPosition?.name,
                                    },
                                  ]
                                : []
                            }
                            apiFilter={{ isActive: true, flag: '2' }}
                            apiFetcher={getPositions}
                            apiSearchKeys={['name']}
                            apiTextKey={'name'}
                            apiValueKey={'id'}
                          />
                        </Grid.Column>
                        <Grid.Column width={2} textAlign={'right'}>
                          <Form.Field>
                            <label>&nbsp;</label>
                            <Button.Group icon basic color={'red'}>
                              <Button
                                onClick={removeAccess(accessIdx)}
                                icon={'trash'}
                              />
                            </Button.Group>
                          </Form.Field>
                        </Grid.Column>
                      </Grid.Row>
                    );
                  })}
                </Grid>
                <Segment clearing basic className={'nopaddingh nopaddingb'}>
                  <Button
                    basic
                    circular
                    color={'teal'}
                    onClick={addAccess}
                    fluid
                  >
                    <Icon name={'plus'} />
                    Add New Access
                  </Button>
                </Segment>
                {isString(formikDataAccessMapping.errors.accesses) && (
                  <Message negative size={'tiny'}>
                    <p>{formikDataAccessMapping.errors.accesses}</p>
                  </Message>
                )}
              </Segment>
            </Form>
          </>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Grid columns="equal">
          <Grid.Column>
            <Button onClick={closePress} fluid type={'button'} size={'large'}>
              <Icon name={'close'} />
              Close
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button
              size={'large'}
              primary
              fluid
              onClick={formikDataAccessMapping.handleSubmit as any}
              form={'fsp-access-edit-form'}
              type={'submit'}
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

export default ModalDataAccessMappingEdit;
