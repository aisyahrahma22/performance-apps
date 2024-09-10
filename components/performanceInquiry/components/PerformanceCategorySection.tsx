import React, { useMemo } from 'react';

import Table from 'semantic-ui-react/dist/commonjs/collections/Table/Table';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header/Header';
import Segment from 'semantic-ui-react/dist/commonjs/elements/Segment/Segment';

import { PerfEmpItem } from '../../performanceGoalSetting/types/goalSettingTypes';
import renderHyphen from '../../../lib/util/renderHyphen';
import TotalWeightPerCategory from '../../performanceGoalSetting/components/TotalWeightPerCategory';

interface PerformanceCategorySectionProps {
  perfEmpItemTypeIdx: number;
  perfEmpItemIdx: number;
  perfEmpItemObj: PerfEmpItem;
  isDataPerfTypeHasKRA?: (perfEmpItemTypeIdx: number) => boolean;
  isDataPerfTypeHasTarget?: (perfEmpItemTypeIdx: number) => boolean;
  isDataPerfTypeHasCategoryWeightCalc?: (perfEmpItemTypeIdx: number) => boolean;
}

export default function PerformanceCategorySection({
  perfEmpItemTypeIdx,
  perfEmpItemObj,
  isDataPerfTypeHasKRA,
  isDataPerfTypeHasTarget,
  isDataPerfTypeHasCategoryWeightCalc,
}: PerformanceCategorySectionProps) {
  const categoryType = useMemo(
    () => perfEmpItemObj.perfFormTypeItem.type,
    [perfEmpItemObj.perfFormTypeItem.type],
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

  const isDataTargetDetailsAvailable = useMemo(
    () => perfEmpItemObj?.perfFormTypeTarget?.dataTargetDetails?.length > 0,
    [perfEmpItemObj?.perfFormTypeTarget?.dataTargetDetails?.length],
  );

  const isCategoryHasCategoryWeightCalc = useMemo(
    () => isDataPerfTypeHasCategoryWeightCalc?.(perfEmpItemTypeIdx),
    [isDataPerfTypeHasCategoryWeightCalc, perfEmpItemTypeIdx],
  );

  return (
    <>
      <Segment>
        <Header as={'p'} color={'blue'} floated={'left'} size="tiny">
          {categoryType === 'CATEGORY' &&
            perfEmpItemObj?.perfFormTypeItem?.perfCategory?.name}
        </Header>
        {categoryType === 'CATEGORY' && (
          <Header floated={'right'} size="tiny">
            <p>
              Weight:&nbsp;{perfEmpItemObj?.perfFormTypeItem?.categoryWeight}%
            </p>
          </Header>
        )}
        <br />
        <div>
          <Table color={'blue'} compact>
            {/* The header of perf employee goal setting table */}
            <Table.Header>
              <Table.Row>
                {/* KRA header column */}
                {isCategoryHasKRA && (
                  <Table.HeaderCell
                    singleLine
                    width={
                      isCategoryHasTarget && isDataTargetDetailsAvailable
                        ? 6
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
                  width={6}
                  attribute={'kpi'}
                  name={'KPI'}
                >
                  Key Performance Indicator (KPI)
                </Table.HeaderCell>
                {/* Target header column */}
                {isCategoryHasTarget && (
                  <Table.HeaderCell
                    singleLine
                    width={
                      isCategoryHasKRA && isDataKRADetailsAvailable ? 6 : 4
                    }
                    attribute={'target'}
                    name={'Target'}
                  >
                    Target
                  </Table.HeaderCell>
                )}
                {/* Weight header column */}
                <Table.HeaderCell
                  singleLine
                  width={2}
                  attribute={'weight'}
                  name={'Weight'}
                >
                  Weight(%)
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            {/* The body/content of perf employee goal setting table */}
            <Table.Body>
              {perfEmpItemObj?.perfEmpItemPerKPI?.map(
                (data: any, _: number) => (
                  <Table.Row key={data.id}>
                    {isCategoryHasKRA && (
                      <Table.Cell>
                        {renderHyphen(data.kra ? data.kra : data.perfKRA?.name)}
                      </Table.Cell>
                    )}
                    <Table.Cell>
                      {renderHyphen(data.kpi ? data.kpi : data.perfKPI?.name)}
                    </Table.Cell>
                    {isCategoryHasTarget && (
                      <Table.Cell>
                        {renderHyphen(
                          data.target ? data.target : data.perfTarget?.name,
                        )}
                      </Table.Cell>
                    )}
                    <Table.Cell>{renderHyphen(data.weight)}</Table.Cell>
                  </Table.Row>
                ),
              )}
            </Table.Body>

            {/* Footer to display total weight */}
            <TotalWeightPerCategory
              perfEmpItemObj={perfEmpItemObj}
              isKRA={isCategoryHasKRA}
              isTarget={isCategoryHasTarget}
              totalGoalSettingItem={
                perfEmpItemObj?.perfEmpItemPerKPI?.length || 0
              }
              isCategoryHasCategoryWeightCalc={isCategoryHasCategoryWeightCalc}
              onViewDetail
            />
          </Table>
        </div>
      </Segment>
    </>
  );
}
