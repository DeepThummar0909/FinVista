import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const data = await req.json();
  const { type, amount, name, ...extra } = data;

  // Create base investment
  const investment = await db.investment.create({
    data: {
      userId: user.id,
      type,
      amount: amount ? Number(amount) : 0,
    },
  });

  // Create type-specific record
  if (type === "FD") {
    const startDate = extra.startDate ? new Date(extra.startDate) : new Date();
    const endDate = extra.endDate ? new Date(extra.endDate) : undefined;

    let maturityValue;
    if (amount && extra.interestRate && startDate && endDate) {
      const years = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365.25);
      maturityValue = Number((amount * Math.pow(1 + extra.interestRate / 100, years)).toFixed(2));
    }

    await db.investmentFD.create({
      data: {
        id: investment.id,
        fdName: name,
        amount: amount ? Number(amount) : 0,
        interestRate: extra.interestRate ? Number(extra.interestRate) : undefined,
        startDate: startDate,
        endDate: endDate,
        maturityValue: maturityValue, // <-- Store calculated value
      },
    });
  } else if (type === "STOCKS") {
    const existingStock = await db.investmentStock.findFirst({ where: { companyName: name } });
    if (existingStock) {
      // Calculate new avg price
      const totalQty = Number(existingStock.quantity) + Number(extra.quantity);
      const totalCost = (Number(existingStock.buyPrice) * Number(existingStock.quantity)) + (Number(extra.quantity) * Number(amount));
      const avgPrice = totalCost / totalQty;
      await db.investmentStock.update({
        where: { id: existingStock.id },
        data: {
          quantity: totalQty,
          buyPrice: avgPrice,
          purchaseDate: new Date(), // or keep earliest
        },
      });
      // Update base investment amount if needed
    } else {
      await db.investmentStock.create({
        data: {
          id: investment.id,
          companyName: name,
          quantity: extra.quantity ? Number(extra.quantity) : 0,
          buyPrice:   Number(amount),
          purchaseDate: extra.purchaseDate ? new Date(extra.purchaseDate) : new Date(),
        },
      });
    }
  } else if (type === "SIP") {
    await db.investmentSIP.create({
      data: {
        id: investment.id,
        fundName: name,
        startDate: extra.startDate ? new Date(extra.startDate) : new Date(),
        isActive: extra.status === "Active",
        amount: amount ? Number(amount) : 0, // <-- ADD THIS LINE
      },
    });
  } else if (type === "MUTUAL_FUNDS") {
    await db.investmentMutualFund.create({
      data: {
        id: investment.id,
        fundName: name,
        investmentDate: extra.investmentDate ? new Date(extra.investmentDate) : new Date(),
        amount: amount ? Number(amount) : 0,
      },
    });
  }

  return NextResponse.json({ success: true });
}
