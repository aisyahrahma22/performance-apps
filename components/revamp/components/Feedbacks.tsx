import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Avatar from 'react-avatar';
import { Button, Comment, Form, Label } from 'semantic-ui-react';
import Inputs from './Inputs';
import { ButtonColorEnum } from '../enum/ButtonColorsEnum';
import renderHyphen from '../../../lib/util/renderHyphen';
import { IDPNote } from '../../idp/dto/IDPListData.dto';
import { last, remove, set } from 'lodash';
import { IDPWorkflowTypeEnum } from '../../../lib/enums/IDP';
import { useFormik } from 'formik';
import getGuid from '../../../lib/util/getGuid';
import useIDPFeedbackApprover from '../../../lib/data/IDPApproval/revamp/useFeedbackApprover';
import useIDPDeleteFeedbackApprover from '../../../lib/data/IDPApproval/revamp/useDeleteFeedbackApprover';
import { toast } from 'react-toastify';
import TextAreaHistory from '../../TextAreaHistory';

interface FeedbacksProps {
  onClickDelete?: () => void;
  onClickEdit?: () => void;
  allData: IDPNote[];
  isApproval?: boolean;
  currentEmployee?: any;
  idpItemId?: string;
  type?: IDPWorkflowTypeEnum;
  level?: string;
  modify?: any;
}

const Feedbacks = ({
  isApproval = false,
  allData,
  currentEmployee,
  idpItemId,
  type,
  level,
  modify,
}: FeedbacksProps) => {
  const [isEditPress, setIsEditPress] = useState(false);
  const [isExistApprover, setIsExistApprover] = useState(false);

  const initialValues = useMemo(() => {
    return {
      id: getGuid(),
      idpItemId: idpItemId,
      notes: '',
      type: type,
      level,
    };
  }, [allData, idpItemId, type, level]);

  const { IDPFeedbackApproverCreatePosting } = useIDPFeedbackApprover({
    onSuccess: () => null,
  });

  const { IDPFeedbackApproverDeletePosting } = useIDPDeleteFeedbackApprover({
    onSuccess: () => null,
  });

  const formikFeedback = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      IDPFeedbackApproverCreatePosting(values);
    },
  });

  const reset = useCallback(() => {
    formikFeedback.resetForm();
  }, [formikFeedback]);

  // const currentApproverFeedback = useMemo(() => {
  //   if (isApproval) {
  //     return filter(
  //       allData,
  //       (v: any) => v?.type == IDPWorkflowTypeEnum.IDP_WORKFLOW_APPROVER,
  //     );
  //   } else {
  //     return [];
  //   }
  // }, [allData, formikFeedback]);

  const allApproverFeedback = useMemo(() => {
    return allData;
  }, [allData]);

  const renderApproverType = (type: string, level?: string | number) => {
    switch (type) {
      case IDPWorkflowTypeEnum.IDP_WORKFLOW_APPROVER:
        return 'Approver Level ' + renderHyphen(level);

      case IDPWorkflowTypeEnum.IDP_WORKFLOW_CHECKER:
        return 'Verificator';

      case IDPWorkflowTypeEnum.IDP_WORKFLOW_READER:
        return 'Reader';

      default:
        return '-';
    }
  };

  const addFeedbackToList = useCallback(() => {
    const currentFeedback = {
      ...formikFeedback?.values,
      approver: {
        id: currentEmployee?.id,
        fullName: currentEmployee?.fullName,
        profilePath: currentEmployee?.profilePath,
      },
    };
    const currentIndex = allData?.length;
    setIsExistApprover(true);
    set(allData, currentIndex, currentFeedback);
    reset();
  }, [formikFeedback, isApproval]);

  useEffect(() => {
    const findVal = allData?.find((val) => val?.type == type);
    if (findVal?.id) setIsExistApprover(true);
    else setIsExistApprover(false);
  }, [allData, type, isExistApprover]);

  const submit = useCallback(() => {
    setIsExistApprover(true);
    IDPFeedbackApproverCreatePosting(formikFeedback?.values)
      .then(() => {
        setIsEditPress(false);
        addFeedbackToList();
      })
      .catch((e) =>
        toast.error(`${e.response?.data?.message || e}`, {
          position: 'bottom-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        }),
      );
  }, [formikFeedback?.values, isExistApprover]);

  const handleEditPress = useCallback(
    (feedback: IDPNote) => {
      setIsExistApprover(false);
      setIsEditPress(true);
      remove(allData, (feeds) => feeds?.id == feedback?.id);
      formikFeedback?.setFieldValue('notes', feedback?.notes);
      formikFeedback?.setFieldValue('id', feedback?.id);
    },
    [formikFeedback, allData, isExistApprover],
  );

  const resetEdit = useCallback(() => {
    setIsExistApprover(true);
    setIsEditPress(false);
    addFeedbackToList();
  }, [formikFeedback, isEditPress, isExistApprover]);

  const deletes = useCallback(
    (id: string) => {
      IDPFeedbackApproverDeletePosting(id)
        .then(() => {
          remove(allData, (feeds) => feeds?.id == id);
          setIsExistApprover(false);
        })
        .catch((e) =>
          toast.error(`${e.response?.data?.message || e}`, {
            position: 'bottom-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          }),
        );
    },
    [formikFeedback, isExistApprover],
  );

  return (
    <>
      <Comment.Group threaded style={{ marginLeft: '8px' }}>
        {allApproverFeedback && allApproverFeedback?.length > 0
          ? allApproverFeedback?.map((feedback, index: number) => (
              <div
                className="ui comments"
                key={index}
                style={{ marginRight: '0.3em' }}
              >
                <div className="comment">
                  <div className="avatar">
                    <Avatar
                      className={'avatar'}
                      round
                      name={feedback?.approver?.fullName || ''}
                      size={'32'}
                      src={
                        feedback?.approver?.profilePath
                          ? `/api/employee/profile/download/${last(
                              feedback?.approver?.profilePath.split('/'),
                            )}`
                          : ''
                      }
                      style={{ marginRight: '16px' }}
                    />
                  </div>
                  <div className="content">
                    <div className="rvflexs row space-between center">
                      <div className="rvflexs row start center">
                        <span className="rvtexts semibold text-m rvcolors color-gray-900">
                          {renderHyphen(feedback?.approver?.fullName)}
                        </span>
                        <Label style={{ marginLeft: '4px' }}>
                          <span className="rvtexts semibold text-xs rvcolors color-gray-700">
                            {renderApproverType(
                              feedback?.type,
                              feedback?.level,
                            )}
                          </span>
                        </Label>
                      </div>
                      {isApproval && feedback?.type == type && modify && (
                        <div className="">
                          <span
                            className="rvtexts semibold text-xs rvcolors color-gray-500"
                            style={{ cursor: 'pointer', marginRight: '8px' }}
                            onClick={() => handleEditPress(feedback)}
                          >
                            Edit
                          </span>
                          <span
                            className="rvtexts semibold text-xs rvcolors color-gray-500"
                            style={{ cursor: 'pointer' }}
                            onClick={() => deletes(feedback?.id)}
                          >
                            Delete
                          </span>
                        </div>
                      )}
                    </div>
                    <span
                      className="rvtexts regular text-s rvcolors color-gray-800"
                      style={{ marginTop: '8px' }}
                    >
                      <Form style={{ marginTop: '6px' }}>
                        <TextAreaHistory
                          isTextAreaAutoHigh
                          rows={1}
                          value={renderHyphen(feedback?.notes)}
                          noStyle
                        />
                      </Form>
                    </span>
                  </div>
                </div>
              </div>
            ))
          : ''}
        {isExistApprover || (!level && !type) ? (
          ''
        ) : (
          <div className="ui comments" style={{ marginRight: '0.3em' }}>
            <div className="comment">
              <div className="avatar">
                <Avatar
                  className={'avatar'}
                  round
                  name={currentEmployee?.fullName || ''}
                  size={'32'}
                  src={
                    currentEmployee?.profilePath
                      ? `/api/employee/profile/download/${last(
                          currentEmployee?.profilePath.split('/'),
                        )}`
                      : ''
                  }
                  style={{ marginRight: '16px' }}
                />
              </div>
              <div className="content">
                <Form>
                  <div className="rvflexs row space-between center">
                    <span
                      className="rvtexts semibold text-m rvcolors color-gray-900"
                      style={{ marginTop: '10px' }}
                    >
                      {renderHyphen(currentEmployee?.fullName)}
                    </span>
                  </div>
                  <span className="rvtexts regular text-xs rvcolors color-gray-900">
                    <Inputs
                      placeholder="Add feedback notes"
                      name="notes"
                      formik={formikFeedback}
                      textarea
                      isTextAreaAutoHigh
                      style={{ width: '100%' }}
                    />
                  </span>
                  <div
                    className="rvflexs row start center"
                    style={{ marginTop: '4px' }}
                  >
                    <Button
                      className={ButtonColorEnum.DEFAULT}
                      onClick={submit}
                    >
                      <span className="rvtexts regular text-xs rvcolors color-gray-25">
                        Save
                      </span>
                    </Button>
                    <Button
                      className={ButtonColorEnum.GHOSTED}
                      onClick={isEditPress ? resetEdit : reset}
                    >
                      <span className="rvtexts regular text-xs rvcolors color-gray-800">
                        Cancel
                      </span>
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        )}
      </Comment.Group>

      {/* {checkIsApproval && (
        <Comment.Group threaded style={{ marginLeft: '8px' }}>
          {currentApproverFeedback && currentApproverFeedback?.length > 0 ? (
            currentApproverFeedback?.map((feedback, index: number) => (
              <div
                className="ui comments"
                key={index}
                style={{ marginRight: '0.3em' }}
              >
                <div className="comment">
                  <div className="avatar">
                    <Avatar
                      className={'avatar'}
                      round
                      name={feedback?.approver?.fullName || ''}
                      size={'32'}
                      src={
                        feedback?.approver?.profilePath
                          ? `/api/employee/profile/download/${last(
                              feedback?.approver?.profilePath.split('/'),
                            )}`
                          : ''
                      }
                      style={{ marginRight: '16px' }}
                    />
                  </div>
                  <div className="content">
                    <div className="rvflexs row space-between center">
                      <div className="rvflexs row start center">
                        <span className="rvtexts semibold text-m rvcolors color-gray-900">
                          {renderHyphen(feedback?.approver?.fullName)}
                        </span>
                        <Label style={{ marginLeft: '4px' }}>
                          <span className="rvtexts semibold text-xs rvcolors color-gray-700">
                            {renderApproverType(
                              feedback?.type,
                              feedback?.level,
                            )}
                          </span>
                        </Label>
                      </div>
                      {isApproval && feedback?.type == type && modify && (
                        <div className="">
                          <span
                            className="rvtexts semibold text-xs rvcolors color-gray-500"
                            style={{ cursor: 'pointer', marginRight: '8px' }}
                            onClick={() => handleEditPress(feedback)}
                          >
                            Edit
                          </span>
                          <span
                            className="rvtexts semibold text-xs rvcolors color-gray-500"
                            style={{ cursor: 'pointer' }}
                            onClick={() => deletes(feedback?.id)}
                          >
                            Delete
                          </span>
                        </div>
                      )}
                    </div>
                    <span
                      className="rvtexts regular text-s rvcolors color-gray-800"
                      style={{ marginTop: '8px' }}
                    >
                      {renderHyphen(feedback?.notes)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="ui comments" style={{ marginRight: '0.3em' }}>
              <div className="comment">
                <div className="avatar">
                  <Avatar
                    className={'avatar'}
                    round
                    name={currentEmployee?.fullName || ''}
                    size={'32'}
                    src={
                      currentEmployee?.profilePath
                        ? `/api/employee/profile/download/${last(
                            currentEmployee?.profilePath.split('/'),
                          )}`
                        : ''
                    }
                    style={{ marginRight: '16px' }}
                  />
                </div>
                <div className="content">
                  <Inputs
                    placeholder="Add feedback notes"
                    name="notes"
                    formik={formikFeedback}
                    textarea
                    style={{ width: '100%' }}
                  />
                  <div
                    className="rvflexs row start center"
                    style={{ marginTop: '4px' }}
                  >
                    <Button
                      className={ButtonColorEnum.DEFAULT}
                      onClick={submit}
                    >
                      <span className="rvtexts regular text-xs rvcolors color-gray-25">
                        Save
                      </span>
                    </Button>
                    <Button
                      className={ButtonColorEnum.GHOSTED}
                      onClick={isEditPress ? resetEdit : reset}
                    >
                      <span className="rvtexts regular text-xs rvcolors color-gray-800">
                        Cancel
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Comment.Group>
      )} */}
    </>
  );
};

export default Feedbacks;
