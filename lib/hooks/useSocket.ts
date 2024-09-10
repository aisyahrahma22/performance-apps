// import { useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { io } from 'socket.io-client';
// import { currentUserSelector } from '../slice/auth';

export enum SocketContext {
  PROGRESS = 'progress',
  REPORT_MONITORING = 'progressGenerateReportMonitoring',
  PERF_APPROVER_PA = 'progressGenerateReportListApproverPA',
}

type SocketCb = (data: any) => any;

function useSocket(_context: SocketContext, _callback: SocketCb) {
  // const currentUser = useSelector(currentUserSelector);
  // useEffect(() => {
  //   const socket = io('', {
  //     auth: { id: currentUser?.id, username: currentUser?.username },
  //     transports: ['websocket'],
  //   });
  //   socket.on(context, callback);
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [currentUser, callback]);
}

export default useSocket;
