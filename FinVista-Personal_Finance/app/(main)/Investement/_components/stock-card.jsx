"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AddInvestmentModal } from "./add-investment-modal";
import { Trash2 } from "lucide-react";
import { bulkDelete } from "@/actions/investment";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function StockCard({ stocks, refreshInvestments }) {
  const [prices, setPrices] = useState({});
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const visibleStocks = stocks.filter(stock => stock.companyName?.trim() !== "");

  // Calculate totals using quantity and prices
  const subtotal = visibleStocks.reduce(
    (sum, s) => sum + Number(s.buyPrice || 0) * Number(s.quantity || 0),
    0
  );
  const totalCurrent = visibleStocks.reduce(
    (sum, s) => {
      const currentPrice = prices?.[s.ticker || s.companyName];
      return sum + (currentPrice ? Number(currentPrice) * Number(s.quantity || 0) : 0);
    },
    0
  );
  const pnl = totalCurrent - subtotal;

  useEffect(() => {
    async function fetchPrices() {
      setLoadingPrices(true);
      const symbols = visibleStocks.map((stock) => stock.ticker || stock.companyName);
      if (symbols.length === 0) {
        setPrices({});
        setLoadingPrices(false);
        return;
      }
      const res = await fetch("/api/stock-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbols }),
      });
      const data = await res.json();
      setPrices(data.prices || {});
      setLoadingPrices(false);
    }
    fetchPrices();
  }, [stocks]);

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.length === visibleStocks.length ? [] : visibleStocks.map((s) => s.id)
    );
  };

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDelete);

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} selected stocks?`)) return;
    deleteFn(selectedIds);
  };

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.success("Stocks deleted successfully");
      refreshInvestments();
      setSelectedIds([]);
    }
  }, [deleted, deleteLoading]);

  return (
    <Card className="flex flex-col max-h-[500px] overflow-hidden shadow-md">
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Header Actions */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">📈 Stocks</h2>
            <p className="text-sm text-muted-foreground">
              Track your stock investments in real-time
            </p>
          </div>
          <div className="flex gap-2">
            <AddInvestmentModal
              type="STOCKS"
              onAdded={refreshInvestments}
              buttonText="Add Stock"
            />
            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={deleteLoading}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete ({selectedIds.length})
              </Button>
            )}
          </div>
        </div>

        {/* Select All */}
        {visibleStocks.length > 0 && (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={selectedIds.length === visibleStocks.length}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm font-medium text-muted-foreground">Select All</span>
          </div>
        )}

        {/* Stock Items */}
        <div className="grid gap-4">
          {visibleStocks.length === 0 ? (
            <div className="text-muted-foreground text-sm">No stock investments yet.</div>
          ) : (
            visibleStocks.map((stock) => {
              const currentPrice = prices?.[stock.ticker || stock.companyName];
              const invested = Number(stock.buyPrice) * Number(stock.quantity);
              const currentVal = currentPrice ? Number(currentPrice) * Number(stock.quantity) : null;
              const pnl = currentVal !== null ? currentVal - invested : null;

              return (
                <div
                  key={stock.id}
                  className="p-4 rounded-xl bg-gray-50 hover:bg-white transition-all shadow-sm flex items-start justify-between gap-4"
                >
                  <div className="flex gap-3">
                    <Checkbox
                      checked={selectedIds.includes(stock.id)}
                      onCheckedChange={() => handleSelect(stock.id)}
                    />
                    <div className="space-y-1 text-sm">
                      <div className="text-base font-semibold">{stock.companyName}</div>
                      <div className="text-muted-foreground">
                        Quantity: {stock.quantity}
                      </div>
                      <div className="text-muted-foreground">
                        Buy Price: ₹{Number(stock.buyPrice).toLocaleString()}
                      </div>
                      <div className="text-muted-foreground">
                        Invested: ₹{invested.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground">
                        Current Price:{" "}
                        {loadingPrices ? (
                          <span className="text-gray-400">Loading...</span>
                        ) : currentPrice ? (
                          <>₹{Number(currentPrice).toLocaleString()}</>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </div>
                      <div className="text-muted-foreground">
                        Current P&amp;L:{" "}
                        {pnl !== null ? (
                          <span className={pnl >= 0 ? "text-green-600" : "text-red-600"}>
                            ₹{pnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </div>
                      <div className="text-muted-foreground">
                        Purchase Date: {stock.purchaseDate?.slice(0, 10)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
      <div className="bg-gray-50 border-t p-3 text-sm sticky bottom-0">
        <div className="flex justify-between">
          <span>Total Invested:</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Current Value:</span>
          <span>₹{totalCurrent.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>P&amp;L:</span>
          <span className={pnl >= 0 ? "text-green-600" : "text-red-600"}>
            {pnl >= 0 ? "+" : "-"}₹{Math.abs(pnl).toLocaleString()}
          </span>
        </div>
      </div>
    </Card>
  );
}
