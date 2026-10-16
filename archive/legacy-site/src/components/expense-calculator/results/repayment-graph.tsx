"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRepaymentCalculations } from "@/hooks/expense-calculator/use-repayment-calculations";
import { handleInputChange, handleInputBlur } from "@/lib/input-utils";
import { TrendingDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

interface RepaymentGraphProps {
  loanAmount: number;
  monthlyMortgage: number;
  interestRate: number;
  loanTermYears: number;
  additionalRepayment: number;
  setAdditionalRepayment: React.Dispatch<React.SetStateAction<number>>;
  offsetAmount: number;
  setOffsetAmount: React.Dispatch<React.SetStateAction<number>>;
}

export function RepaymentGraph({
  loanAmount,
  monthlyMortgage,
  interestRate,
  loanTermYears,
  additionalRepayment,
  setAdditionalRepayment,
  offsetAmount,
  setOffsetAmount,
}: RepaymentGraphProps) {
  const chartConfig = {
    standardBalance: {
      label: "Standard",
      color: "var(--chart-1)",
    },
    withExtraBalance: {
      label: "Extra",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const { repaymentData, loanMetrics } = useRepaymentCalculations(
    loanAmount,
    monthlyMortgage,
    interestRate,
    loanTermYears,
    additionalRepayment,
    offsetAmount,
  );

  if (loanAmount <= 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Loan Repayment Schedule
            </CardTitle>
            <CardDescription>Track your loan balance over time</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="additional-repayment">
              Additional Monthly Repayment ($)
            </Label>
            <Input
              id="additional-repayment"
              type="text"
              min="0"
              placeholder="0"
              value={additionalRepayment.toLocaleString()}
              onChange={handleInputChange(setAdditionalRepayment)}
              onBlur={handleInputBlur}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="offset-amount">Offset Account Balance ($)</Label>
            <Input
              id="offset-amount"
              type="text"
              min="0"
              placeholder="0"
              value={offsetAmount.toLocaleString()}
              onChange={handleInputChange(setOffsetAmount)}
              onBlur={handleInputBlur}
            />
          </div>
        </div>

        {/* Loan Summary Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your monthly repayments</h3>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Row 1 */}
              <div>
                <p className="text-muted-foreground text-xs">
                  Principal and interest repayments
                </p>
                <p className="text-lg font-bold">
                  ${monthlyMortgage.toFixed(0)}
                </p>
                {additionalRepayment > 0 && (
                  <p className="text-muted-foreground text-xs">
                    + ${additionalRepayment.toLocaleString()} extra
                  </p>
                )}
                {offsetAmount > 0 && (
                  <p className="text-muted-foreground text-xs">
                    ${offsetAmount.toLocaleString()} offset account
                  </p>
                )}
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Interest rate</p>
                <p className="text-lg font-bold">
                  {interestRate.toFixed(2)} % p.a
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">
                  Total loan repayments (standard)
                </p>
                <p className="text-lg font-bold">
                  $
                  {Math.round(
                    loanMetrics.standardTotalRepayments,
                  ).toLocaleString()}
                </p>
              </div>

              {/* Row 2 */}
              <div>
                <p className="text-muted-foreground text-xs">
                  Total interest charged (standard)
                </p>
                <p className="text-lg font-bold">
                  $
                  {Math.round(
                    loanMetrics.standardTotalInterest,
                  ).toLocaleString()}
                </p>
              </div>

              {additionalRepayment > 0 && (
                <>
                  <div>
                    <p className="text-muted-foreground text-xs">
                      Total loan repayments (extra)
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      $
                      {Math.round(
                        loanMetrics.extraTotalRepayments,
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-xs">
                      Total interest charged (extra)
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      $
                      {Math.round(
                        loanMetrics.extraTotalInterest,
                      ).toLocaleString()}
                    </p>
                  </div>
                </>
              )}

              {/* Row 3 (only show if there are savings) */}
              {additionalRepayment > 0 && loanMetrics.interestSaved > 0 && (
                <div>
                  <p className="text-muted-foreground text-xs">
                    Total interest saved
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    ${Math.round(loanMetrics.interestSaved).toLocaleString()}
                  </p>
                </div>
              )}

              {additionalRepayment > 0 &&
                (loanMetrics.timeSavedYears > 0 ||
                  loanMetrics.timeSavedMonths > 0) && (
                  <div>
                    <p className="text-muted-foreground text-xs">
                      Loan term reduction
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      {loanMetrics.timeSavedYears > 0 &&
                        `${loanMetrics.timeSavedYears} year${loanMetrics.timeSavedYears !== 1 ? "s" : ""}`}
                      {loanMetrics.timeSavedYears > 0 &&
                        loanMetrics.timeSavedMonths > 0 &&
                        ", "}
                      {loanMetrics.timeSavedMonths > 0 &&
                        `${loanMetrics.timeSavedMonths} month${loanMetrics.timeSavedMonths !== 1 ? "s" : ""}`}
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <AreaChart
            accessibilityLayer
            data={repaymentData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient
                id="fillStandardBalance"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-standardBalance)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-standardBalance)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="fillWithExtraBalance"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-withExtraBalance)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-withExtraBalance)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  className="min-w-[12rem] [&_.flex.justify-between]:justify-start [&_.flex.justify-between]:gap-4"
                />
              }
            />
            <Area
              dataKey="standardBalance"
              type="natural"
              fill="url(#fillStandardBalance)"
              stroke="var(--color-standardBalance)"
              strokeWidth={2}
            />
            {additionalRepayment > 0 && (
              <Area
                dataKey="withExtraBalance"
                type="natural"
                fill="url(#fillWithExtraBalance)"
                stroke="var(--color-withExtraBalance)"
                strokeWidth={2}
              />
            )}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
