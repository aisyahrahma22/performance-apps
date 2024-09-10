import { FormikProps } from 'formik';
import { cloneDeep, get, set } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Popup,
  Segment,
  Table,
  Transition,
} from 'semantic-ui-react';
import { PerfLevelEnum } from '../../../lib/data/perfMidYear/enum/perfForm.enum';
import { calculateWeightScorePerfKPI } from '../../../lib/data/perfMidYear/helpers/calculation';
import { PerfFormFillProps } from '../../../lib/data/perfMidYear/helpers/perfFormFill';
import {
  keyEmpEndItemPerKPIByLevels,
  keyEmpMidItemPerKPIByLevels,
} from '../../../lib/data/perfMidYear/helpers/perfLevels';
import {
  PerfEmpItemPerKPIProps,
  PerfEmpProps,
} from '../../../lib/data/perfMidYear/interfaces/perfEmp.interface';
import {
  PerfFormTypeProps,
  PerfFormTypeItemProps,
} from '../../../lib/data/perfMidYear/interfaces/perfForm.interface';
import DropdownOptions from '../../../lib/types/DropdownOptions';
import Input from '../../Input';
import InputDropdownKPIPerfMid from '../../performanceMidYear/components/InputDropdownKPI';
import InputDropdownKRAPerfMid from '../../performanceMidYear/components/InputDropdownKRA';
import InputDropdownTargetPerfMid from '../../performanceMidYear/components/InputDropdownTarget';
import PerfEmpItemKPIDescMid from '../../performanceMidYear/components/PerfEmpItemKPIDesc';
import InputScorePerfEnd from './InputScorePerfEnd';
import InputDropdownSimple from '../../InputDropdownSimple';
import { PerfEmpItemProps } from '../../../lib/data/perfMidYear/interfaces/perfEmp.interface';
import { renderInputScoreCondition } from '../../performanceMidYear/components/TablePerfFormTypeItemRow';
import { MaxKPICount } from '../../../lib/enums/PerfForm';
import useSystemConfiguration, {
  SystemConfigurationCodeEnum,
} from '../../../lib/data/systemConfiguration/useSystemConfiguration';
import convertStringToBoolean from '../../../lib/util/convertStringToBoolean';

interface TablePerfFormTypeItemRowEndProps {
  formik: FormikProps<PerfEmpProps>;
  editable?: boolean;
  name: string;
  perfEmpItemKPI: PerfEmpItemPerKPIProps;
  index: number;
  formType: PerfFormTypeProps;
  onRemoveItemKPI: any;
  countCell: number;
  level: PerfLevelEnum;
  measurementOptions: DropdownOptions[];
  totalWeight: number;
  ruleFormFillKRA: PerfFormFillProps;
  ruleFormFillKPI: PerfFormFillProps;
  ruleFormFillTarget: PerfFormFillProps;
  formTypeItem: PerfFormTypeItemProps;
  expand: any;
  onChangeScore: (
    levels: PerfLevelEnum[],
    perfEmpItems: PerfEmpItemProps[],
    perfEmpItemPerKPI: PerfEmpItemPerKPIProps[],
  ) => void;
  indexEmpItem: number;
  perfEmpItems: PerfEmpItemProps[];
  isView: boolean;
  countEmpItemKPIs: number;
  itemPerKPI: PerfEmpItemPerKPIProps[];
  allKPI: any;
}

const TablePerfFormTypeItemRowEnd = ({
  formik,
  editable,
  name,
  perfEmpItemKPI,
  index,
  formType,
  onRemoveItemKPI,
  countCell,
  level,
  measurementOptions,
  totalWeight,
  ruleFormFillKRA,
  ruleFormFillKPI,
  ruleFormFillTarget,
  formTypeItem,
  expand,
  onChangeScore,
  indexEmpItem,
  perfEmpItems,
  isView,
  countEmpItemKPIs,
  allKPI,
}: TablePerfFormTypeItemRowEndProps) => {
  const [showKPIDesc, setShowKPIDesc] = useState(false);
  const [showMidYearScore, setShowMidYearScore] = useState(false);
  const [showEndYearScore, setShowEndYearScore] = useState(true);
  const [isHideMY, setIsHideMY] = useState(true);
  const [isHideEY, setIsHideEY] = useState(true);
  const onClickBtnComment = useCallback(() => {
    const val = perfEmpItemKPI?.isShowComment;
    formik.setFieldValue(`${name}.isShowComment`, !val);
  }, [formik, name, perfEmpItemKPI]);

  const currWeight = useMemo(() => {
    return get(formik.values, `${name}.weight`) || 0;
  }, [formik.values, name]);

  const maxKPIWeight = useMemo(() => {
    return formTypeItem?.perfFormTypeKPI?.maxKPIWeightInput;
  }, [formTypeItem]);

  // const minKPIWeight = useMemo(() => {
  //   return formTypeItem?.perfFormTypeKPI?.minKPIWeightInput;
  // }, [formTypeItem]);

  const onChangeWeight = useCallback(
    (val) => {
      const maxKPIWeight = Number(
        formTypeItem?.perfFormTypeKPI?.maxKPIWeightInput,
      );
      const minKPIWeight = Number(
        formTypeItem?.perfFormTypeKPI?.minKPIWeightInput,
      );
      const typeWeight = formTypeItem?.perfFormTypeKPI?.typeMaxKPIWeight;
      if (
        (maxKPIWeight > 0 && typeWeight == 'LIMITED') ||
        (minKPIWeight > 0 && typeWeight == 'LIMITED')
      ) {
        val > maxKPIWeight
          ? formik.setFieldValue(`${name}.isErrorWeight`, val > maxKPIWeight)
          : formik.setFieldValue(`${name}.isErrorWeight`, val < minKPIWeight);
      }

      const weight = Number(val) || 0;
      const scoreBySelf =
        get(formik.values, `${name}.scores.endBySelf.score`) || 0;
      const scoreByDM = get(formik.values, `${name}.scores.endByDM.score`) || 0;
      const scoreByAboveDM =
        get(formik.values, `${name}.scores.endByAboveDM.score`) || 0;

      const weightScoreSelf = calculateWeightScorePerfKPI({
        score: scoreBySelf,
        weightKPI: weight,
        isKPIWeightCalc: formType?.isKPIWeightCalc,
        totalWeight,
      });
      const weightScoreDM = calculateWeightScorePerfKPI({
        score: scoreByDM,
        weightKPI: weight,
        isKPIWeightCalc: formType?.isKPIWeightCalc,
        totalWeight,
      });
      const weightScoreAboveDM = calculateWeightScorePerfKPI({
        score: scoreByAboveDM,
        weightKPI: weight,
        isKPIWeightCalc: formType?.isKPIWeightCalc,
        totalWeight,
      });

      formik.setFieldValue(
        `${name}.scores.endBySelf.weightScore`,
        weightScoreSelf,
      );
      formik.setFieldValue(`${name}.scores.endByDM.weightScore`, weightScoreDM);
      formik.setFieldValue(
        `${name}.scores.endByAboveDM.weightScore`,
        weightScoreAboveDM,
      );

      if (level.includes('DIRECT_MANAGER')) {
        formik.setFieldValue(`${name}.scores.endByDM.type`, level);
      }

      if (level.includes('ABOVE_MANAGER')) {
        formik.setFieldValue(`${name}.scores.endByAboveDM.type`, level);
      }

      const currPerfEmpItems = cloneDeep(perfEmpItems);
      // set(
      //   currPerfEmpItems[indexEmpItem].perfEmpItemPerKPIs[index],
      //   'weight',
      //   weight,
      // );
      // set(
      //   currPerfEmpItems[indexEmpItem].perfEmpItemPerKPIs[index].scores
      //     .endBySelf as any,
      //   'weightScore',
      //   weightScoreSelf,
      // );
      // set(
      //   currPerfEmpItems[indexEmpItem].perfEmpItemPerKPIs[index].scores
      //     .endByDM as any,
      //   'weightScore',
      //   weightScoreDM,
      // );
      // set(
      //   currPerfEmpItems[indexEmpItem].perfEmpItemPerKPIs[index].scores
      //     .endByAboveDM as any,
      //   'weightScore',
      //   weightScoreAboveDM,
      // );
      const kpiItems = cloneDeep(allKPI);
      const empItemIdx = currPerfEmpItems[indexEmpItem];
      const items = kpiItems[empItemIdx?.id];
      set(items[index], 'weight', weight);
      set(items[index].scores.endBySelf as any, 'weightScore', weightScoreSelf);
      set(items[index].scores.endByDM as any, 'weightScore', weightScoreDM);
      set(
        items[index].scores.endByAboveDM as any,
        'weightScore',
        weightScoreAboveDM,
      );
      onChangeScore(Object.values(PerfLevelEnum), currPerfEmpItems, kpiItems);
    },
    [
      formik,
      name,
      maxKPIWeight,
      formType?.isMidYearScore,
      formType?.isKPIWeightCalc,
      totalWeight,
      level,
      onChangeScore,
      indexEmpItem,
      perfEmpItems,
      index,
    ],
  );

  const onChangeComment = useCallback(
    (value) => {
      if (value) {
        if (level.includes('DIRECT_MANAGER')) {
          formik.setFieldValue(`${name}.scores.endByDM.type`, level);
        }
        if (level.includes('ABOVE_MANAGER')) {
          formik.setFieldValue(`${name}.scores.endByAboveDM.type`, level);
        }
      }
    },
    [formik, level],
  );

  const showKPIDescPress = useCallback(() => {
    setShowKPIDesc((v) => !v);
  }, []);

  const isErrorWeight = useMemo(() => {
    return get(formik.values, `${name}.isErrorWeight`) || false;
  }, [formik.values, name]);

  const isEditableItemKPI = useMemo(() => {
    // to see APPROVAL can add/remove item KPI from appraise
    if (level !== PerfLevelEnum.APPRAISEE) return false;
    if (!editable) return false;
    return true;
  }, [formType, level, editable]);

  const isDisabledItemWeight = useMemo(() => {
    /**
     * If level not APPRAISEE then disabled
     */
    if (level !== PerfLevelEnum.APPRAISEE) return true;
    /**
     * If item not editable then disabled
     */
    if (!editable) return true;
    /**
     * If item editable AND kpi not editable OR kpi not user define then disabled
     */
    if (!ruleFormFillKPI?.isEditable && !ruleFormFillKPI?.isUserDefine) {
      return true;
    }
    return false;
  }, [formType, level, editable, ruleFormFillKPI]);

  const isEditableItemTargetAchievement = useMemo(() => {
    // to see APPROVAL can add/remove item KPI from apprai/se
    if (!editable) return false;
    if (
      level === PerfLevelEnum.APPRAISEE ||
      level === PerfLevelEnum.DIRECT_MANAGER ||
      level === PerfLevelEnum.ABOVE_MANAGER
    ) {
      return true;
    }
    return !formType?.isMidYearScore;
  }, [formType, level, editable]);

  const isDisableRemoveItem = useMemo(() => {
    if (level !== PerfLevelEnum.APPRAISEE && formType?.isMidYearScore)
      return true;

    if (!formTypeItem) return false;

    const { perfFormTypeKPI } = formTypeItem;

    if (
      !perfFormTypeKPI?.isEditable &&
      !perfFormTypeKPI?.isUserDefine &&
      !perfFormTypeKPI?.isSelection
    ) {
      return true;
    }

    if (
      !perfFormTypeKPI?.typeMaxKPICount &&
      perfFormTypeKPI?.typeMaxKPICount === MaxKPICount.UNLIMITED
    ) {
      return false;
    }

    const minKPI = perfFormTypeKPI?.minKPICountInput || 0;
    return countEmpItemKPIs <= minKPI;
  }, [
    countEmpItemKPIs,
    editable,
    formType?.isMidYearScore,
    formTypeItem,
    level,
  ]);

  const errorMessages = useMemo(() => {
    const itemsKPI = get(formik.values, `${name}`);
    if (itemsKPI?.kra?.length > 256)
      return 'KRA should be less than 256 characters';
  }, [formik.values]);

  const isAbsoluteScore = (scoreObj?: any): boolean => {
    return scoreObj?.isAbsoluteScore;
  };
  const isAbsoluteScoreForKPI = useMemo(() => {
    switch (level) {
      case 'APPRAISEE':
        return (
          get(formik.values, `${name}.scores.endBySelf.isAbsoluteScore`) ||
          false
        );
      case 'DIRECT_MANAGER':
        return (
          get(formik.values, `${name}.scores.endByDM.isAbsoluteScore`) || false
        );
      case 'ABOVE_MANAGER':
        return (
          get(formik.values, `${name}.scores.endByAboveDM.isAbsoluteScore`) ||
          false
        );
      default:
        false;
        break;
    }
  }, [formik.values, name]);

  const { systemConfiguration } = useSystemConfiguration(
    SystemConfigurationCodeEnum.CONFIG_FOR_VISIBILITY_MID_YEAR_SECTION,
    { revalidateOnMount: true },
  );
  const defaultFilterConfig = convertStringToBoolean(
    systemConfiguration?.value,
  );

  return (
    <>
      <Table.Row
        key={`first-row-kpi-${perfEmpItemKPI?.id}`}
        className={`top aligned tr-noborder-btm soft-purple-bg-30`}
      >
        {formType?.isKRA &&
          (isAbsoluteScoreForKPI ? (
            <Popup
              content="You cannot edit this field because score was generated using absolute score. Please connect with the Admin for further queries."
              trigger={
                <Table.Cell>
                  {ruleFormFillKRA?.type === 'DROPDOWN' ? (
                    <InputDropdownKRAPerfMid
                      formik={formik}
                      name={name}
                      editable={false}
                      ruleKPI={ruleFormFillKPI}
                      ruleKRA={ruleFormFillKRA}
                      perfEmpItemKPI={perfEmpItemKPI}
                      formTypeItem={formTypeItem}
                    />
                  ) : (
                    <Form>
                      <Input
                        formik={formik}
                        name={`${name}.kra`}
                        placeholder={'KRA'}
                        readOnly
                        className={`bg-disable-input`}
                        isPreventEnter
                        textarea
                        isTextAreaAutoHigh={expand}
                      />
                      <p className="item-kra-error">{errorMessages}</p>
                    </Form>
                  )}
                </Table.Cell>
              }
            />
          ) : (
            <Table.Cell>
              {ruleFormFillKRA?.type === 'DROPDOWN' ? (
                <InputDropdownKRAPerfMid
                  formik={formik}
                  name={name}
                  editable={isEditableItemKPI}
                  ruleKPI={ruleFormFillKPI}
                  ruleKRA={ruleFormFillKRA}
                  perfEmpItemKPI={perfEmpItemKPI}
                  formTypeItem={formTypeItem}
                />
              ) : (
                <Form>
                  <Input
                    formik={formik}
                    name={`${name}.kra`}
                    placeholder={'KRA'}
                    readOnly={
                      !(isEditableItemKPI && ruleFormFillKRA?.isEditable)
                    }
                    className={`bg-disable-input`}
                    isPreventEnter
                    textarea
                    isTextAreaAutoHigh={expand}
                  />
                  <p className="item-kra-error">{errorMessages}</p>
                </Form>
              )}
            </Table.Cell>
          ))}

        {isAbsoluteScoreForKPI ? (
          <Popup
            content="You cannot edit this field because score was generated using absolute score. Please connect with the Admin for further queries."
            trigger={
              <Table.Cell>
                {ruleFormFillKPI?.type === 'DROPDOWN' ? (
                  <InputDropdownKPIPerfMid
                    formik={formik}
                    name={name}
                    editable={false}
                    ruleKPI={ruleFormFillKPI}
                    ruleKRA={ruleFormFillKRA}
                    ruleTarget={ruleFormFillTarget}
                    perfEmpItemKPI={perfEmpItemKPI}
                    formTypeItem={formTypeItem}
                  />
                ) : (
                  <Input
                    formik={formik}
                    name={`${name}.kpi`}
                    placeholder={'KPI'}
                    readOnly
                    className={`bg-disable-input`}
                    isPreventEnter
                    textarea
                    isTextAreaAutoHigh={expand}
                  />
                )}
              </Table.Cell>
            }
          />
        ) : (
          <Table.Cell>
            {ruleFormFillKPI?.type === 'DROPDOWN' ? (
              <InputDropdownKPIPerfMid
                formik={formik}
                name={name}
                editable={isEditableItemKPI}
                ruleKPI={ruleFormFillKPI}
                ruleKRA={ruleFormFillKRA}
                ruleTarget={ruleFormFillTarget}
                perfEmpItemKPI={perfEmpItemKPI}
                formTypeItem={formTypeItem}
              />
            ) : (
              <Input
                formik={formik}
                name={`${name}.kpi`}
                placeholder={'KPI'}
                readOnly={!(isEditableItemKPI && ruleFormFillKPI?.isEditable)}
                className={`bg-disable-input`}
                isPreventEnter
                textarea
                isTextAreaAutoHigh={expand}
              />
            )}
          </Table.Cell>
        )}
        {formType?.isTarget && (
          <Table.Cell>
            {ruleFormFillTarget?.type === 'DROPDOWN' ? (
              <InputDropdownTargetPerfMid
                formik={formik}
                name={name}
                editable={isEditableItemKPI}
                ruleKPI={ruleFormFillKPI}
                ruleTarget={ruleFormFillTarget}
                perfEmpItemKPI={perfEmpItemKPI}
                formTypeItem={formTypeItem}
              />
            ) : (
              <Input
                formik={formik}
                name={`${name}.target`}
                placeholder={'Target'}
                readOnly={
                  !(isEditableItemKPI && ruleFormFillTarget?.isEditable)
                }
                className={`bg-disable-input`}
                isPreventEnter
                textarea
                isTextAreaAutoHigh={expand}
              />
            )}
          </Table.Cell>
        )}
        <Table.Cell>
          <Input
            formik={formik}
            name={`${name}.achievement`}
            placeholder={'Result & Achievement'}
            readOnly={!isEditableItemTargetAchievement}
            className={`bg-disable-input`}
            isPreventEnter
            textarea
            isTextAreaAutoHigh={expand}
          />
        </Table.Cell>
        <Table.Cell>
          {isAbsoluteScoreForKPI ? (
            <Popup
              content="You cannot edit this field because score was generated using absolute score. Please connect with the Admin for further queries."
              trigger={
                <span>
                  <Input
                    formik={formik}
                    name={`${name}.weight`}
                    placeholder={'Weight'}
                    disabled
                    className={`bg-disable-input`}
                    isPreventEnter
                    type={'number'}
                    isNumber
                    onChange={onChangeWeight}
                    max={100}
                    min={0}
                    error={isErrorWeight}
                  />
                </span>
              }
            />
          ) : (
            <Input
              formik={formik}
              name={`${name}.weight`}
              placeholder={'Weight'}
              disabled={isDisabledItemWeight}
              className={`bg-disable-input`}
              isPreventEnter
              type={'number'}
              isNumber
              onChange={onChangeWeight}
              max={100}
              min={0}
              error={isErrorWeight}
            />
          )}
          {/* {isErrorWeight && (
            <p className="kpi-error">
              Min Weight is {minKPIWeight}, Max Weight is {maxKPIWeight}
            </p>
          )} */}
        </Table.Cell>
        <Table.Cell>
          <Button.Group icon basic size="mini" compact>
            <Button
              icon={
                perfEmpItemKPI?.isShowComment ? 'comments' : 'comments outline'
              }
              onClick={onClickBtnComment}
            />
            {ruleFormFillKPI?.type === 'DROPDOWN' && (
              <Button
                icon={showKPIDesc ? 'eye slash' : 'eye'}
                onClick={showKPIDescPress}
              />
            )}
            {isEditableItemKPI && (
              <Button
                icon={'trash'}
                onClick={onRemoveItemKPI?.(perfEmpItemKPI?.id)}
                disabled={isDisableRemoveItem}
              />
            )}
          </Button.Group>
        </Table.Cell>
      </Table.Row>
      {showKPIDesc && (
        <Table.Row
          key={`second-row-kpi-${perfEmpItemKPI?.id}`}
          className={`tr-noborder-top tr-noborder-btm soft-purple-bg-30`}
        >
          <Table.Cell colSpan={countCell}>
            <PerfEmpItemKPIDescMid
              formik={formik}
              name={`${name}.perfKPIId`}
              formTypeItemKPIDetails={
                formTypeItem?.perfFormTypeKPI?.details || []
              }
            />
          </Table.Cell>
        </Table.Row>
      )}
      {perfEmpItemKPI?.isShowComment && (
        <Table.Row key={`third-row-kpi-${perfEmpItemKPI?.id}`}>
          <Table.Cell colSpan={countCell}>
            {defaultFilterConfig && (
              <Segment className={`nopadding `}>
                <Segment
                  // style={{
                  //   backgroundColor: '#DAD4FB',
                  // }}
                  attached={!showMidYearScore ? undefined : 'top'}
                >
                  <Grid columns={'equal'}>
                    <Grid.Column verticalAlign="middle">
                      <Header size="small" color="violet">
                        <Header.Content as={'h3'}>Mid Year</Header.Content>
                      </Header>
                    </Grid.Column>
                    <Grid.Column verticalAlign={'middle'}>
                      <Button
                        size={'tiny'}
                        floated="right"
                        onClick={() => setShowMidYearScore(!showMidYearScore)}
                        basic
                        icon
                      >
                        <Icon
                          name={showMidYearScore ? 'angle down' : 'angle right'}
                        />
                      </Button>
                    </Grid.Column>
                  </Grid>
                </Segment>
                {showMidYearScore && (
                  <div style={{ marginTop: '3vh' }}>
                    <Segment clearing basic>
                      <Grid columns={'equal'}>
                        {formType?.isMidYearScore && (
                          <>
                            <Grid.Row>
                              {keyEmpMidItemPerKPIByLevels?.map((keyLevel) => (
                                <Grid.Column
                                  key={`third-row-kpi-${perfEmpItemKPI?.id}-score-${keyLevel?.level}`}
                                >
                                  <div className="d-flex flex-align-center">
                                    {renderInputScoreCondition(
                                      level,
                                      keyLevel,
                                    ) ? (
                                      <>
                                        <div className="w-70 mr-1">
                                          <InputScorePerfEnd
                                            formik={formik}
                                            name={name}
                                            scoreObj={
                                              perfEmpItemKPI.scores?.[
                                                keyLevel.key
                                              ]
                                            }
                                            keyScore={keyLevel?.keyScore}
                                            keyScoreId={keyLevel?.keyScoreId}
                                            keyWeightScore={keyLevel?.keyWeight}
                                            label={keyLevel?.labelScore}
                                            formLevel={keyLevel?.level}
                                            userLevel={level}
                                            editable={false}
                                            measurementOptions={
                                              measurementOptions
                                            }
                                            measurementGrades={
                                              formType?.perfMeasurement
                                                ?.grades || []
                                            }
                                            weight={currWeight}
                                            totalWeight={totalWeight}
                                            isKPIWeightCalc={
                                              formType?.isKPIWeightCalc
                                            }
                                            onChangeScore={onChangeScore}
                                            indexEmpItem={indexEmpItem}
                                            indexEmpItemKPI={index}
                                            perfEmpItems={perfEmpItems}
                                            allKPI={allKPI}
                                          />
                                        </div>
                                        <div className="w-30">
                                          <Input
                                            formik={formik}
                                            name={`${name}.[${keyLevel?.keyWeight}]`}
                                            placeholder={'Score'}
                                            label={'Weighted Score'}
                                            className={`bg-disable-input`}
                                            isPreventEnter
                                            isNumber
                                            isRound
                                            disabled
                                          />
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div className="w-70 mr-1">
                                          <InputDropdownSimple
                                            formik={formik}
                                            name={`-`}
                                            options={measurementOptions}
                                            placeholder={'-'}
                                            label={keyLevel?.labelScore}
                                            disabled={true}
                                            className={`bg-disable-input`}
                                          />
                                        </div>
                                        <div className="w-30">
                                          <Input
                                            formik={formik}
                                            name={`-`}
                                            placeholder={'-'}
                                            label={'Weighted Score'}
                                            className={`bg-disable-input`}
                                            isPreventEnter
                                            isNumber
                                            disabled
                                          />
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </Grid.Column>
                              ))}
                            </Grid.Row>
                          </>
                        )}
                      </Grid>
                      <Segment
                        attached={isHideMY ? undefined : 'top'}
                        compact
                        style={{
                          cursor: 'pointer',
                        }}
                        onClick={() => setIsHideMY(!isHideMY)}
                      >
                        <Grid>
                          <Grid.Row verticalAlign={'middle'}>
                            <Grid.Column
                              width={1}
                              verticalAlign={'middle'}
                              className="nopaddingh"
                            ></Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </Segment>
                      <Transition
                        visible={!isHideMY}
                        animation="slide down"
                        duration={500}
                      >
                        <Segment
                          clearing
                          basic
                          style={{
                            backgroundColor: 'white',
                          }}
                          attached={'bottom'}
                        >
                          <Grid columns={'equal'} divided>
                            <Grid.Row
                              className={`${
                                formType?.isMidYearScore ? 'pt-0' : ''
                              }`}
                            >
                              {keyEmpMidItemPerKPIByLevels?.map((keyLevel) => (
                                <Grid.Column
                                  key={`third-row-kpi-${perfEmpItemKPI?.id}-comment-${keyLevel?.level}`}
                                >
                                  {isAbsoluteScore(
                                    perfEmpItemKPI.scores?.[keyLevel.key],
                                  ) ? (
                                    <Popup
                                      content="You cannot edit this field because score was generated using absolute score. Please connect with the Admin for further queries."
                                      trigger={
                                        <span>
                                          <Input
                                            formik={formik}
                                            name={`${name}.[${keyLevel?.keyComment}]`}
                                            placeholder={'Comment'}
                                            label={keyLevel?.labelComment}
                                            readOnly
                                            className={`bg-disable-input`}
                                            textarea
                                            isPreventEnter
                                            isTextAreaAutoHigh={expand}
                                            isExclamation
                                          />
                                        </span>
                                      }
                                    />
                                  ) : (
                                    <Input
                                      formik={formik}
                                      name={`${name}.[${keyLevel?.keyComment}]`}
                                      placeholder={'Comment'}
                                      label={keyLevel?.labelComment}
                                      readOnly
                                      className={`bg-disable-input`}
                                      textarea
                                      isPreventEnter
                                      isTextAreaAutoHigh={expand}
                                    />
                                  )}
                                </Grid.Column>
                              ))}
                            </Grid.Row>
                          </Grid>
                        </Segment>
                      </Transition>
                    </Segment>
                  </div>
                )}
              </Segment>
            )}
            <Segment className={`nopadding`}>
              <Segment attached={!showEndYearScore ? undefined : 'top'}>
                <Grid columns={'equal'}>
                  <Grid.Column verticalAlign="middle">
                    <Header size="small" color="violet">
                      <Header.Content as={'h3'}>End Year</Header.Content>
                    </Header>
                  </Grid.Column>
                  <Grid.Column verticalAlign={'middle'}>
                    <Button
                      size={'tiny'}
                      floated="right"
                      onClick={() => setShowEndYearScore(!showEndYearScore)}
                      basic
                      icon
                    >
                      <Icon
                        name={showEndYearScore ? 'angle down' : 'angle right'}
                      />
                    </Button>
                  </Grid.Column>
                </Grid>
              </Segment>
              {showEndYearScore && (
                <div style={{ marginTop: '3vh' }}>
                  <Segment clearing basic>
                    <Grid columns={'equal'}>
                      <Grid.Row>
                        {keyEmpEndItemPerKPIByLevels?.map((keyLevel) => (
                          <Grid.Column
                            key={`third-row-kpi-${perfEmpItemKPI?.id}-score-${keyLevel?.level}`}
                          >
                            <div className="d-flex flex-align-center">
                              {renderInputScoreCondition(level, keyLevel) ? (
                                <>
                                  <div className="w-70 mr-1">
                                    <InputScorePerfEnd
                                      formik={formik}
                                      name={name}
                                      scoreObj={
                                        perfEmpItemKPI.scores?.[keyLevel.key]
                                      }
                                      keyScore={keyLevel?.keyScore}
                                      keyScoreId={keyLevel?.keyScoreId}
                                      keyWeightScore={keyLevel?.keyWeight}
                                      label={keyLevel?.labelScore}
                                      formLevel={keyLevel?.level}
                                      userLevel={level}
                                      editable={editable}
                                      measurementOptions={measurementOptions}
                                      measurementGrades={
                                        formType?.perfMeasurement?.grades || []
                                      }
                                      weight={currWeight}
                                      totalWeight={totalWeight}
                                      isKPIWeightCalc={
                                        formType?.isKPIWeightCalc
                                      }
                                      onChangeScore={onChangeScore}
                                      indexEmpItem={indexEmpItem}
                                      indexEmpItemKPI={index}
                                      perfEmpItems={perfEmpItems}
                                      isView={isView}
                                      allKPI={allKPI}
                                    />
                                  </div>
                                  <div className="w-30">
                                    <Input
                                      formik={formik}
                                      name={`${name}.[${keyLevel?.keyWeight}]`}
                                      placeholder={'Score'}
                                      label={'Weighted Score'}
                                      className={`bg-disable-input`}
                                      isPreventEnter
                                      isNumber
                                      isRound
                                      disabled
                                    />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="w-70 mr-1">
                                    <InputDropdownSimple
                                      formik={formik}
                                      name={`-`}
                                      options={measurementOptions}
                                      placeholder={'-'}
                                      label={keyLevel?.labelScore}
                                      disabled={true}
                                      className={`bg-disable-input`}
                                    />
                                  </div>
                                  <div className="w-30">
                                    <Input
                                      formik={formik}
                                      name={`-`}
                                      placeholder={'-'}
                                      label={'Weighted Score'}
                                      className={`bg-disable-input`}
                                      isPreventEnter
                                      isNumber
                                      disabled
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          </Grid.Column>
                        ))}
                      </Grid.Row>
                    </Grid>
                    <Segment
                      attached={isHideEY ? undefined : 'top'}
                      compact
                      style={{
                        cursor: 'pointer',
                      }}
                      onClick={() => setIsHideEY(!isHideEY)}
                    >
                      <Grid>
                        <Grid.Row verticalAlign={'middle'}>
                          <Grid.Column
                            width={1}
                            verticalAlign={'middle'}
                            className="nopaddingh"
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            ></div>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Segment>
                    <Transition
                      visible={!isHideEY}
                      animation="slide down"
                      duration={500}
                    >
                      <Segment
                        clearing
                        basic
                        style={{
                          backgroundColor: 'white',
                        }}
                        attached={'bottom'}
                      >
                        <Grid columns={'equal'} divided>
                          <Grid.Row
                            className={`${
                              formType?.isMidYearScore ? 'pt-0' : ''
                            }`}
                          >
                            {keyEmpEndItemPerKPIByLevels?.map((keyLevel) => (
                              <Grid.Column
                                key={`third-row-kpi-${perfEmpItemKPI?.id}-comment-${keyLevel?.level}`}
                              >
                                {isAbsoluteScore(
                                  perfEmpItemKPI.scores?.[keyLevel.key],
                                ) ? (
                                  <Popup
                                    content="You cannot edit this field because score was generated using absolute score. Please connect with the Admin for further queries."
                                    trigger={
                                      <span>
                                        <Input
                                          formik={formik}
                                          name={`${name}.[${keyLevel?.keyComment}]`}
                                          placeholder={'Comment'}
                                          label={keyLevel?.labelComment}
                                          disabled={
                                            editable === undefined ||
                                            (editable === true &&
                                              level != keyLevel?.level)
                                              ? false
                                              : !(
                                                  editable &&
                                                  level === keyLevel?.level &&
                                                  !perfEmpItemKPI.scores?.[
                                                    keyLevel.key
                                                  ]?.isAbsoluteScore
                                                )
                                          }
                                          readOnly={
                                            !editable ||
                                            level != keyLevel?.level
                                          }
                                          className={`bg-disable-input`}
                                          textarea
                                          isPreventEnter
                                          isTextAreaAutoHigh={expand}
                                          onChange={onChangeComment}
                                          isExclamation
                                        />
                                      </span>
                                    }
                                  />
                                ) : (
                                  <Input
                                    formik={formik}
                                    name={`${name}.[${keyLevel?.keyComment}]`}
                                    placeholder={'Comment'}
                                    label={keyLevel?.labelComment}
                                    disabled={
                                      editable === undefined ||
                                      (editable === true &&
                                        level != keyLevel?.level)
                                        ? false
                                        : !(
                                            editable &&
                                            level === keyLevel?.level &&
                                            !perfEmpItemKPI.scores?.[
                                              keyLevel.key
                                            ]?.isAbsoluteScore
                                          )
                                    }
                                    readOnly={
                                      !editable || level != keyLevel?.level
                                    }
                                    className={`bg-disable-input`}
                                    textarea
                                    isPreventEnter
                                    isTextAreaAutoHigh={expand}
                                    onChange={onChangeComment}
                                  />
                                )}
                              </Grid.Column>
                            ))}
                          </Grid.Row>
                        </Grid>
                      </Segment>
                    </Transition>
                  </Segment>
                </div>
              )}
            </Segment>
          </Table.Cell>
        </Table.Row>
      )}
    </>
  );
};

export default TablePerfFormTypeItemRowEnd;
