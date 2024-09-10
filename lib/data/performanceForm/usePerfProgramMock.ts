const data = [
  {
    id: 1,
    code: '123',
    name: 'Perf Program 1',
    finalResultMethod: [
      { name: 'SINGLE', id: 1 },
      { name: 'MULTIPLE', id: 1 },
    ],
    formMember: [
      { name: 'EMPLOYEE', id: 1 },
      { name: 'POSITION', id: 1 },
    ],
    startDate: '1 Janury 2022',
    endDate: '1 Desember 2022',
    formTerm: [
      { name: 'MID_END_YEAR', id: 1 },
      { name: 'END_YEAR', id: 1 },
    ],
  },
  {
    id: 2,
    code: '456',
    name: 'Perf Program 2',
    finalResultMethod: [
      { name: 'SINGLE', id: 1 },
      { name: 'MULTIPLE', id: 1 },
    ],
    formMember: [
      { name: 'EMPLOYEE', id: 1 },
      { name: 'POSITION', id: 1 },
    ],
    startDate: '1 Janury 2022',
    endDate: '1 Desember 2022',
    formTerm: [
      { name: 'MID_END_YEAR', id: 1 },
      { name: 'END_YEAR', id: 1 },
    ],
  },
];
//
export const getPerfProgramMock = () => {
  return new Promise((resolve) => {
    resolve({ data });
  }).then((data) => data);
};

const usePerfProgramMock = () => {
  return {
    performanceProgram: data,
    isPerformanceProgramLoading: false,
    isPerformanceProgramError: false,
  };
};

export default usePerfProgramMock;
