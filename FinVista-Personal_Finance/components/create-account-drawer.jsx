"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Wallet, Banknote } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createAccount } from "@/actions/dashboard";
import { accountSchema } from "@/app/lib/schema";
import useFetch from "@/hooks/use-fetch";

export function CreateAccountDrawer({ children }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const {
    loading: createAccountLoading,
    fn: createAccountFn,
    error,
    data: newAccount,
  } = useFetch(createAccount);

  const onSubmit = async (data) => {
    await createAccountFn(data);
  };

  useEffect(() => {
    if (newAccount) {
      toast.success("Account created successfully");
      reset();
      setOpen(false);
    }
  }, [newAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account");
    }
  }, [error]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="bg-background/90 backdrop-blur-lg rounded-t-2xl shadow-xl">
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-semibold">Create New Account</DrawerTitle>
        </DrawerHeader>
        <div className="px-5 pb-6 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Account Name */}
            <div>
              <label className="text-sm font-medium">Account Name</label>
              <div className="relative">
                <Input
                  placeholder="e.g., Main Checking"
                  {...register("name")}
                  className="pl-10"
                />
                <Wallet className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Account Type */}
            <div>
              <label className="text-sm font-medium">Account Type</label>
              <Select
                onValueChange={(value) => setValue("type", value)}
                defaultValue={watch("type")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
            </div>

            {/* Balance */}
            <div>
              <label className="text-sm font-medium">Initial Balance</label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("balance")}
                  className="pl-10"
                />
                <Banknote className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
              {errors.balance && <p className="text-xs text-red-500">{errors.balance.message}</p>}
            </div>

            {/* Default Switch */}
            <div className="flex items-center justify-between rounded-md border p-4">
              <div>
                <p className="font-medium">Set as Default</p>
                <p className="text-sm text-muted-foreground">
                  Automatically select this account for new transactions
                </p>
              </div>
              <Switch
                checked={watch("isDefault")}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-3">
              <DrawerClose asChild>
                <Button type="button" variant="ghost" className="flex-1">
                  Cancel
                </Button>
              </DrawerClose>
              <Button type="submit" className="flex-1" disabled={createAccountLoading}>
                {createAccountLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
