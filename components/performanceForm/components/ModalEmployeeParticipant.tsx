import {
  Button,
  Grid,
  Header,
  Modal,
  Segment,
  Form,
  Icon,
  Message,
} from 'semantic-ui-react';
import React, { useCallback, useMemo, useState } from 'react';
import Snippet from '../../Snippet';
import TableEmployeeParticipant from './TableEmployeeParticipants';
import InputDropdownRemote from '../../InputDropdownRemote';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { isString } from 'lodash';
import usePerformEmpAdd from '../../../lib/data/performanceForm/usePerformEmpAdd';
import { PerfFormStatusEnum } from '../../../lib/enums/PerfForm';
import { getEmployees } from '../../../lib/data/employee/useEmployees';

interface ModalEmployeeParticipantProps {
  id: string;
  code: string;
  status: string;
  isOpen: boolean;
  closePress: any;
}

const formAdditionSchema = yup.object({
  participants: yup
    .array()
    .of(yup.string().required('New Participant is required')),
});

const ModalEmployeeParticipant = ({
  id,
  code,
  status,
  isOpen,
  closePress,
}: ModalEmployeeParticipantProps) => {
  const { performEmpAddPosting, isPerformEmpAddPostingLoading } =
    usePerformEmpAdd({
      // onSuccess: closePress,
    });
  const formikAddParticipant = useFormik({
    initialValues: {
      participants: [] as any,
    },
    onSubmit: (values: any) => {
      performEmpAddPosting({ ...values, formId: id });
    },
    validationSchema: formAdditionSchema,
    enableReinitialize: true,
  });
  const isPublished = useMemo(
    () => status == PerfFormStatusEnum.PUBLISHED,
    [status],
  );

  return (
    <Modal onClose={closePress} open={isOpen} size="large">
      <Modal.Header>
        <Snippet
          title={'EMPLOYEE PARTICIPANT'}
          color={'teal'}
          description={code}
        />
      </Modal.Header>
      <Modal.Content scrolling>
        <TableEmployeeParticipant id={id} isEmployeeParticipant={true} />
        {isPublished && (
          <AddEmployeeParticipants
            formikAddParticipant={formikAddParticipant}
          />
        )}
      </Modal.Content>
      <Modal.Actions>
        <Grid columns="equal">
          <Grid.Column>
            <Button size={'large'} fluid onClick={closePress}>
              Close
            </Button>
          </Grid.Column>
          {isPublished && (
            <Grid.Column>
              <Button
                size={'large'}
                type="submit"
                fluid
                onClick={formikAddParticipant.handleSubmit as any}
                color="purple"
                disabled={isPerformEmpAddPostingLoading}
              >
                Save New Participant
              </Button>
            </Grid.Column>
          )}
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

const AddEmployeeParticipants = ({ formikAddParticipant }: any) => {
  const [participants, setParticipants] = useState<any>([]);
  const [hide, setHide] = useState(false);

  const addParticipant = useCallback(() => {
    const newValues = [...formikAddParticipant.values.participants];
    newValues.push('');
    formikAddParticipant.setFieldValue('participants', newValues);
    const workflow = (workflows: any[]) => {
      const newWorkflows = [...workflows];
      newWorkflows.push({});
      return newWorkflows;
    };
    setParticipants(workflow);
  }, [formikAddParticipant]);

  const removeParticipant = useCallback(
    (idx) => () => {
      const newValues = [...formikAddParticipant.values.participants];
      newValues.splice(idx, 1);
      formikAddParticipant.setFieldValue('participants', newValues);

      const workflow = (workflows: any[]) => {
        const newWorkflows = [...workflows];
        newWorkflows.splice(idx, 1);
        return newWorkflows;
      };
      setParticipants(workflow);
    },
    [formikAddParticipant],
  );

  return (
    <Segment>
      <Segment clearing basic className={'nopadding'}>
        <Header color={'teal'} floated={'left'}>
          Add Participant
        </Header>
        <Button.Group icon basic floated="right" size="tiny">
          <Button
            icon={!hide ? 'angle down' : 'angle up'}
            onClick={() => setHide(!hide)}
          />
        </Button.Group>
      </Segment>
      {!hide && (
        <>
          <Grid>
            {participants.map((_participant: any, idx: any) => (
              <Grid.Row key={`participant-${idx}`}>
                <Grid.Column width={15}>
                  <Form>
                    <InputDropdownRemote
                      placeholder={'Employee'}
                      label={`Employee ${idx + 1}`}
                      name={`participants[${idx}]`}
                      formik={formikAddParticipant}
                      apiFilter={{
                        isActive: true,
                      }}
                      apiFetcher={getEmployees}
                      apiSearchKeys={['codeName']}
                      apiTextKey={['code', 'fullName']}
                      apiValueKey={'id'}
                    />
                  </Form>
                </Grid.Column>
                <Grid.Column
                  width={1}
                  textAlign={'right'}
                  verticalAlign="bottom"
                >
                  <Button.Group icon basic color={'red'}>
                    <Button onClick={removeParticipant(idx)} icon={'trash'} />
                  </Button.Group>
                </Grid.Column>
              </Grid.Row>
            ))}
          </Grid>
          <Segment clearing basic className={'nopaddingh nopaddingb'}>
            <Button
              basic
              circular
              color={'teal'}
              onClick={addParticipant}
              fluid
            >
              <Icon name={'plus'} />
              Add New Participant
            </Button>
          </Segment>
          {isString(formikAddParticipant.errors['participants']) && (
            <Message negative size={'tiny'}>
              <p>{formikAddParticipant.errors['participants']}</p>
            </Message>
          )}
        </>
      )}
    </Segment>
  );
};

export default ModalEmployeeParticipant;
