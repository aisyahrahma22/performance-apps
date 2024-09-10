import React, { useState } from 'react';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid/Grid';
import Dropdown, {
  DropdownProps,
} from 'semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown';

import { PerfGoalSettingHistory } from '../../../lib/data/performanceGoalSettingHistory/usePerfGoalSettingHistory';
import usePerfGoalSettingHistoryDetail from '../../../lib/data/performanceGoalSettingHistory/usePerfGoalSettingHistoryDetail';

import { PerfGoalSettingHistoryPositionEnum } from '../../../lib/enums/GoalSetting';

import { PerfEmpItem } from '../../performanceGoalSetting/types/goalSettingTypes';

import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form/Form';

interface CategorySectionProps {
  perfTypeData: any;
  perfEmpItemObjArr: PerfEmpItem[];
  perfGoalSettingHistory: PerfGoalSettingHistory[];
}

function CategoryPerformanceSection({
  perfTypeData,
  perfEmpItemObjArr,
  perfGoalSettingHistory,
}: CategorySectionProps) {
  const [selectedLeftHistory, setSelectedLeftHistory] = useState<string>('');
  const [selectedRightHistory, setSelectedRightHistory] = useState<string>('');

  const {
    perfGoalSettingHistoryDetail: leftHistoryDetail,
    isPerfGoalSettingHistoryDetailLoading: isLeftHistoryDetailLoading,
  } = usePerfGoalSettingHistoryDetail(selectedLeftHistory as string);

  const {
    perfGoalSettingHistoryDetail: rightHistoryDetail,
    isPerfGoalSettingHistoryDetailLoading: isRightHistoryDetailLoading,
  } = usePerfGoalSettingHistoryDetail(selectedRightHistory as string);

  const leftHistoryDropdownOptions = perfGoalSettingHistory.map((value) => ({
    key: value.id,
    text: value.value,
    value: value.id,
  }));

  const rightHistoryDropdownOption = perfGoalSettingHistory
    .filter((value) => value.id !== selectedLeftHistory)
    .map((value) => ({
      key: value.id,
      text: value.value,
      value: value.id,
    }));

  const [perfHistPos, setPerfHistPos] =
    useState<PerfGoalSettingHistoryPositionEnum>();

  return (
    <Grid>
      {/* Changes legends component */}
      <Grid.Row>
        <Grid.Column>
          <span className="mr-1">
            <Icon name={'circle'} className="remove-color" /> Removed
          </span>
          <span className="mr-1">
            <Icon name={'circle'} className="add-color" /> Added
          </span>
          <span className="mr-1">
            <Icon name={'circle'} className="change-color" /> Changed
          </span>
          <span className="mr-1">
            <Icon name={'circle outline'} className="no-change-color" />
            No Changed
          </span>
        </Grid.Column>
      </Grid.Row>
      {/* Changes dropdown component */}
      <Grid.Row columns={'equal'}>
        <Grid.Column floated="left">
          <Form.Field>
            <label>From</label>
            <Dropdown
              fluid
              placeholder={`Select the version history`}
              selectOnBlur={false}
              options={leftHistoryDropdownOptions}
              // onChange={(_, data) => handleSelectLeftPerfHistory(data)}
              value={selectedLeftHistory}
              selection
              search
              allowAdditions
            />
          </Form.Field>
        </Grid.Column>
        <Grid.Column floated="left">
          <Form.Field>
            <label>To</label>
            <Dropdown
              fluid
              placeholder={`Select the version history`}
              selectOnBlur={false}
              options={rightHistoryDropdownOption}
              // onChange={(_, data) => handleSelectRightPerfHistory(data)}
              value={selectedRightHistory}
              selection
              search
              allowAdditions
              disabled={!selectedLeftHistory}
            />
          </Form.Field>
        </Grid.Column>
      </Grid.Row>
      {/* Category item section */}
    </Grid>
  );
}

export default CategoryPerformanceSection;
