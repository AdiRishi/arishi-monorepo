import type { Metadata } from "next";
import { ExpenseCalculator } from "@/components/expense-calculator/calculator";

export const metadata: Metadata = {
  title: "Home Loan Expense Calculator",
  description:
    "Calculate your monthly and weekly property expenses, repayments, and more.",
};

export default function HomeLoanExpenseCalculatorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 font-[family-name:var(--font-geist-sans)] sm:p-8 md:p-24">
      <ExpenseCalculator />
    </main>
  );
}
