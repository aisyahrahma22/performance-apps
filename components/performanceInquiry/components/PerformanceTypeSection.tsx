import React, { useCallback } from 'react';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid/Grid';
// import Form from 'semantic-ui-react/dist/commonjs/collections/Form/Form';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button/Button';

import {
  PerfEmpItem,
  PerfEmpItemType,
} from '../../performanceGoalSetting/types/goalSettingTypes';

import PerformanceCategorySection from './PerformanceCategorySection';

interface PerformanceTypeSectionProps {
  perfEmpItemTypeObjArr: PerfEmpItemType[];
  activeIndex: string;
  setActiveIndex: React.Dispatch<React.SetStateAction<string>>;
}

export default function PerformanceTypeSection({
  perfEmpItemTypeObjArr,
  activeIndex,
  setActiveIndex,
}: PerformanceTypeSectionProps) {
  // local state of dataPerfType[dataPerfTypeIdx].isKRA
  const isDataPerfTypeHasKRA = useCallback(
    (perfEmpItemTypeIdx: number) =>
      perfEmpItemTypeObjArr[perfEmpItemTypeIdx].perfFormType.isKRA,
    [perfEmpItemTypeObjArr],
  );
  // local state of dataPerfType[dataPerfTypeIdx].isTarget
  const isDataPerfTypeHasTarget = useCallback(
    (perfEmpItemTypeIdx: number) =>
      perfEmpItemTypeObjArr[perfEmpItemTypeIdx].perfFormType.isTarget,
    [perfEmpItemTypeObjArr],
  );
  // local state of dataPerfType[dataPerfTypeIdx].isCategoryWeightCalc
  const isDataPerfTypeHasCategoryWeightCalc = useCallback(
    (perfEmpItemTypeIdx: number) =>
      perfEmpItemTypeObjArr[perfEmpItemTypeIdx].perfFormType
        .isCategoryWeightCalc,
    [perfEmpItemTypeObjArr],
  );

  return (
    <Grid style={{ marginBottom: '10vh' }}>
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
          {/* Goal Setting Component */}
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
                        <PerformanceCategorySection
                          key={perfEmpItem?.id}
                          perfEmpItemTypeIdx={perfEmpItemTypeIdx}
                          perfEmpItemIdx={perfEmpItemIdx}
                          perfEmpItemObj={perfEmpItem}
                          isDataPerfTypeHasKRA={isDataPerfTypeHasKRA}
                          isDataPerfTypeHasTarget={isDataPerfTypeHasTarget}
                          isDataPerfTypeHasCategoryWeightCalc={
                            isDataPerfTypeHasCategoryWeightCalc
                          }
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
