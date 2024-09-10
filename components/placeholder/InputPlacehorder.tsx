import { Card, Placeholder } from 'semantic-ui-react';
import React, { useMemo } from 'react';
import produceLooping from '../../lib/util/produceLooping';

const InputPlaceholder = ({ inputCount = 10 }: { inputCount: number }) => {
  const inputs = useMemo(() => {
    return produceLooping(inputCount).map((_inputNum, idx) => (
      <Card key={`row-${idx}`}>
        <Card.Content>
          <Placeholder style={{ height: 12 }}>
            <Placeholder.Image />
          </Placeholder>
        </Card.Content>
      </Card>
    ));
  }, [inputCount]);
  return <Card.Group itemsPerRow={4}>{inputs}</Card.Group>;
};

export default InputPlaceholder;
