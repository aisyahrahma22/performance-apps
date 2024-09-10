import { FormikProps } from 'formik';
import React, { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';

import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid/Grid';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';

import {
  PerfEmpItem,
  PerfEmpItemType,
  PerfEmployee,
} from '../types/goalSettingTypes';

import { RenderGuard } from '../../RenderGuard';
import { RightEnum } from '../../../lib/enums/RightEnum';
import { PerfLevelEnum } from '../../../lib/data/perfMidYear/enum/perfForm.enum';

const CategorySection = dynamic(() => import('./CategorySection'));

interface PerfTypeSectionProps {
  onViewDetail: boolean;
  formik: FormikProps<PerfEmployee>;
  perfEmpItemTypeObjArr: PerfEmpItemType[] | undefined;
  activeIndex: string;
  setActiveIndex: React.Dispatch<React.SetStateAction<string>>;
  perfGoalSettingId: string | undefined;
  level: PerfLevelEnum;
}

export default function PerfTypeSection({
  onViewDetail,
  formik,
  perfEmpItemTypeObjArr,
  activeIndex,
  setActiveIndex,
  perfGoalSettingId,
  level,
}: PerfTypeSectionProps) {
  // local state of dataPerfType[dataPerfTypeIdx].isKRA
  const isDataPerfTypeHasKRA = useCallback(
    (perfEmpItemTypeIdx: number) =>
      !!perfEmpItemTypeObjArr?.[perfEmpItemTypeIdx]?.perfFormType?.isKRA,
    [perfEmpItemTypeObjArr],
  );
  // local state of dataPerfType[dataPerfTypeIdx].isTarget
  const isDataPerfTypeHasTarget = useCallback(
    (perfEmpItemTypeIdx: number) =>
      !!perfEmpItemTypeObjArr?.[perfEmpItemTypeIdx]?.perfFormType?.isTarget,
    [perfEmpItemTypeObjArr],
  );
  // local state of dataPerfType[dataPerfTypeIdx].isCategoryWeightCalc
  const isDataPerfTypeHasCategoryWeightCalc = useCallback(
    (perfEmpItemTypeIdx: number) =>
      !!perfEmpItemTypeObjArr?.[perfEmpItemTypeIdx]?.perfFormType
        ?.isCategoryWeightCalc,
    [perfEmpItemTypeObjArr],
  );

  // goal setting history state modal
  const [isModalPerfGoalSettingHistory, setIsModalPerfGoalSettingHistory] =
    useState(false);
  const [modalPerfGoalSettingData, setModalPerfGoalSettingData] =
    useState<any>(null);

  // open goal setting history modal
  const modalPerfGoalSettingHistoryOpenPress = useCallback(
    (perfGoalSettingId) => () => {
      setModalPerfGoalSettingData(perfGoalSettingId);
      setIsModalPerfGoalSettingHistory((prev) => !prev);
    },
    [],
  );

  // close goal setting modal
  const modalPerfGoalSettingHistoryClosePress = useCallback(() => {
    setIsModalPerfGoalSettingHistory((prev) => !prev);
  }, []);

  return (
    <Grid>
      {perfEmpItemTypeObjArr && (
        <>
          {/* Tab Component */}
          <Grid.Row columns={'4'}>
            {perfEmpItemTypeObjArr.map((tab: PerfEmpItemType) => (
              <Grid.Column key={`grid-column-perf-type-${tab.id}`}>
                <Button
                  color="blue"
                  fluid
                  inverted={activeIndex !== `${tab.id}`}
                  onClick={() => {
                    setActiveIndex(`${tab.id}`);
                  }}
                  circular
                >
                  {tab.perfFormType.perfTypeId.name}
                </Button>
              </Grid.Column>
            ))}
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              {perfEmpItemTypeObjArr.map(
                (perfEmpItemType, perfEmpItemTypeIdx) => (
                  <div
                    key={perfEmpItemType.id}
                    className={
                      perfEmpItemType.id !== activeIndex ? 'display-none' : ''
                    }
                  >
                    {perfEmpItemType.perfEmpItem.map(
                      (perfEmpItem: PerfEmpItem, perfEmpItemIdx) => (
                        <CategorySection
                          key={perfEmpItem?.id}
                          onViewDetail={onViewDetail}
                          formik={formik}
                          perfEmpItemTypeId={perfEmpItemType.id}
                          perfEmpItemTypeIdx={perfEmpItemTypeIdx}
                          perfEmpItemIdx={perfEmpItemIdx}
                          perfEmpItemObj={perfEmpItem}
                          isDataPerfTypeHasKRA={isDataPerfTypeHasKRA}
                          isDataPerfTypeHasTarget={isDataPerfTypeHasTarget}
                          isDataPerfTypeHasCategoryWeightCalc={
                            isDataPerfTypeHasCategoryWeightCalc
                          }
                          level={level}
                        />
                      ),
                    )}
                  </div>
                ),
              )}
            </Grid.Column>
          </Grid.Row>
        </>
      )}
    </Grid>
  );
}
