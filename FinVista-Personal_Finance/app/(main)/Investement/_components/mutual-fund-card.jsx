"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AddInvestmentModal } from "./add-investment-modal";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { bulkDelete } from "@/actions/investment";
import useFetch from "@/hooks/use-fetch";
import { Badge } from "@/components/ui/badge";

export function MutualFundCard({ mutualFunds, refreshInvestments }) {
  const [editItem, setEditItem] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const subtotal = mutualFunds.reduce(
    (sum, mf) => sum + Number(mf.amount || 0),
    0
  );

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDelete);

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.success("Mutual funds deleted successfully");
      refreshInvestments();
      setSelectedIds([]);
    }
  }, [deleted, deleteLoading]);

  const handleModalClose = () => setEditItem(null);

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const visibleIds = visibleMutualFunds.map((mf) => mf.id);
    setSelectedIds((prev) =>
      prev.length === visibleIds.length ? [] : visibleIds
    );
  };

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} mutual fund(s)?`
      )
    )
      return;
    deleteFn(selectedIds);
  };

  // Filter invalid fund names
  const visibleMutualFunds = mutualFunds.filter(
    (mf) => mf.fundName?.trim() !== ""
  );

  return (
    <Card className="w-full rounded-2xl shadow-md">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between flex-wrap gap-4 items-center">
          <div>
            <h2 className="text-xl font-semibold">🪙 Mutual Funds</h2>
            <p className="text-sm text-muted-foreground">One-time investments</p>
          </div>
          <div className="flex gap-2">
            <AddInvestmentModal
              type="MUTUAL_FUNDS"
              onAdded={refreshInvestments}
              buttonText="Add Mutual Fund"
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
        {visibleMutualFunds.length > 0 && (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={
                selectedIds.length === visibleMutualFunds.length &&
                visibleMutualFunds.length > 0
              }
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-muted-foreground">Select All</span>
          </div>
        )}

        

        {/* Mutual Fund List */}
        <div className="grid gap-4">
          {visibleMutualFunds.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No mutual funds added yet.
            </div>
          ) : (
            visibleMutualFunds.map((mf) => (
              <div
                key={mf.id}
                className="flex justify-between items-start bg-gray-50 hover:bg-white transition-all p-4 rounded-xl shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedIds.includes(mf.id)}
                    onCheckedChange={() => handleSelect(mf.id)}
                  />
                  <div className="space-y-1 text-sm">
                    <div className="font-medium text-base">{mf.fundName}</div>
                    <div className="text-muted-foreground">
                      Amount: ₹{mf.amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-muted-foreground">
                      Investment Date: {mf.investmentDate?.slice(0, 10)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      {/* Total */}
      <div className="bg-gray-50 border-t p-3 text-sm sticky bottom-0">
        <div className="flex justify-between">
          <span>Total Invested:</span>
          <span>₹{subtotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </Card>
);
}
