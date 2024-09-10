import React from 'react';
import Avatar from 'react-avatar';
import { Button, Grid, Icon, List, Modal } from 'semantic-ui-react';

interface PerformanceInquiryDownloadAbsoluteScoreProps {
  data: string[];
  isOpen: boolean;
  closePress: any;
  openPress?: any;
  yesPress: any;
  isSelectedAllData: boolean;
  allCountData: number;
}

const ModalPerformanceInquiryDownloadAbsoluteScore = ({
  data,
  isOpen,
  closePress,
  yesPress,
  isSelectedAllData,
  allCountData,
}: PerformanceInquiryDownloadAbsoluteScoreProps) => {
  return (
    <Modal onClose={closePress} open={isOpen} size="tiny">
      <Modal.Header>
        <Icon name={'caret down'} inverted circular color={'black'} />
        <span style={{ marginLeft: '.7em' }}>Download Performance Analysis</span>
      </Modal.Header>
      <Modal.Content>
        <span>
          Are you sure want to download{' '}
          {isSelectedAllData
            ? `All Data on with total ${allCountData} data`
            : data.length > 1
            ? `these Data on with total ${data.length} data`
            : 'this data'}
          ?
        </span>
        {data.length <= 10 && !isSelectedAllData && (
          <List
            selection
            verticalAlign="middle"
            celled
            style={{ marginLeft: '.5em' }}
          >
            {data.map((item: any) => (
              <List.Item
                key={item.id}
                style={{ padding: '.7em .5em', border: 0 }}
              >
                <Grid>
                  <Grid.Column
                    width={'ten'}
                    style={{ marginLeft: '.7em' }}
                    verticalAlign={'middle'}
                  >
                    <List.Content>
                      <List.Header style={{ marginBottom: '.3em' }}>
                        {item?.perfForm?.performanceFormCode}
                      </List.Header>
                      {item?.employee?.fullName}
                    </List.Content>
                  </Grid.Column>
                </Grid>
              </List.Item>
            ))}
          </List>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Grid columns="equal">
          <Grid.Column>
            <Button fluid onClick={closePress}>
              No
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button fluid secondary onClick={yesPress}>
              Yes
            </Button>
          </Grid.Column>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalPerformanceInquiryDownloadAbsoluteScore;
