"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AddInvestmentModal } from "./add-investment-modal";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { bulkDelete } from "@/actions/investment";
import useFetch from "@/hooks/use-fetch";

export function FDCard({ fds, refreshInvestments }) {
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.length === visibleFDs.length ? [] : visibleFDs.map((fd) => fd.id)
    );
  };

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDelete);

  const handleBulkDelete = async () => {
    if (
      !window.confirm(`Are you sure you want to delete ${selectedIds.length} investments?`)
    )
      return;
    deleteFn(selectedIds);
  };

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.success("Investments deleted successfully");
      refreshInvestments();
      setSelectedIds([]);
    }
  }, [deleted, deleteLoading]);

  const visibleFDs = fds.filter((fd) => fd.fdName?.trim() !== "");

  const subtotal = visibleFDs.reduce((sum, fd) => sum + Number(fd.amount || 0), 0);
  const totalMaturity = visibleFDs.reduce(
    (sum, fd) => sum + Number(fd.maturityValue || 0),
    0
  );
  const pnl = totalMaturity - subtotal;

  return (
    <Card className="flex flex-col max-h-[500px] overflow-hidden shadow-md">
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Header Actions */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">💰 Fixed Deposits</h2>
            <p className="text-sm text-muted-foreground">
              Track your fixed deposit investments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AddInvestmentModal
              type="FD"
              onAdded={refreshInvestments}
              buttonText="Add FD"
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

        {/* Select All Checkbox */}
        {visibleFDs.length > 0 && (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={selectedIds.length === visibleFDs.length}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm font-medium text-muted-foreground">Select All</span>
          </div>
        )}

        {/* FD Items */}
        <div className="grid gap-4">
          {visibleFDs.length === 0 ? (
            <div className="text-muted-foreground text-sm">No FD investments yet.</div>
          ) : (
            visibleFDs.map((fd) => (
              <div
                key={fd.id}
                className="p-4 border rounded-xl bg-gray-50 hover:bg-white transition-all flex items-start justify-between gap-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedIds.includes(fd.id)}
                    onCheckedChange={() => handleSelect(fd.id)}
                  />
                  <div className="space-y-1">
                    <div className="text-base font-semibold">{fd.fdName}</div>
                    <div className="text-sm text-muted-foreground">
                      Invested: ₹{Number(fd.amount).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Maturity: ₹{Number(fd.maturityValue).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      End Date: {fd.endDate?.slice(0, 10)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Interest: {fd.interestRate}%
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <div className="bg-gray-50 border-t p-3 text-sm sticky bottom-0">
        <div className="flex justify-between">
          <span>Total Invested:</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Maturity Value:</span>
          <span>₹{totalMaturity.toLocaleString()}</span>
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
