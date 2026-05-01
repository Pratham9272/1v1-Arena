export const calculateMatchPayout = (entryFee) => {
  const totalPool = entryFee * 2;
  const winnerAmount = Number((totalPool * 0.75).toFixed(2));
  const loserRefund = Number((totalPool * 0.25).toFixed(2));

  return {
    totalPool,
    winnerAmount,
    loserRefund
  };
};
