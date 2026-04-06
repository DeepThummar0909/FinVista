"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";

export function BudgetProgress({ initialBudget, currentExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  return (
    <Card className="rounded-2xl shadow-sm border border-muted bg-background">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold text-foreground">
              Monthly Budget
            </CardTitle>
            {initialBudget && !isEditing && (
              <CardDescription className="text-sm">
                ₹{currentExpenses.toFixed(2)} of ₹{initialBudget.amount.toFixed(2)} spent
              </CardDescription>
            )}
          </div>

          {!isEditing && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-7 w-7 hover:bg-accent"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {isEditing && (
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              className="w-36 text-sm"
              placeholder="Enter new amount"
              autoFocus
              disabled={isLoading}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleUpdateBudget}
                disabled={isLoading}
                className="bg-green-100 hover:bg-green-200"
              >
                <Check className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCancel}
                disabled={isLoading}
                className="bg-red-100 hover:bg-red-200"
              >
                <X className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </div>
        )}

        {initialBudget && (
          <div className="space-y-1">
            <Progress
              value={percentUsed}
              className="h-2 rounded-full"
              extraStyles={
                percentUsed >= 90
                  ? "bg-red-500"
                  : percentUsed >= 75
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }
            />
            <p className="text-xs text-muted-foreground text-right">
              {percentUsed.toFixed(1)}% used
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
