import { FormikProps } from 'formik';
import React, { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

import Table from 'semantic-ui-react/dist/commonjs/collections/Table/Table';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form/Form';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header/Header';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';
import Segment from 'semantic-ui-react/dist/commonjs/elements/Segment/Segment';

import {
  PerfEmpItem,
  PerfEmpItemPerKPI,
  PerfEmployee,
} from '../types/goalSettingTypes';
import DropdownOptions from '../../../lib/types/DropdownOptions';

import cloneDeep from 'lodash/cloneDeep';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid/Grid';
import TotalWeightPerCategory from './TotalWeightPerCategory';
import { get } from 'lodash';
import { PerfLevelEnum } from '../../../lib/data/perfMidYear/enum/perfForm.enum';
import { Popup } from 'semantic-ui-react';

const InputField = dynamic(() => import('../../Input'));

interface CategorySectionProps {
  onViewDetail: boolean;
  formik: FormikProps<PerfEmployee>;
  perfEmpItemTypeId: string;
  perfEmpItemTypeIdx: number;
  perfEmpItemIdx: number;
  perfEmpItemObj: PerfEmpItem;
  isDataPerfTypeHasKRA?: (perfEmpItemTypeIdx: number) => boolean;
  isDataPerfTypeHasTarget?: (perfEmpItemTypeIdx: number) => boolean;
  isDataPerfTypeHasCategoryWeightCalc?: (perfEmpItemTypeIdx: number) => boolean;
  level: PerfLevelEnum;
}

export default function CategorySection({
  onViewDetail,
  formik,
  perfEmpItemTypeId,
  perfEmpItemTypeIdx,
  perfEmpItemObj,
  isDataPerfTypeHasKRA,
  isDataPerfTypeHasTarget,
  isDataPerfTypeHasCategoryWeightCalc,
  level,
}: CategorySectionProps) {
  const categoryType = useMemo(
    () => perfEmpItemObj?.perfFormTypeItem?.type,
    [perfEmpItemObj?.perfFormTypeItem?.type],
  );

  const isCategoryPredefine = useCallback(
    (sectionType) => {
      if (sectionType === 'kra')
        return !perfEmpItemObj?.perfFormTypeKRA?.isUserDefine;
      if (sectionType === 'kpi')
        return !perfEmpItemObj?.perfFormTypeKPI?.isUserDefine;
      if (sectionType === 'target')
        return !perfEmpItemObj?.perfFormTypeTarget?.isUserDefine;
      return false;
    },
    [
      perfEmpItemObj?.perfFormTypeKPI?.isUserDefine,
      perfEmpItemObj?.perfFormTypeKRA?.isUserDefine,
      perfEmpItemObj?.perfFormTypeTarget?.isUserDefine,
    ],
  );

  const isCategorySelection = useCallback(
    (sectionType) => {
      if (sectionType === 'kra')
        return perfEmpItemObj?.perfFormTypeKRA?.isSelection;
      if (sectionType === 'kpi')
        return perfEmpItemObj?.perfFormTypeKPI?.isSelection;
      return false;
    },
    [
      perfEmpItemObj?.perfFormTypeKPI?.isSelection,
      perfEmpItemObj?.perfFormTypeKRA?.isSelection,
    ],
  );

  const isCategoryEditable = useCallback(
    (sectionType) => {
      if (sectionType === 'kra')
        return perfEmpItemObj?.perfFormTypeKRA?.isEditable;
      if (sectionType === 'kpi')
        return perfEmpItemObj?.perfFormTypeKPI?.isEditable;
      if (sectionType === 'target')
        return perfEmpItemObj?.perfFormTypeTarget?.isEditable;
      return false;
    },
    [
      perfEmpItemObj?.perfFormTypeKPI?.isEditable,
      perfEmpItemObj?.perfFormTypeKRA?.isEditable,
      perfEmpItemObj?.perfFormTypeTarget?.isEditable,
    ],
  );

  const isCategoryPredefineAndSelection = useCallback(
    (sectionType) => {
      if (sectionType === 'kra')
        return (
          !perfEmpItemObj?.perfFormTypeKRA?.isUserDefine &&
          perfEmpItemObj?.perfFormTypeKRA?.isSelection
        );
      if (sectionType === 'kpi')
        return (
          !perfEmpItemObj?.perfFormTypeKPI?.isUserDefine &&
          perfEmpItemObj?.perfFormTypeKPI?.isSelection
        );
      return false;
    },
    [
      perfEmpItemObj?.perfFormTypeKPI?.isSelection,
      perfEmpItemObj?.perfFormTypeKPI?.isUserDefine,
      perfEmpItemObj?.perfFormTypeKRA?.isSelection,
      perfEmpItemObj?.perfFormTypeKRA?.isUserDefine,
    ],
  );

  const isCategoryHasKRA = useMemo(
    () => isDataPerfTypeHasKRA?.(perfEmpItemTypeIdx),
    [isDataPerfTypeHasKRA, perfEmpItemTypeIdx],
  );

  const isCategoryHasTarget = useMemo(
    () => isDataPerfTypeHasTarget?.(perfEmpItemTypeIdx),
    [isDataPerfTypeHasTarget, perfEmpItemTypeIdx],
  );

  const isDataKRADetailsAvailable = useMemo(
    () => perfEmpItemObj?.perfFormTypeKRA?.dataKRADetails?.length > 0,
    [perfEmpItemObj?.perfFormTypeKRA?.dataKRADetails?.length],
  );

  /**
   * Deprecated!
   * Will use if necessary
   * */
  // const isDataTargetDetailsAvailable = useMemo(
  //   () => perfEmpItemObj?.perfFormTypeTarget?.dataTargetDetails?.length > 0,
  //   [perfEmpItemObj?.perfFormTypeTarget?.dataTargetDetails?.length],
  // );

  const perfKRAList = useMemo(() => {
    const resArr: DropdownOptions[] = [];
    const currentDataKRA = isCategoryHasKRA
      ? isDataKRADetailsAvailable
        ? perfEmpItemObj?.perfFormTypeKRA?.dataKRADetails
        : perfEmpItemObj?.perfFormTypeKPI?.dataKPIDetails
      : [];
    currentDataKRA?.filter((item) => {
      const selectedPerfKPIIdx = resArr?.findIndex(
        (elem) => elem?.key === item?.performanceKRA?.id,
      );

      if (selectedPerfKPIIdx <= -1) {
        resArr.push({
          key: item?.performanceKRA?.id,
          text: item?.performanceKRA?.name,
          value: item?.performanceKRA?.id,
        });
      }

      return null;
    });

    return resArr;
  }, [
    isCategoryHasKRA,
    isDataKRADetailsAvailable,
    perfEmpItemObj?.perfFormTypeKPI?.dataKPIDetails,
    perfEmpItemObj?.perfFormTypeKRA?.dataKRADetails,
  ]);

  const perfKPIList = useMemo(() => {
    const resArr: DropdownOptions[] = [];
    perfEmpItemObj?.perfFormTypeKPI?.dataKPIDetails?.filter((item) => {
      resArr.push({
        key: item?.id,
        text: item?.performanceKPI?.name,
        value: item?.performanceKPI?.id,
      });
    });

    return resArr;
  }, [perfEmpItemObj?.perfFormTypeKPI?.dataKPIDetails]);

  const isCategoryHasCategoryWeightCalc = useMemo(
    () => isDataPerfTypeHasCategoryWeightCalc?.(perfEmpItemTypeIdx),
    [isDataPerfTypeHasCategoryWeightCalc, perfEmpItemTypeIdx],
  );

  const dataKPIMaxCount = useMemo(
    () => perfEmpItemObj?.perfFormTypeKPI?.maxKPICountInput,
    [perfEmpItemObj?.perfFormTypeKPI?.maxKPICountInput],
  );

  const dataKPIMinCount = useMemo(
    () => perfEmpItemObj?.perfFormTypeKPI?.minKPICountInput,
    [perfEmpItemObj?.perfFormTypeKPI?.minKPICountInput],
  );

  const dataKPIType = useMemo(
    () => perfEmpItemObj?.perfFormTypeKPI?.typeMaxKPICount,
    [perfEmpItemObj?.perfFormTypeKPI?.typeMaxKPICount],
  );

  const totalGoalSettingItem =
    formik.values.itemsPerKPIs[perfEmpItemObj.id]?.length || 0;

  function populateGoalSettingKPIDesc() {
    if (
      perfEmpItemObj?.perfEmpItemPerKPI?.length > 0 &&
      (isCategoryPredefineAndSelection('kpi') || isCategorySelection('kpi'))
    ) {
      return Array<boolean>(perfEmpItemObj?.perfEmpItemPerKPI?.length).fill(
        false,
      );
    }

    if (isCategoryPredefineAndSelection('kpi')) {
      const initialArr: boolean[] = [];
      perfEmpItemObj?.perfFormTypeKPI?.dataKPIDetails?.forEach(
        (currentValue) => currentValue?.isPredefine && initialArr.push(false),
      );

      return initialArr;
    }

    return [] as boolean[];
  }

  const [arrKPIDisplayDesc, setArrKPIDisplayDesc] = useState<boolean[]>(
    populateGoalSettingKPIDesc(),
  );

  function addNewGoalSettingContentRow(idx: number) {
    if (
      dataKPIMaxCount !== null &&
      totalGoalSettingItem >= parseInt(dataKPIMaxCount.toString())
    )
      return;

    const goalSettingDefaultValue: PerfEmpItemPerKPI = {
      idx: idx,
      isKRASelection: perfEmpItemObj?.perfFormTypeKRA?.isSelection,
      isKPISelection: perfEmpItemObj?.perfFormTypeKPI?.isSelection,
      isPredefined: false,
      kra: '',
      kpi: '',
      target: '',
      perfEmpItemType: perfEmpItemTypeId,
      perfEmpItem: perfEmpItemObj.id,
      perfKRA: '',
      perfKPI: '',
      weight: 0,
      achievement: '',
      scores: [],
    };

    const clonedPerfEmpItemPerKPI = cloneDeep(formik.values.itemsPerKPIs);
    clonedPerfEmpItemPerKPI[perfEmpItemObj.id]
      ? clonedPerfEmpItemPerKPI[perfEmpItemObj.id].push(goalSettingDefaultValue)
      : (clonedPerfEmpItemPerKPI[perfEmpItemObj.id] = [
          goalSettingDefaultValue,
        ]);
    formik.setFieldValue(`itemsPerKPIs`, clonedPerfEmpItemPerKPI);
  }

  function removeSelectedGoalSettingContentRow(idx: number) {
    const clonedPerfEmpItemPerKPI = cloneDeep(formik.values.itemsPerKPIs);
    const clonedDeletedEmpItemPerKPI = cloneDeep(
      formik.values.deletedItemPerKPIs,
    );
    if (clonedPerfEmpItemPerKPI[perfEmpItemObj.id][idx]) {
      formik.setFieldValue(`deletedItemPerKPIs`, [
        ...clonedDeletedEmpItemPerKPI,
        clonedPerfEmpItemPerKPI[perfEmpItemObj.id][idx],
      ]);
      clonedPerfEmpItemPerKPI[perfEmpItemObj.id].splice(idx, 1);
    }
    formik.setFieldValue(`itemsPerKPIs`, clonedPerfEmpItemPerKPI);
  }

  // == selected kpi diplay desc manipulation function ==
  const addSelectedKPIDisplayDesc = (itemIdx: number) => {
    if (arrKPIDisplayDesc[itemIdx] !== undefined) return;
    setArrKPIDisplayDesc((prev) => [...prev, false]);
  };
  const changeSelectedKPIDisplayDesc = (itemIdx: number) => {
    const newArr: boolean[] = [];

    arrKPIDisplayDesc.map((value, idx) => {
      if (itemIdx === idx) return newArr.push(!value);
      else newArr.push(value);
    });

    setArrKPIDisplayDesc(newArr);
  };
  const removeSelectedKPIDiplayDesc = (itemIdx: number) => {
    const arrAfterRemoved = arrKPIDisplayDesc;
    arrAfterRemoved.splice(itemIdx, 1);
    setArrKPIDisplayDesc(arrAfterRemoved);
  };
  const getKPIDescription = (
    perfEmpItemObjId: string,
    goalSettingIdx: number,
  ) => {
    const valueFromFormik =
      formik.values.itemsPerKPIs[perfEmpItemObjId][
        goalSettingIdx
      ]?.perfKPI?.toString();

    return perfEmpItemObj?.perfFormTypeKPI?.dataKPIDetails?.find(
      (dataKPIDetails) =>
        dataKPIDetails?.performanceKPI?.id === valueFromFormik,
    )?.performanceKPI?.description;
  };
  const getKPIKeyAction = (
    perfEmpItemObjId: string,
    goalSettingIdx: number,
  ) => {
    const valueFromFormik =
      formik.values.itemsPerKPIs[perfEmpItemObjId][
        goalSettingIdx
      ]?.perfKPI?.toString();

    return perfEmpItemObj?.perfFormTypeKPI?.dataKPIDetails?.find(
      (dataKPIDetails) =>
        dataKPIDetails?.performanceKPI?.id === valueFromFormik,
    )?.performanceKPI?.keyAction;
  };
  const getKPIBehavior = (perfEmpItemObjId: string, goalSettingIdx: number) => {
    const valueFromFormik =
      formik.values.itemsPerKPIs[perfEmpItemObjId][
        goalSettingIdx
      ]?.perfKPI?.toString();

    return perfEmpItemObj?.perfFormTypeKPI?.dataKPIDetails?.find(
      (dataKPIDetails) =>
        dataKPIDetails?.performanceKPI?.id === valueFromFormik,
    )?.performanceKPI?.behaviour;
  };
  const [expand, setExpand] = useState(false);
  const handleExpandTextArea = () => setExpand(!expand);
  // == end of selected kpi diplay desc manipulation function ==

  // auto input kra, target, and weight if kra is selected
  const addCorrespondingDataOfKPI = (
    perfKPIId: any,
    goalSettingIdx: number,
  ) => {
    const selectedKPIKeyId = perfKPIList.find(
      (kpiList) => kpiList.value === perfKPIId,
    )?.key;

    const selectedPerfKRAObj =
      perfEmpItemObj?.perfFormTypeKPI?.dataKPIDetails?.find(
        (dataKPIDetails) => dataKPIDetails?.id === selectedKPIKeyId,
      )?.performanceKRA;

    const selectedPerfKPIWeight =
      perfEmpItemObj?.perfFormTypeKPI?.dataKPIDetails?.find(
        (dataKPIDetails) => dataKPIDetails?.id === selectedKPIKeyId,
      )?.weight;

    const selectedPerfTargetObj =
      perfEmpItemObj?.perfFormTypeTarget?.dataTargetDetails?.find(
        (dataTargetDetails) =>
          dataTargetDetails?.performanceKPI?.id === perfKPIId,
      )?.performanceTarget;

    if (isCategorySelection('kra'))
      formik.setFieldValue(
        `itemsPerKPIs[${perfEmpItemObj?.id}][${goalSettingIdx}].perfKRA`,
        selectedPerfKRAObj?.id,
      );
    else
      formik.setFieldValue(
        `itemsPerKPIs[${perfEmpItemObj?.id}][${goalSettingIdx}].kra`,
        selectedPerfKRAObj?.name,
      );

    formik.setFieldValue(
      `itemsPerKPIs[${perfEmpItemObj.id}][${goalSettingIdx}].target`,
      selectedPerfTargetObj?.name,
    );

    formik.setFieldValue(
      `itemsPerKPIs[${perfEmpItemObj.id}][${goalSettingIdx}].weight`,
      typeof selectedPerfKPIWeight === 'string'
        ? Number(selectedPerfKPIWeight)
        : selectedPerfKPIWeight,
    );
  };

  // show add goal setting button if condition is right
  const isDisplayAddGoalSettingButton = useMemo(
    () =>
      !onViewDetail
        ? !(
            isCategoryPredefine('kpi') &&
            !isCategorySelection('kpi') &&
            !isCategoryEditable('kpi')
          )
        : false,
    [
      isCategoryPredefine,
      isCategorySelection,
      onViewDetail,
      isCategoryEditable,
    ],
  );

  // show button remove kpi if it is satisfies the rules
  const isRowRemovable = useCallback(
    (goalSettingIdx: number) =>
      !formik.values.itemsPerKPIs[perfEmpItemObj.id]?.[goalSettingIdx]
        ?.isPredefined,
    [formik.values.itemsPerKPIs, perfEmpItemObj.id],
  );

  const errorMessages = useMemo(() => {
    const itemsKPI = get(formik.values, `itemsPerKPIs[${perfEmpItemObj?.id}]`);
    const errors = itemsKPI?.map((val: any) => {
      const keys = [];
      if (val?.kra?.length > 256)
        keys.push('KRA should be less than 256 characters');
      return keys;
    });
    return errors;
  }, [formik.values]);

  // const isAbsoluteScore = (scoreObj?: any): boolean => {
  //   return scoreObj?.isAbsoluteScore;
  // };

  const isAbsoluteScore = useCallback(
    (idx) => {
      switch (level) {
        case 'APPRAISEE':
          if (
            get(
              formik.values,
              `itemsPerKPIs[${perfEmpItemObj?.id}].${idx}.scores.endBySelf.isAbsoluteScore`,
            ) ||
            get(
              formik.values,
              `itemsPerKPIs[${perfEmpItemObj?.id}].${idx}.scores.midBySelf.isAbsoluteScore`,
            )
          )
            return true;
          else return false;
        case 'DIRECT_MANAGER':
          if (
            get(
              formik.values,
              `itemsPerKPIs[${perfEmpItemObj?.id}].${idx}.scores.endByDM.isAbsoluteScore`,
            ) ||
            get(
              formik.values,
              `itemsPerKPIs[${perfEmpItemObj?.id}].${idx}.scores.endByDM.isAbsoluteScore`,
            )
          )
            return true;
          else return false;
        case 'ABOVE_MANAGER':
          if (
            get(
              formik.values,
              `itemsPerKPIs[${perfEmpItemObj?.id}].${idx}.scores.endByAboveDM.isAbsoluteScore`,
            ) ||
            get(
              formik.values,
              `itemsPerKPIs[${perfEmpItemObj?.id}].${idx}.scores.endByAboveDM.isAbsoluteScore`,
            )
          )
            return true;
          else return false;
        default:
          false;
          break;
      }
    },
    [formik.values, perfEmpItemObj?.id],
  );

  return (
    <Segment>
      <Header as={'p'} color={'black'} floated={'left'} size="tiny">
        {categoryType === 'CATEGORY' &&
          perfEmpItemObj?.perfFormTypeItem?.perfCategory?.name}
      </Header>
      <Header as={'p'} floated={'right'} size="tiny">
        <div onClick={handleExpandTextArea} style={{ cursor: 'pointer' }}>
          {expand ? (
            <Icon size="large" color="green" name="expand" />
          ) : (
            <Icon size="large" name="compress" />
          )}
        </div>
      </Header>
      {isCategoryHasCategoryWeightCalc === true && (
        <Header floated={'right'} size="tiny">
          <p>
            Weight:&nbsp;{perfEmpItemObj?.perfFormTypeItem?.categoryWeight}%
          </p>
        </Header>
      )}
      <br />
      <div>
        <Table color={'blue'}>
          {/* The header of perf employee goal setting table */}
          <Table.Header>
            <Table.Row className="top aligned">
              {/* KRA header column */}
              {isCategoryHasKRA && (
                <Table.HeaderCell
                  singleLine
                  textAlign={'center'}
                  width={
                    isCategoryHasKRA && isCategoryHasTarget
                      ? 3
                      : isCategoryHasKRA || isCategoryHasTarget
                      ? 4
                      : 4
                  }
                  attribute={'kra'}
                  name={'KRA'}
                >
                  Key Responsibility Area (KRA)
                </Table.HeaderCell>
              )}
              {/* KPI header column */}
              <Table.HeaderCell
                singleLine
                textAlign={'center'}
                width={
                  isCategoryHasKRA && isCategoryHasTarget
                    ? 3
                    : isCategoryHasKRA || isCategoryHasTarget
                    ? 4
                    : 6
                }
                attribute={'kpi'}
                name={'KPI'}
              >
                Key Performance Indicator (KPI)
              </Table.HeaderCell>
              {/* Target header column */}
              {isCategoryHasTarget && (
                <Table.HeaderCell
                  singleLine
                  textAlign={'center'}
                  width={
                    isCategoryHasKRA && isCategoryHasTarget
                      ? 4
                      : isCategoryHasKRA || isCategoryHasTarget
                      ? 4
                      : 4
                  }
                  attribute={'target'}
                  name={'Target'}
                >
                  Target
                </Table.HeaderCell>
              )}
              {/* Achievement header column */}
              <Table.HeaderCell
                singleLine
                textAlign={'center'}
                width={
                  isCategoryHasKRA && isCategoryHasTarget
                    ? 4
                    : isCategoryHasKRA || isCategoryHasTarget
                    ? 4
                    : 6
                }
                attribute={'achievement'}
                name={'Achievement'}
              >
                Result & Achievement
              </Table.HeaderCell>
              {/* Weight header column */}
              <Table.HeaderCell
                singleLine
                textAlign={'center'}
                width={2}
                attribute={'weight'}
                name={'Weight'}
              >
                Weight(%)
              </Table.HeaderCell>
              {/* additional header column */}
              {!onViewDetail && (
                <Table.HeaderCell
                  singleLine
                  textAlign={'center'}
                  width={1}
                  attribute={'delete'}
                ></Table.HeaderCell>
              )}
            </Table.Row>
          </Table.Header>
          {/* The body/content of perf employe
           goal setting table */}
          <Table.Body>
            {Array(totalGoalSettingItem)
              .fill(0)
              .map((_, goalSettingIdx) => (
                <React.Fragment
                  key={`${perfEmpItemObj?.id}__${goalSettingIdx}`}
                >
                  <Table.Row
                    key={`${perfEmpItemObj?.id}-${perfEmpItemObj?.perfFormTypeKPI?.id}-${goalSettingIdx}`}
                    className="top aligned"
                  >
                    {/* KRA content column */}
                    {isCategoryHasKRA &&
                      (isAbsoluteScore(goalSettingIdx) ? (
                        <Popup
                          content="You cannot edit this field because score was generated using absolute score. Please connect with the Admin for further queries."
                          trigger={
                            <Table.Cell>
                              {isCategorySelection('kra') ? (
                                <Form>
                                  <InputField
                                    placeholder={
                                      isCategoryHasKRA ? 'Select KRA' : '-'
                                    }
                                    formik={formik}
                                    name={`itemsPerKPIs[${perfEmpItemObj?.id}][${goalSettingIdx}].perfKRA`}
                                    type="text"
                                    select
                                    options={perfKRAList}
                                    readOnly={
                                      !isCategoryEditable('kra') || onViewDetail
                                    }
                                    disabled={true}
                                  />
                                </Form>
                              ) : (
                                <Form>
                                  <InputField
                                    placeholder={
                                      isCategoryHasKRA ? 'Write your KRA' : '-'
                                    }
                                    formik={formik}
                                    name={`itemsPerKPIs[${perfEmpItemObj?.id}][${goalSettingIdx}].kra`}
                                    type="text"
                                    textarea
                                    isTextAreaAutoHigh={expand}
                                    readOnly={
                                      !isCategoryEditable('kra') || onViewDetail
                                    }
                                    disabled={true}
                                  />
                                  <p className="item-kra-error">
                                    {errorMessages}
                                  </p>
                                </Form>
                              )}
                            </Table.Cell>
                          }
                        />
                      ) : (
                        <Table.Cell>
                          {isCategorySelection('kra') ? (
                            <Form>
                              <InputField
                                placeholder={
                                  isCategoryHasKRA ? 'Select KRA' : '-'
                                }
                                formik={formik}
                                name={`itemsPerKPIs[${perfEmpItemObj?.id}][${goalSettingIdx}].perfKRA`}
                                type="text"
                                select
                                options={perfKRAList}
                                readOnly={
                                  !isCategoryEditable('kra') || onViewDetail
                                }
                              />
                            </Form>
                          ) : (
                            <Form>
                              <InputField
                                placeholder={
                                  isCategoryHasKRA ? 'Write your KRA' : '-'
                                }
                                formik={formik}
                                name={`itemsPerKPIs[${perfEmpItemObj?.id}][${goalSettingIdx}].kra`}
                                type="text"
                                textarea
                                isTextAreaAutoHigh={expand}
                                readOnly={
                                  !isCategoryEditable('kra') || onViewDetail
                                }
                              />
                              <p className="item-kra-error">{errorMessages}</p>
                            </Form>
                          )}
                        </Table.Cell>
                      ))}
                    {/* KPI content column */}
                    {isAbsoluteScore(goalSettingIdx) ? (
                      <Popup
                        content="You cannot edit this field because score was generated using absolute score. Please connect with the Admin for further queries."
                        trigger={
                          <Table.Cell>
                            {isCategorySelection('kpi') ? (
                              <Form>
                                <InputField
                                  placeholder="Select KPI"
                                  formik={formik}
                                  name={`itemsPerKPIs[${perfEmpItemObj?.id}][${goalSettingIdx}].perfKPI`}
                                  type="text"
                                  select
                                  onChange={(value) => {
                                    addSelectedKPIDisplayDesc(goalSettingIdx);
                                    addCorrespondingDataOfKPI(
                                      value,
                                      goalSettingIdx,
                                    );
                                  }}
                                  options={perfKPIList}
                                  readOnly={
                                    !isCategoryEditable('kpi') || onViewDetail
                                  }
                                  disabled={true}
                                />
                              </Form>
                            ) : (
                              <Form>
                                <InputField
                                  placeholder="Write your KPI"
                                  formik={formik}
                                  name={`itemsPerKPIs[${perfEmpItemObj?.id}][${goalSettingIdx}].kpi`}
                                  type="text"
                                  textarea
                                  isTextAreaAutoHigh={expand}
                                  readOnly={
                                    !isCategoryEditable('kpi') || onViewDetail
                                  }
                                  disabled={true}
                                />
                              </Form>
                            )}
                          </Table.Cell>
                        }
                      />
                    ) : (
                      <Table.Cell>
                        {isCategorySelection('kpi') ? (
                          <Form>
                            <InputField
                              placeholder="Select KPI"
                              formik={formik}
                              name={`itemsPerKPIs[${perfEmpItemObj?.id}][${goalSettingIdx}].perfKPI`}
                              type="text"
                              select
                              onChange={(value) => {
                                addSelectedKPIDisplayDesc(goalSettingIdx);
                                addCorrespondingDataOfKPI(
                                  value,
                                  goalSettingIdx,
                                );
                              }}
                              options={perfKPIList}
                              readOnly={
                                !isCategoryEditable('kpi') || onViewDetail
                              }
                            />
                          </Form>
                        ) : (
                          <Form>
                            <InputField
                              placeholder="Write your KPI"
                              formik={formik}
                              name={`itemsPerKPIs[${perfEmpItemObj?.id}][${goalSettingIdx}].kpi`}
                              type="text"
                              textarea
                              isTextAreaAutoHigh={expand}
                              readOnly={
                                !isCategoryEditable('kpi') || onViewDetail
                              }
                            />
                          </Form>
                        )}
                      </Table.Cell>
                    )}
                    {/* Target content column */}
                    {isCategoryHasTarget && (
                      <Table.Cell>
                        <Form>
                          <InputField
                            placeholder={
                              isCategoryHasKRA ? 'Write your Target' : '-'
                            }
                            formik={formik}
                            name={`itemsPerKPIs[${perfEmpItemObj?.id}][${goalSettingIdx}].target`}
                            type="text"
                            textarea
                            isTextAreaAutoHigh={expand}
                            readOnly={
                              !isCategoryEditable('kpi') || onViewDetail
                            }
                          />
                        </Form>
                      </Table.Cell>
                    )}
                    {/* Achievement content column */}
                    <Table.Cell>
                      <Form>
                        <InputField
                          placeholder={'Result & Achievement'}
                          formik={formik}
                          name={`itemsPerKPIs[${perfEmpItemObj?.id}][${goalSettingIdx}].achievement`}
                          type="text"
                          isTextAreaAutoHigh={expand}
                          textarea
                          readOnly={onViewDetail}
                        />
                      </Form>
                    </Table.Cell>
                    {/* Weight content column */}
                    {isAbsoluteScore(goalSettingIdx) ? (
                      <>
                        <Popup
                          content="You cannot edit this field because score was generated using absolute score. Please connect with the Admin for further queries."
                          trigger={
                            <Table.Cell>
                              <Form>
                                <InputField
                                  placeholder="Weight"
                                  formik={formik}
                                  name={`itemsPerKPIs[${perfEmpItemObj?.id}][${goalSettingIdx}].weight`}
                                  type="number"
                                  isNumber
                                  max={100}
                                  min={0}
                                  disabled={true}
                                />
                              </Form>
                            </Table.Cell>
                          }
                        />
                      </>
                    ) : (
                      <>
                        <Table.Cell>
                          <Form>
                            <InputField
                              placeholder="Weight"
                              formik={formik}
                              name={`itemsPerKPIs[${perfEmpItemObj?.id}][${goalSettingIdx}].weight`}
                              type="number"
                              isNumber
                              max={100}
                              min={0}
                              disabled={
                                !isCategoryEditable('kpi') || onViewDetail
                              }
                            />
                          </Form>
                        </Table.Cell>
                      </>
                    )}
                    {/* Remove selected content row column */}
                    {isCategoryEditable('kpi') && !onViewDetail && (
                      <Table.Cell>
                        <Button.Group>
                          {arrKPIDisplayDesc[goalSettingIdx] !== undefined && (
                            <Button
                              floated={'right'}
                              icon
                              compact
                              onClick={() =>
                                changeSelectedKPIDisplayDesc(goalSettingIdx)
                              }
                            >
                              <Icon name={'eye'} />
                            </Button>
                          )}
                          {isRowRemovable(goalSettingIdx) && (
                            <Button
                              floated={'right'}
                              icon
                              compact
                              onClick={() => {
                                removeSelectedGoalSettingContentRow(
                                  goalSettingIdx,
                                );
                                removeSelectedKPIDiplayDesc(goalSettingIdx);
                              }}
                            >
                              <Icon name={'trash'} />
                            </Button>
                          )}
                        </Button.Group>
                      </Table.Cell>
                    )}
                  </Table.Row>
                  {arrKPIDisplayDesc[goalSettingIdx] && (
                    <Table.Row>
                      <Table.Cell
                        className="no-border"
                        colSpan={
                          isCategoryHasKRA && isCategoryHasTarget ? 4 : 3
                        }
                      >
                        <Grid columns={'equal'}>
                          <Grid.Row>
                            <Grid.Column>
                              <div style={{ marginBottom: '.5rem' }}>
                                <strong>Description</strong>
                              </div>

                              <p style={{ whiteSpace: 'pre-line' }}>
                                {getKPIDescription(
                                  perfEmpItemObj.id,
                                  goalSettingIdx,
                                )}
                              </p>
                            </Grid.Column>
                            <Grid.Column>
                              <div style={{ marginBottom: '.5rem' }}>
                                <strong>Key Action</strong>
                              </div>

                              <p style={{ whiteSpace: 'pre-line' }}>
                                {getKPIKeyAction(
                                  perfEmpItemObj.id,
                                  goalSettingIdx,
                                )}
                              </p>
                            </Grid.Column>
                            <Grid.Column>
                              <div style={{ marginBottom: '.5rem' }}>
                                <strong>Behavior</strong>
                              </div>

                              <p style={{ whiteSpace: 'pre-line' }}>
                                {getKPIBehavior(
                                  perfEmpItemObj.id,
                                  goalSettingIdx,
                                )}
                              </p>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </React.Fragment>
              ))}
          </Table.Body>

          <TotalWeightPerCategory
            formik={formik}
            perfEmpItemObj={perfEmpItemObj}
            isKRA={isCategoryHasKRA}
            isTarget={isCategoryHasTarget}
            totalGoalSettingItem={totalGoalSettingItem}
            isCategoryHasCategoryWeightCalc={isCategoryHasCategoryWeightCalc}
            onViewDetail={onViewDetail}
          />
        </Table>
        {isDisplayAddGoalSettingButton && (
          <Button
            circular
            color={'blue'}
            fluid
            size={'mini'}
            onClick={() => addNewGoalSettingContentRow(totalGoalSettingItem)}
            disabled={
              dataKPIMaxCount !== null &&
              totalGoalSettingItem === parseInt(dataKPIMaxCount.toString())
            }
          >
            {`Add Goal Setting${
              dataKPIType === 'LIMITED'
                ? ` (Min: ${dataKPIMinCount}, Max: ${dataKPIMaxCount})`
                : ''
            }`}
          </Button>
        )}
      </div>
    </Segment>
  );
}
