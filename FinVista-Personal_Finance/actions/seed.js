"use server";

import { db } from "@/lib/prisma";
import { subDays } from "date-fns";

// Categories with their typical amount ranges
const CATEGORIES = {
  INCOME: [
    { name: "salary", range: [50000, 150000] },
    { name: "freelance", range: [22000, 66000] },
    { name: "investments", range: [11000, 44000] },
    { name: "other-income", range: [2200, 22000] },
  ],
  EXPENSE: [
    { name: "housing", range: [22000, 44000] },
    { name: "transportation", range: [2200, 11000] },
    { name: "groceries", range: [4400, 13200] },
    { name: "utilities", range: [2200, 6600] },
    { name: "entertainment", range: [1100, 4400] },
    { name: "food", range: [1100, 3300] },
    { name: "shopping", range: [2200, 11000] },
    { name: "healthcare", range: [2200, 22000] },
    { name: "education", range: [4400, 22000] },
    { name: "travel", range: [11000, 44000] },
  ],
};


// Helper to generate random amount within a range
function getRandomAmount(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

// Helper to get random category with amount
function getRandomCategory(type) {
  const categories = CATEGORIES[type];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const amount = getRandomAmount(category.range[0], category.range[1]);
  return { category: category.name, amount };
}

export async function seedTransactions() {
  try {
    // Create a test user
    const testUser = await db.user.create({
      data: {
        clerkUserId: "test-clerk-user-123",
        email: "test@finvista.com",
        name: "Test User",
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Test",
      },
    });

    // Create a test account for the user
    const testAccount = await db.account.create({
      data: {
        name: "Test Savings Account",
        type: "SAVINGS",
        userId: testUser.id,
        isDefault: true,
      },
    });

    const USER_ID = testUser.id;
    const ACCOUNT_ID = testAccount.id;

    // Generate 90 days of transactions
    const transactions = [];
    let totalBalance = 0;

    for (let i = 90; i >= 0; i--) {
      const date = subDays(new Date(), i);

      // Generate 1-3 transactions per day
      const transactionsPerDay = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < transactionsPerDay; j++) {
        // 40% chance of income, 60% chance of expense
        const type = Math.random() < 0.4 ? "INCOME" : "EXPENSE";
        const { category, amount } = getRandomCategory(type);

        const transaction = {
          id: crypto.randomUUID(),
          type,
          amount,
          description: `${
            type === "INCOME" ? "Received" : "Paid for"
          } ${category}`,
          date,
          category,
          status: "COMPLETED",
          userId: USER_ID,
          accountId: ACCOUNT_ID,
          createdAt: date,
          updatedAt: date,
        };

        totalBalance += type === "INCOME" ? amount : -amount;
        transactions.push(transaction);
      }
    }

    // Insert transactions in batches and update account balance
    await db.$transaction(async (tx) => {
      // Insert new transactions
      await tx.transaction.createMany({
        data: transactions,
      });

      // Update account balance
      await tx.account.update({
        where: { id: ACCOUNT_ID },
        data: { balance: totalBalance },
      });
    });

    return {
      success: true,
      message: `Created ${transactions.length} transactions for user ${testUser.email}`,
      userId: testUser.id,
      accountId: testAccount.id,
    };
  } catch (error) {
    console.error("Error seeding transactions:", error);
    return { success: false, error: error.message };
  }
}
