import React, { useEffect, useState } from 'react';
import { Button } from 'semantic-ui-react';

const getTime = () => new Date().getTime();
const getClock = (time: number) => new Date(time).toLocaleTimeString();

const Clock = () => {
  const [time, setTime] = useState(new Date().getTime());

  useEffect(() => {
    const tickClock = setInterval(() => {
      setTime(getTime());
    }, 1000);

    return () => {
      clearInterval(tickClock);
    };
  }, [setTime]);

  return (
    <>
      <Button circular compact inverted secondary>
        {' '}
        {getClock(time)}
      </Button>
    </>
  );
};

export default Clock;
