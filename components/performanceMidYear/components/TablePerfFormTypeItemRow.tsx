import { FormikProps } from 'formik';
import { cloneDeep, get, set } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Popup,
  Segment,
  Table,
} from 'semantic-ui-react';
import { PerfLevelEnum } from '../../../lib/data/perfMidYear/enum/perfForm.enum';
import { calculateWeightScorePerfKPI } from '../../../lib/data/perfMidYear/helpers/calculation';
import { PerfFormFillProps } from '../../../lib/data/perfMidYear/helpers/perfFormFill';
import { keyEmpMidItemPerKPIByLevels } from '../../../lib/data/perfMidYear/helpers/perfLevels';
import {
  PerfEmpItemPerKPIProps,
  PerfEmpItemProps,
  PerfEmpProps,
} from '../../../lib/data/perfMidYear/interfaces/perfEmp.interface';
import {
  PerfFormTypeProps,
  PerfFormTypeItemProps,
} from '../../../lib/data/perfMidYear/interfaces/perfForm.interface';
import { MaxKPICount } from '../../../lib/enums/PerfForm';
import DropdownOptions from '../../../lib/types/DropdownOptions';
import Input from '../../Input';
import InputDropdownSimple from '../../InputDropdownSimple';
import InputDropdownKPIPerfMid from './InputDropdownKPI';
import InputDropdownKRAPerfMid from './InputDropdownKRA';
import InputDropdownTargetPerfMid from './InputDropdownTarget';
import InputScorePerfMid from './InputScorePerfMid';
import PerfEmpItemKPIDescMid from './PerfEmpItemKPIDesc';
import CommentKPI from './CommentKPI';

interface TablePerfFormTypeItemRowMidProps {
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
  countEmpItemKPIs: number;
  onChangeScore: (
    levels: PerfLevelEnum[],
    perfEmpItems: PerfEmpItemProps[],
    perfEmpItemPerKPI: PerfEmpItemPerKPIProps[],
  ) => void;
  indexEmpItem: number;
  perfEmpItems: PerfEmpItemProps[];
  isView?: boolean;
  itemPerKPI: PerfEmpItemPerKPIProps[];
  allKPI: any;
}

export const renderInputScoreCondition = (
  level: string,
  keyLevel: { level: string },
) =>
  (level == 'APPRAISEE' && keyLevel?.level == 'APPRAISEE') ||
  level == 'DIRECT_MANAGER' ||
  level == 'ABOVE_MANAGER';

const TablePerfFormTypeItemRowMid = ({
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
  countEmpItemKPIs,
  onChangeScore,
  indexEmpItem,
  perfEmpItems,
  isView,
  allKPI,
}: TablePerfFormTypeItemRowMidProps) => {
  const [showKPIDesc, setShowKPIDesc] = useState(false);

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

  const minKPIWeight = useMemo(() => {
    return formTypeItem?.perfFormTypeKPI?.minKPIWeightInput;
  }, [formTypeItem]);

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

      if (formType?.isMidYearScore) {
        // change score for mid year
        const weight = Number(val) || 0;
        const scoreBySelf =
          get(formik.values, `${name}.scores.midBySelf.score`) || 0;
        const scoreByDM =
          get(formik.values, `${name}.scores.midByDM.score`) || 0;
        const scoreByAboveDM =
          get(formik.values, `${name}.scores.midByAboveDM.score`) || 0;

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
          `${name}.scores.midBySelf.weightScore`,
          weightScoreSelf,
        );
        formik.setFieldValue(
          `${name}.scores.midByDM.weightScore`,
          weightScoreDM,
        );
        formik.setFieldValue(
          `${name}.scores.midByAboveDM.weightScore`,
          weightScoreAboveDM,
        );

        const currPerfEmpItems = cloneDeep(perfEmpItems);

        // const perfEmpItemPerKPI = cloneDeep(itemPerKPI);
        // set(perfEmpItemPerKPI[index], 'weight', weight);
        // set(
        //   perfEmpItemPerKPI[index].scores.midBySelf as any,
        //   'weightScore',
        //   weightScoreSelf,
        // );
        // set(
        //   perfEmpItemPerKPI[index].scores.midByDM as any,
        //   'weightScore',
        //   weightScoreDM,
        // );
        // set(
        //   perfEmpItemPerKPI[index].scores.midByAboveDM as any,
        //   'weightScore',
        //   weightScoreAboveDM,
        // );
        const kpiItems = cloneDeep(allKPI);
        const empItemIdx = currPerfEmpItems[indexEmpItem];
        const items = kpiItems[empItemIdx?.id];
        set(items[index], 'weight', weight);
        set(
          items[index].scores.midBySelf as any,
          'weightScore',
          weightScoreSelf,
        );
        set(items[index].scores.midByDM as any, 'weightScore', weightScoreDM);
        set(
          items[index].scores.midByAboveDM as any,
          'weightScore',
          weightScoreAboveDM,
        );
        onChangeScore(Object.values(PerfLevelEnum), currPerfEmpItems, kpiItems);
      }
    },
    [
      formik,
      name,
      maxKPIWeight,
      minKPIWeight,
      formType?.isMidYearScore,
      formType?.isKPIWeightCalc,
      totalWeight,
    ],
  );

  const showKPIDescPress = useCallback(() => {
    setShowKPIDesc((v) => !v);
  }, []);

  const isErrorWeight = useMemo(() => {
    return get(formik.values, `${name}.isErrorWeight`) || false;
  }, [formik.values, name]);

  const isEditableItemKPI = useMemo(() => {
    // to see APPROVAL can add/remove item KPI from apprai/se
    if (!editable) return false;
    if (level !== PerfLevelEnum.APPRAISEE && formType?.isMidYearScore) {
      return false;
    }
    return true;
  }, [formType, level, editable]);

  const isDisabledItemWeight = useMemo(() => {
    /**
     * If level not APPRAISEE then disabled
     */
    if (level !== PerfLevelEnum.APPRAISEE && formType?.isMidYearScore)
      return true;
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
    )
      return true;
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
      !perfFormTypeKPI?.typeMaxKPICount ||
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

  const isAbsoluteScoreForKPI = useMemo(() => {
    switch (level) {
      case 'APPRAISEE':
        if (
          get(formik.values, `${name}.scores.endBySelf.isAbsoluteScore`) ||
          get(formik.values, `${name}.scores.midBySelf.isAbsoluteScore`)
        )
          return true;
        else return false;
      case 'DIRECT_MANAGER':
        if (
          get(formik.values, `${name}.scores.endByDM.isAbsoluteScore`) ||
          get(formik.values, `${name}.scores.midByDM.isAbsoluteScore`)
        )
          return true;
        else return false;
      case 'ABOVE_MANAGER':
        if (
          get(formik.values, `${name}.scores.endByAboveDM.isAbsoluteScore`) ||
          get(formik.values, `${name}.scores.midByAboveDM.isAbsoluteScore`)
        )
          return true;
        else return false;
      default:
        break;
    }
  }, [formik.values, name]);

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
                        disabled
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
                    readOnly={
                      !(isEditableItemKPI && ruleFormFillKPI?.isEditable)
                    }
                    className={`bg-disable-input`}
                    isPreventEnter
                    textarea
                    isTextAreaAutoHigh={expand}
                    disabled
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
        <Table.Row
          key={`third-row-kpi-${perfEmpItemKPI?.id}`}
          className={`tr-noborder-top`}
        >
          <Table.Cell colSpan={countCell}>
            {formType?.isMidYearScore ? (
              <Segment className={`nopadding hcms-table`}>
                <Segment attached={'top'}>
                  <Header as="h3" className="nomarginb">
                    <Header.Content>
                      Scoring
                      {/* {formType?.isMidYearScore && 'Scoring &'} Comment */}
                    </Header.Content>
                  </Header>
                  {/* <div>
                  Digunakan sebagai guidance jka belum ada target spesifik yang
                  ditentukan untuk KPI
                </div> */}
                </Segment>
                <Segment clearing basic>
                  <Grid columns={'equal'}>
                    {formType?.isMidYearScore && (
                      <>
                        <Grid.Row>
                          {keyEmpMidItemPerKPIByLevels?.map((keyLevel) => (
                            <>
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
                                        <InputScorePerfMid
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
                                          editable={editable}
                                          measurementOptions={
                                            measurementOptions
                                          }
                                          measurementGrades={
                                            formType?.perfMeasurement?.grades ||
                                            []
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
                            </>
                          ))}
                        </Grid.Row>
                      </>
                    )}
                  </Grid>
                  <CommentKPI
                    formik={formik}
                    editable={editable}
                    name={name}
                    level={level}
                    expand={expand}
                    perfEmpItemKPI={perfEmpItemKPI}
                    formType={formType}
                  />
                </Segment>
              </Segment>
            ) : (
              <CommentKPI
                formik={formik}
                editable={editable}
                name={name}
                level={level}
                expand={expand}
                perfEmpItemKPI={perfEmpItemKPI}
                formType={formType}
              />
            )}
          </Table.Cell>
        </Table.Row>
      )}
    </>
  );
};

export default TablePerfFormTypeItemRowMid;
