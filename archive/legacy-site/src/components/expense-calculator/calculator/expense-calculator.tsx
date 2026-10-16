"use client";

import { ExpenseResults } from "@/components/expense-calculator/results/expense-results";
import { RepaymentGraph } from "@/components/expense-calculator/results/repayment-graph";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useExpenseCalculations } from "@/hooks/expense-calculator/use-expense-calculations";
import { Home, RotateCcw } from "lucide-react";
import { PropertyPriceSection } from "./property-price-section";
import { QuarterlyFeesSection } from "./quarterly-fees-section";
import { RentalIncomeSection } from "./rental-income-section";

export function ExpenseCalculator() {
  const calculations = useExpenseCalculations();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <Card className="mx-auto w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Property Expense Calculator
              </CardTitle>
              <CardDescription>
                Calculate your monthly and weekly property expenses
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={calculations.resetAll}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <PropertyPriceSection
            propertyPrice={calculations.propertyPrice}
            loanAmount={calculations.loanAmount}
            monthlyMortgage={calculations.monthlyMortgage}
            depositPercentage={calculations.depositPercentage}
            depositAmount={calculations.depositAmount}
            interestRate={calculations.interestRate}
            loanTermYears={calculations.loanTermYears}
            setPropertyPrice={calculations.setPropertyPrice}
            setDepositPercentage={calculations.setDepositPercentage}
            setDepositAmount={calculations.setDepositAmount}
            setInterestRate={calculations.setInterestRate}
          />

          <QuarterlyFeesSection
            strata={calculations.strata}
            council={calculations.council}
            water={calculations.water}
            setStrata={calculations.setStrata}
            setCouncil={calculations.setCouncil}
            setWater={calculations.setWater}
          />

          <RentalIncomeSection
            weeklyRent={calculations.weeklyRent}
            managementFeePercentage={calculations.managementFeePercentage}
            setWeeklyRent={calculations.setWeeklyRent}
            setManagementFeePercentage={calculations.setManagementFeePercentage}
          />
        </CardContent>

        <ExpenseResults
          monthlyTotal={calculations.monthlyTotal}
          weeklyTotal={calculations.weeklyTotal}
          monthlyRentalIncome={calculations.monthlyRentalIncome}
          netMonthlyExpenses={calculations.netMonthlyExpenses}
          depositPercentage={calculations.depositPercentage}
          interestRate={calculations.interestRate}
        />
      </Card>

      {calculations.loanAmount > 0 && (
        <RepaymentGraph
          loanAmount={calculations.loanAmount}
          monthlyMortgage={calculations.monthlyMortgage}
          interestRate={calculations.interestRate}
          loanTermYears={calculations.loanTermYears}
          additionalRepayment={calculations.additionalRepayment}
          setAdditionalRepayment={calculations.setAdditionalRepayment}
          offsetAmount={calculations.offsetAmount}
          setOffsetAmount={calculations.setOffsetAmount}
        />
      )}
    </div>
  );
}
