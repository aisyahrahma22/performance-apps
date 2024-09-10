const produceLooping = (num: number, data: any = null) => {
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(i);
  }
  return arr.map(() => data);
};

export default produceLooping;
