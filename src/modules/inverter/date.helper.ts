const toDate = (ts?: { seconds: any; nanos: number }): Date | null => {
  if (!ts) return null;
  const seconds =
    typeof ts.seconds === 'object' ? ts.seconds.toNumber() : ts.seconds;
  return new Date(seconds * 1000 + Math.floor(ts.nanos / 1_000_000));
};

export default toDate;
