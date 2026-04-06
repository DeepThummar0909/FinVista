export function InvestmentItem({ investment }) {
  if (investment.type === "FD") {
    return (
      <div className="border-b pb-2 mb-2">
        <div className="font-medium">{investment.fdName}</div>
        <div className="text-sm text-muted-foreground">
          Maturity: ₹{investment.maturityValue} on {investment.endDate}
        </div>
        <div className="text-sm">Interest: {investment.interestRate}%</div>
        <div className="text-sm">Invested: ₹{investment.amount}</div>
      </div>
    );
  }

  if (investment.type === "STOCKS") {
    const isProfit = investment.pnl >= 0;
    return (
      <div className="border-b pb-2 mb-2">
        <div className="font-medium">{investment.ticker}</div>
        <div className="text-sm text-muted-foreground">
          Qty: {investment.quantity} @ ₹{investment.buyPrice}
        </div>
        <div className="text-sm">
          Current: ₹{investment.currentPrice} | Value: ₹{investment.currentValue}
        </div>
        <div className="text-sm">
          P&L:{" "}
          <span className={isProfit ? "text-green-600" : "text-red-600"}>
            ₹{investment.pnl.toLocaleString()}
          </span>
        </div>
      </div>
    );
  }

  return null;
}
