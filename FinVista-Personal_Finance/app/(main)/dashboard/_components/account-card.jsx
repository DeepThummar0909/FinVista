"use client";

import {
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import useFetch from "@/hooks/use-fetch";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { updateDefaultAccount } from "@/actions/account";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault(); // Prevent Link from navigating

    if (isDefault) {
      toast.warning("At least one default account is required.");
      return;
    }

    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully.");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  return (
    <Card className="group relative transition-shadow hover:shadow-lg rounded-2xl overflow-hidden border border-border">
      <Link href={`/account/${id}`} className="block p-4">
        <CardHeader className="flex flex-row items-start justify-between p-0 mb-2">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold capitalize text-foreground">
              {name}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()} Account
            </p>
          </div>
          <Switch
            checked={isDefault}
            onClick={handleDefaultChange}
            disabled={updateDefaultLoading}
          />
        </CardHeader>

        <CardContent className="p-0 my-4">
          <div className="text-3xl font-bold text-primary">
            ₹{parseFloat(balance).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between text-sm text-muted-foreground p-0 pt-4 border-t mt-4">
          <div className="flex items-center gap-1">
            <ArrowUpRight className="h-4 w-4 text-green-500" />
            <span>Income</span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowDownRight className="h-4 w-4 text-red-500" />
            <span>Expense</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
