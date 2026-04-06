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

export function SIPCard({ sips, refreshInvestments }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [editItem, setEditItem] = useState(null);

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const visible = visibleSIPs.map((sip) => sip.id);
    setSelectedIds((prev) => (prev.length === visible.length ? [] : visible));
  };

  const { loading: deleteLoading, fn: deleteFn, data: deleted } = useFetch(bulkDelete);

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} SIP(s)?`)) return;
    deleteFn(selectedIds);
  };

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.success("SIPs deleted successfully");
      refreshInvestments();
      setSelectedIds([]);
    }
  }, [deleted, deleteLoading]);

  const handleModalClose = () => setEditItem(null);

  const visibleSIPs = sips.filter((sip) => sip.fundName?.trim() !== "");
  const subtotal = visibleSIPs.reduce((sum, sip) => sum + Number(sip.amount || 0), 0);

  return (
    <Card className="w-full rounded-2xl shadow-md">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between flex-wrap gap-4 items-center">
          <div>
            <h2 className="text-xl font-semibold">📅 SIPs</h2>
            <p className="text-sm text-muted-foreground">Systematic Investment Plans</p>
          </div>
          <div className="flex gap-2">
            <AddInvestmentModal
              type="SIP"
              onAdded={refreshInvestments}
              buttonText="Add SIP"
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
        {visibleSIPs.length > 0 && (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={selectedIds.length === visibleSIPs.length}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm font-medium text-muted-foreground">Select All</span>
          </div>
        )}

        {/* SIP List */}
        <div className="grid gap-4">
          {visibleSIPs.length === 0 ? (
            <div className="text-sm text-muted-foreground">No SIPs added yet.</div>
          ) : (
            visibleSIPs.map((sip) => (
              <div
                key={sip.id}
                className="flex justify-between items-start bg-gray-50 hover:bg-white transition-all p-4 rounded-xl shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedIds.includes(sip.id)}
                    onCheckedChange={() => handleSelect(sip.id)}
                  />
                  <div className="space-y-1 text-sm">
                    <div className="font-medium text-base">{sip.fundName}</div>
                    <div className="text-muted-foreground">Amount: ₹{sip.amount}</div>
                    <div className="text-muted-foreground">
                      Start Date: {sip.startDate?.slice(0, 10)}
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2">
                      Status:{" "}
                      <Badge
                        variant="outline"
                        className={
                          sip.status?.toLowerCase() === "active"
                            ? "border-green-600 text-green-600"
                            : "border-red-600 text-red-600"
                        }
                      >
                        {sip.status}
                      </Badge>
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
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
        </div>
    </Card>
  );
}
