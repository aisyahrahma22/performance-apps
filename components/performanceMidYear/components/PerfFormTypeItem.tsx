import { FormikProps } from 'formik';
import { find, findIndex, get, toUpper } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { Button, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import { PerfEmpItemPerKPIScoreTypeEnum } from '../../../lib/data/perfMidYear/enum/perfEmp.enum';
import {
  PerfFormTypeEnum,
  PerfLevelEnum,
} from '../../../lib/data/perfMidYear/enum/perfForm.enum';
import { generatePerfEmpItemPerKPIScore } from '../../../lib/data/perfMidYear/helpers/generateInitialValuePerfEmp';
import {
  PerfEmpItemPerKPIProps,
  PerfEmpItemProps,
  PerfEmpProps,
} from '../../../lib/data/perfMidYear/interfaces/perfEmp.interface';
import {
  PerfFormTypeItemProps,
  PerfFormTypeProps,
} from '../../../lib/data/perfMidYear/interfaces/perfForm.interface';
import { MaxKPICount } from '../../../lib/enums/PerfForm';
import DropdownOptions from '../../../lib/types/DropdownOptions';
import getGuid from '../../../lib/util/getGuid';
import renderHyphen from '../../../lib/util/renderHyphen';
import TablePerfFormTypeItemEnd from '../../performanceEndYear/component/TablePerfFormTypeItemEnd';
import TablePerfFormTypeItemMid from './TablePerfFormTypeItem';

interface PerfFormTypeItemMidEndProps {
  data: PerfFormTypeItemProps;
  editable?: boolean;
  formik: FormikProps<PerfEmpProps>;
  name: string;
  formType: PerfFormTypeProps;
  level: PerfLevelEnum;
  measurementOptions: DropdownOptions[];
  isEndYear: boolean;
  isView?: boolean;
  perfEmpItemPerKPIName: string;
  onChangeScore: (
    levels: PerfLevelEnum[],
    perfEmpItems: PerfEmpItemProps[],
    perfEmpItemPerKPI: PerfEmpItemPerKPIProps[],
  ) => void;
}

const PerfFormTypeItem = ({
  data,
  editable,
  formik,
  name,
  formType,
  level,
  measurementOptions,
  isEndYear,
  onChangeScore,
  isView,
  perfEmpItemPerKPIName,
}: PerfFormTypeItemMidEndProps) => {
  const [isHide, setIsHide] = useState(false);
  const [expand, setExpand] = useState(false);
  const handleExpandTextArea = () => setExpand(!expand);
  const perfEmpItem = useMemo(() => {
    const empItems: PerfEmpItemProps[] = get(formik.values, name) || [];
    const index = findIndex(
      empItems,
      (item) => item?.perfFormTypeItemId === data?.id,
    );

    return {
      index,
      data: index < 0 ? undefined : empItems[index],
    };
  }, [formik, name, data]);
  const perfEmpItems = useMemo(() => {
    const empItems: PerfEmpItemProps[] = get(formik.values, name) || [];
    return empItems;
  }, [formik, name]);

  const itemPerKPI = useMemo(() => {
    const kpiItems: PerfEmpItemPerKPIProps[] =
      get(
        formik.values,
        `${perfEmpItemPerKPIName}[${perfEmpItem?.data?.id}]`,
      ) || [];
    return kpiItems;
  }, [formik, perfEmpItemPerKPIName, perfEmpItem]);

  const allKPI = useMemo(() => {
    const kpiItems: PerfEmpItemPerKPIProps[] =
      get(formik.values, `${perfEmpItemPerKPIName}`) || [];
    return kpiItems;
  }, [formik.values, perfEmpItemPerKPIName]);
  // console.log('formik.values', formik.values)
  const addItem = useCallback(() => {
    const empItem = perfEmpItem;
    const empItemId = empItem?.data?.id || '';
    const itemKPI: PerfEmpItemPerKPIProps = {
      id: getGuid(),
      weight: 0,
      isShowComment: true,
      isDeleted: false,
      perfEmpItemId: empItemId,
      scores: {
        midBySelf: generatePerfEmpItemPerKPIScore(
          PerfEmpItemPerKPIScoreTypeEnum.APPRAISEE,
          true,
        ),
        midByDM: generatePerfEmpItemPerKPIScore(
          PerfEmpItemPerKPIScoreTypeEnum.DIRECT_MANAGER,
          true,
        ),
        midByAboveDM: generatePerfEmpItemPerKPIScore(
          PerfEmpItemPerKPIScoreTypeEnum.ABOVE_MANAGER,
          true,
        ),
        endBySelf: generatePerfEmpItemPerKPIScore(
          PerfEmpItemPerKPIScoreTypeEnum.APPRAISEE,
          false,
        ),
        endByDM: generatePerfEmpItemPerKPIScore(
          PerfEmpItemPerKPIScoreTypeEnum.DIRECT_MANAGER,
          false,
        ),
        endByAboveDM: generatePerfEmpItemPerKPIScore(
          PerfEmpItemPerKPIScoreTypeEnum.ABOVE_MANAGER,
          false,
        ),
      },
    };

    if (empItem?.data) {
      const currEmpItemKPI = [...itemPerKPI, itemKPI];
      formik.setFieldValue(
        `${perfEmpItemPerKPIName}[${perfEmpItem?.data?.id}]`,
        currEmpItemKPI,
      );
      formik.setFieldValue(
        `${name}[${empItem?.index}].perfEmpItemPerKPIs`,
        currEmpItemKPI,
      );
    } else {
      // if current not exist emp Item
      const newEmpItem: PerfEmpItemProps = {
        id: getGuid(),
        perfFormTypeItemId: data?.id,
        perfFormTypeKRAId: data?.perfFormTypeKRA?.id,
        perfFormTypeKPIId: data?.perfFormTypeKPI?.id,
        perfFormTypeTargetId: data?.perfFormTypeTarget?.id,
        perfEmpItemPerKPIs: [itemKPI],
      };
      const empItems: PerfEmpItemProps[] = get(formik.values, name) || [];
      const currEmpItems = [...empItems, newEmpItem];
      formik.setFieldValue(name, currEmpItems);
      formik.setFieldValue(
        `${perfEmpItemPerKPIName}[${perfEmpItem?.data?.id}]`,
        [itemKPI],
      );
    }
  }, [formik, name, perfEmpItem, data]);

  const isDisableAddItem = useMemo(() => {
    if (level !== PerfLevelEnum.APPRAISEE && formType?.isMidYearScore) {
      return true;
    }

    if (!perfEmpItem?.data) return false;
    const { perfFormTypeKPI } = data;
    if (
      !perfFormTypeKPI?.isUserDefine &&
      !perfFormTypeKPI?.isSelection &&
      !perfFormTypeKPI?.isEditable &&
      !editable
    ) {
      return true;
    }

    if (perfFormTypeKPI?.typeMaxKPICount === MaxKPICount.UNLIMITED) {
      return false;
    }

    if (perfFormTypeKPI?.typeMaxKPICount === MaxKPICount.LIMITED) {
      const currVal = perfEmpItem?.data?.perfEmpItemPerKPIs;
      const maxKPI = Number(perfFormTypeKPI?.maxKPICountInput);
      if (currVal.length >= maxKPI) return true;
    }

    if (perfFormTypeKPI?.isSelection) {
      const currVal = perfEmpItem?.data?.perfEmpItemPerKPIs;
      const isNotSelect = perfFormTypeKPI?.details?.find(
        (form) => !find(currVal, (val) => form?.kpi?.id === val?.perfKPIId),
      ); // Assume KPI can't duplicate
      if (isNotSelect) return false;
      if (perfFormTypeKPI?.isEditable) return false;
      return true;
    }

    const countEmpItemKPIs = Number(
      perfEmpItem?.data?.perfEmpItemPerKPIs?.length,
    );

    const maxKPI = Number(perfFormTypeKPI?.maxKPICountInput);
    if (perfFormTypeKPI?.typeMaxKPICount === MaxKPICount.LIMITED) {
      return countEmpItemKPIs >= maxKPI;
    }

    if (
      perfFormTypeKPI?.isEditable &&
      (!perfFormTypeKPI?.typeMaxKPICount ||
        perfFormTypeKPI?.typeMaxKPICount === MaxKPICount.UNLIMITED)
    ) {
      return false;
    }
    return countEmpItemKPIs > maxKPI;
  }, [level, formType?.isMidYearScore, perfEmpItem?.data, data, editable]);

  const isEditableAddItem = useMemo(() => {
    // to see APPROVAL can add/remove item KPI from appraise
    if (!editable) return false;
    if (!isEndYear) {
      if (level === PerfLevelEnum.APPRAISEE) return true;
    }

    if (isEndYear) {
      if (level !== PerfLevelEnum.APPRAISEE) return false;
      return true;
    }
    return !formType?.isMidYearScore;
  }, [editable, isEndYear, formType?.isMidYearScore, level]);

  const { perfFormTypeKPI } = data;
  const maxKPI = perfFormTypeKPI?.maxKPICountInput || 0;
  const minKPI = perfFormTypeKPI?.minKPICountInput || 0;
  const dataKPIType = perfFormTypeKPI?.typeMaxKPICount;
  const countEmpItemKPIs = itemPerKPI?.length;

  return (
    <Segment raised>
      <Grid>
        <Grid.Row verticalAlign={'middle'}>
          <Grid.Column width={'14'}>
            <Header as={'h4'} color={'violet'}>
              {data?.type === PerfFormTypeEnum.CATEGORY
                ? toUpper(renderHyphen(data?.perfCategory?.name))
                : ''}
            </Header>
          </Grid.Column>
          <Grid.Column width={2} verticalAlign={'middle'}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              {formType?.isCategoryWeightCalc === true && (
                <Header as={'h4'} className={'mb-0'}>
                  {`Weight: ${data?.categoryWeight}%`}
                </Header>
              )}
              <Header as={'p'} floated={'right'} size="tiny" className={'mb-0'}>
                <div
                  onClick={handleExpandTextArea}
                  style={{ cursor: 'pointer' }}
                >
                  {expand ? (
                    <Icon size="large" color="green" name="expand" />
                  ) : (
                    <Icon size="large" name="compress" />
                  )}
                </div>
              </Header>
              <Button
                icon={isHide ? 'chevron down' : 'chevron up'}
                onClick={() => setIsHide(!isHide)}
                size="small"
                basic
                compact
                style={{ marginLeft: '15px' }}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {!isHide && (
        <>
          <br />
          {!isEndYear ? (
            <TablePerfFormTypeItemMid
              countEmpItemKPIs={countEmpItemKPIs}
              expand={expand}
              formTypeItem={data}
              formik={formik}
              editable={editable}
              name={name}
              perfEmpItemIndex={perfEmpItem?.index}
              perfEmpItem={perfEmpItem?.data}
              formType={formType}
              level={level}
              measurementOptions={measurementOptions}
              onChangeScore={onChangeScore}
              perfEmpItems={perfEmpItems}
              isView={isView}
              perfEmpItemPerKPIName={perfEmpItemPerKPIName}
              itemPerKPI={itemPerKPI}
              allKPI={allKPI}
            />
          ) : (
            <TablePerfFormTypeItemEnd
              countEmpItemKPIs={countEmpItemKPIs}
              expand={expand}
              formTypeItem={data}
              formik={formik}
              editable={editable}
              name={name}
              perfEmpItemIndex={perfEmpItem?.index}
              perfEmpItem={perfEmpItem?.data}
              formType={formType}
              level={level}
              measurementOptions={measurementOptions}
              onChangeScore={onChangeScore}
              perfEmpItems={perfEmpItems}
              isView={isView}
              itemPerKPI={itemPerKPI}
              perfEmpItemPerKPIName={perfEmpItemPerKPIName}
              allKPI={allKPI}
            />
          )}
          {isEditableAddItem && !isDisableAddItem && (
            <Button
              color={'purple'}
              fluid
              circular
              style={{ marginTop: '20px' }}
              onClick={addItem}
              disabled={isDisableAddItem}
            >
              {`Add ${
                dataKPIType === 'LIMITED'
                  ? ` ( Min: ${minKPI}, Max: ${maxKPI} ) `
                  : ''
              }`}
            </Button>
          )}
        </>
      )}
    </Segment>
  );
};

export default PerfFormTypeItem;
