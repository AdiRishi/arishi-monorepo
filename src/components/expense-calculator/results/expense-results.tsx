import { Info } from "lucide-react";

interface ExpenseResultsProps {
  monthlyTotal: number;
  weeklyTotal: number;
  monthlyRentalIncome: number;
  netMonthlyExpenses: number;
  depositPercentage: number;
  interestRate: number;
}

export function ExpenseResults({
  monthlyTotal,
  weeklyTotal,
  monthlyRentalIncome,
  netMonthlyExpenses,
  depositPercentage,
  interestRate,
}: ExpenseResultsProps) {
  return (
    <div className="flex flex-col space-y-4 border-t p-4 sm:p-6">
      <div className="text-muted-foreground flex items-start gap-2 text-sm">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <span>
          Assumes {depositPercentage}% deposit and {interestRate}% variable
          interest rate
        </span>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm font-medium">
            Monthly Expenses
          </p>
          <p className="text-2xl font-bold">
            ${Math.round(monthlyTotal).toLocaleString()}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm font-medium">
            Weekly Expenses
          </p>
          <p className="text-2xl font-bold">
            ${Math.round(weeklyTotal).toLocaleString()}
          </p>
        </div>
        {monthlyRentalIncome > 0 && (
          <>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                Monthly Rental Income
              </p>
              <p className="text-2xl font-bold text-green-600">
                ${Math.round(monthlyRentalIncome).toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                Net Monthly Expenses
              </p>
              <p className="text-2xl font-bold">
                ${Math.round(netMonthlyExpenses).toLocaleString()}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
