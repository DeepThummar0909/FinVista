"use server";

import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";


// Fetch all investments for the current user, including FD and Stock details
export async function getUserInvestments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  const investments = await db.investment.findMany({
    where: { userId: user.id },
    include: {
      fd: true,
      stock: true,
      sip: true,
      mutualFund: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Convert Decimal fields to string or number
  return investments.map((inv) => {
    const base = {
      ...inv,
      amount: inv.amount?.toString(),
      createdAt: inv.createdAt?.toISOString(),
      updatedAt: inv.updatedAt?.toISOString(),
    };

    if (inv.type === "FD" && inv.fd) {
      return {
        ...base,
        ...inv.fd,
        amount: inv.fd.amount?.toString(),
        maturityValue: inv.fd.maturityValue?.toString(), // <-- Fetch maturityValue
        interestRate: inv.fd.interestRate,
        startDate: inv.fd.startDate?.toISOString(),
        endDate: inv.fd.endDate?.toISOString(),
      };
    }
    if (inv.type === "STOCKS" && inv.stock) {
      return {
        ...base,
        ...inv.stock,
        buyPrice: inv.stock.buyPrice?.toString(),
        quantity: inv.stock.quantity?.toString(),
        purchaseDate: inv.stock.purchaseDate?.toISOString(),
      };
    }
    if (inv.type === "SIP" && inv.sip) {
      return {
        ...base,
        ...inv.sip,
        amount: inv.sip.amount?.toString(), // Use inv.sip.amount
        startDate: inv.sip.startDate?.toISOString(),
        status: inv.sip.isActive ? "Active" : "Inactive", // Map isActive to status
      };
    }
    if (inv.type === "MUTUAL_FUNDS" && inv.mutualFund) {
      return {
        ...base,
        ...inv.mutualFund,
        amount: inv.mutualFund.amount?.toString(), // Use inv.mutualFund.amount
        investmentDate: inv.mutualFund.investmentDate?.toISOString(),
      };
    }
    return base;
  });
}

export async function POST(req) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const data = await req.json();
  const { type, amount, name, ...extra } = data;

  let investment;

  switch (type) {
    case "FD":
      investment = await db.investment.create({
        data: {
          userId: user.id,
          type,
          amount: new Prisma.Decimal(amount),
          fd: {
            create: {
              fdName: name,
              startDate: new Date(extra.startDate),
              endDate: new Date(extra.endDate),
              interestRate: Number(extra.interestRate),
              maturityValue: new Prisma.Decimal(extra.maturityValue || 0),
            },
          },
        },
        include: { fd: true },
      });
      break;

    case "STOCKS":
      investment = await db.investment.create({
        data: {
          userId: user.id,
          type,
          amount: new Prisma.Decimal(amount),
          stock: {
            create: {
              companyName: name,
              ticker: extra.ticker,
              quantity: Number(extra.quantity),
              buyPrice: new Prisma.Decimal(extra.buyPrice),
              purchaseDate: new Date(extra.purchaseDate),
            },
          },
        },
        include: { stock: true },
      });
      break;

    case "SIP":
      investment = await db.investment.create({
        data: {
          userId: user.id,
          type,
          amount: new Prisma.Decimal(amount),
          sip: {
            create: {
              name: name,
              startDate: new Date(extra.startDate),
              isActive: extra.status === "Active",
            },
          },
        },
        include: { sip: true },
      });
      break;

    case "MUTUAL_FUNDS":
      investment = await db.investment.create({
        data: {
          userId: user.id,
          type,
          amount: new Prisma.Decimal(amount),
          mutualFund: {
            create: {
              fundName: name,
              investmentDate: new Date(extra.investmentDate),
            },
          },
        },
        include: { mutualFund: true },
      });
      break;

    default:
      return NextResponse.json({ error: "Invalid investment type" }, { status: 400 });
  }

  revalidatePath("/Investement");
  return NextResponse.json({ investment });
}

export async function bulkDelete(InvestmentIds) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Get transactions to calculate balance changes
    const transactions = await db.investment.findMany({
      where: {
        id: { in: InvestmentIds },
        userId: user.id,
      },
    });

    // Delete transactions and update account balances in a transaction
    await db.$transaction(async (tx) => {
      // Delete transactions
      await tx.investment.deleteMany({
        where: {
          id: { in: InvestmentIds },
          userId: user.id,
        },
      });

      
      
    });

    revalidatePath("/Investement");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
