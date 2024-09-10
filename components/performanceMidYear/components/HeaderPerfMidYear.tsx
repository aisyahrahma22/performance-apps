import React from 'react';
import {
  PerfFormProps,
  PerfProgramTimelineSeqProps,
} from '../../../lib/data/perfMidYear/interfaces/perfForm.interface';
import { Header, Icon, IconProps, Label } from 'semantic-ui-react';
import renderHyphen from '../../../lib/util/renderHyphen';
import renderEnum from '../../../lib/util/renderEnum';
import renderDate from '../../../lib/util/renderDate';

interface ModalHeaderPerfMidYearProps {
  perfForm: PerfFormProps;
  timelineSeq?: PerfProgramTimelineSeqProps;
  showIcon?: boolean;
  iconProps?: IconProps;
  iconLabel?: string;
  paTeamRecord?: boolean;
  timelineStatus?: any;
}

const ModalHeaderPerfMidYear = ({
  perfForm,
  timelineSeq,
  showIcon,
  iconProps = { name: 'edit outline' },
  iconLabel = '',
  paTeamRecord,
  timelineStatus,
}: ModalHeaderPerfMidYearProps) => {
  return (
    <div style={{ position: 'relative' }}>
      <Header as={'h3'} color="black">
        {paTeamRecord ? (
          <Icon name={'info'} circular />
        ) : (
          <Icon name={'edit'} circular />
        )}
        <Header.Content>
          {renderHyphen(perfForm?.perfFormName)}
          <Header.Subheader style={{ marginTop: '7px' }}>
            {renderHyphen(perfForm?.performanceFormCode)}
          </Header.Subheader>
        </Header.Content>
      </Header>
      <div style={{ position: 'absolute', right: 0, top: 0 }}>
        <Header as={'h3'}>
        <Label size={'small'} color={'blue'}>
          <Icon name={'check circle'} />
          {renderEnum(timelineSeq?.timeline)}
        </Label>
        <Label size={'small'}>
        {renderDate(timelineSeq?.startDate, 'dd/MM/yyyy')} -
        {renderDate(timelineSeq?.endDate, 'dd/MM/yyyy')}
        </Label>
        </Header>
      </div>
    </div>
  );
};

export default ModalHeaderPerfMidYear;
