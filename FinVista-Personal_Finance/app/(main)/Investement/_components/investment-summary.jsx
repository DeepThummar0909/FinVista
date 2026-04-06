"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // for conditional classnames (if not available, replace with manual classes)

export function InvestmentSummary({ investments }) {
  const [stockPrices, setStockPrices] = useState({});
  const [loadingPrices, setLoadingPrices] = useState(false);

  // Filter valid stocks
  const stocks = investments.filter(
    (inv) => inv.type === "STOCKS" && inv.companyName?.trim()
  );

  // Fetch stock prices
  useEffect(() => {
    async function fetchPrices() {
      setLoadingPrices(true);
      const symbols = stocks.map((stock) => stock.ticker || stock.companyName);
      if (symbols.length === 0) {
        setStockPrices({});
        setLoadingPrices(false);
        return;
      }

      const res = await fetch("/api/stock-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbols }),
      });

      const data = await res.json();
      setStockPrices(data.prices || {});
      setLoadingPrices(false);
    }

    fetchPrices();
  }, [JSON.stringify(stocks.map((s) => s.ticker || s.companyName))]);

  // Totals
  const totalInvestedStocks = stocks.reduce(
    (sum, s) => sum + (Number(s.buyPrice || 0) * Number(s.quantity || 0)),
    0
  );

  const totalStockPnL = stocks.reduce((sum, stock) => {
    const price = stockPrices?.[stock.ticker || stock.companyName];
    if (!price) return sum;
    return (
      sum +
      (Number(price) - Number(stock.buyPrice)) * Number(stock.quantity || 0)
    );
  }, 0);

  const totalInvestedFD = investments
    .filter((inv) => inv.type === "FD")
    .reduce((sum, fd) => sum + Number(fd.amount || 0), 0);

  const totalFDMaturity = investments
    .filter((inv) => inv.type === "FD")
    .reduce((sum, fd) => sum + Number(fd.maturityValue || 0), 0);

  const totalInvestedSIP = investments
    .filter((inv) => inv.type === "SIP")
    .reduce((sum, sip) => sum + Number(sip.amount || 0), 0);

  const totalInvestedMF = investments
    .filter((inv) => inv.type === "MUTUAL_FUNDS")
    .reduce((sum, mf) => sum + Number(mf.amount || 0), 0);

  const totalInvested =
    totalInvestedFD + totalInvestedStocks + totalInvestedSIP + totalInvestedMF;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Invested */}
      <Card>
        <CardContent className="p-4 space-y-1">
          <div className="text-sm text-muted-foreground">Total Invested</div>
          <div className="text-2xl font-bold">
            ₹{totalInvested.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </div>
        </CardContent>
      </Card>

      {/* FD Maturity */}
      <Card>
        <CardContent className="p-4 space-y-1">
          <div className="text-sm text-muted-foreground">FD Maturity Value</div>
          <div className="text-2xl font-bold">
            ₹{totalFDMaturity.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </div>
        </CardContent>
      </Card>

      {/* Stock P&L */}
      <Card>
        <CardContent className="p-4 space-y-1">
          <div className="text-sm text-muted-foreground">Total Stock P&L</div>
          <div
            className={cn(
              "text-2xl font-bold",
              loadingPrices
                ? "text-gray-400"
                : totalStockPnL >= 0
                ? "text-green-600"
                : "text-red-600"
            )}
          >
            {loadingPrices ? (
              "Loading..."
            ) : (
              <>₹{totalStockPnL.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
