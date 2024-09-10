import React, { useEffect, useMemo, useState } from 'react';

const SECOND = 1000;
const MINUTE = SECOND * 60;
// const HOUR = MINUTE * 60;
// const DAY = HOUR * 24;

type TimerTimeoutProps = {
  deadline: string;
};

const TimerTimeout = ({
  deadline = new Date().toString(),
}: TimerTimeoutProps) => {
  const parsedDeadline = useMemo(() => Date.parse(deadline), [deadline]);
  const [time, setTime] = useState(parsedDeadline - Date.now());

  useEffect(() => {
    const interval = setInterval(
      () => setTime(parsedDeadline - Date.now()),
      1000,
    );

    return () => clearInterval(interval);
  }, [parsedDeadline]);

  return (
    <h1>
      {Object.entries({
        min: (time / MINUTE) % 60,
        secs: (time / SECOND) % 60,
      }).map(([label, value]) => (
        <span key={label}>
          <span>{`${Math.floor(value)}`.padStart(1, '0')} </span>
          {/* <h1>2 min 30 secs</h1> */}
          <span className="text">{label} </span>
        </span>
      ))}
    </h1>
  );
};

export default TimerTimeout;
