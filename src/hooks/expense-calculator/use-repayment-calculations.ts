import { useMemo } from "react";

export interface RepaymentData {
  year: number;
  standardBalance: number;
  withExtraBalance: number;
}

export interface LoanMetrics {
  standardTotalRepayments: number;
  standardTotalInterest: number;
  extraTotalRepayments: number;
  extraTotalInterest: number;
  timeSavedYears: number;
  timeSavedMonths: number;
  interestSaved: number;
  standardTermMonths: number;
  extraTermMonths: number;
}

export interface RepaymentCalculations {
  repaymentData: RepaymentData[];
  loanMetrics: LoanMetrics;
}

export function useRepaymentCalculations(
  loanAmount: number,
  monthlyMortgage: number,
  interestRate: number,
  loanTermYears: number,
  additionalRepayment: number,
  offsetAmount: number = 0,
): RepaymentCalculations {
  const repaymentData = useMemo(() => {
    if (loanAmount <= 0 || monthlyMortgage <= 0) {
      return [];
    }

    const monthlyRate = interestRate / 100 / 12;

    // Check if the monthly payment is sufficient to cover interest
    // Use effective balance (loan - offset) for interest calculation
    const effectiveBalance = Math.max(0, loanAmount - offsetAmount);
    const initialMonthlyInterest = effectiveBalance * monthlyRate;
    if (monthlyMortgage <= initialMonthlyInterest) {
      return []; // Return empty data if payment is insufficient
    }

    const data: RepaymentData[] = [];

    // Calculate standard repayment schedule
    let standardBalance = loanAmount;
    let withExtraBalance = loanAmount;

    for (let year = 0; year <= loanTermYears; year++) {
      data.push({
        year,
        standardBalance: Math.max(0, Math.round(standardBalance)),
        withExtraBalance: Math.max(0, Math.round(withExtraBalance)),
      });

      // Stop if both balances are zero
      if (standardBalance <= 0 && withExtraBalance <= 0) {
        break;
      }

      // Calculate 12 months of payments for this year
      for (let month = 0; month < 12; month++) {
        // Standard repayment
        if (standardBalance > 0) {
          // Interest is calculated on (balance - offset), but offset doesn't reduce the actual balance
          const effectiveStandardBalance = Math.max(
            0,
            standardBalance - offsetAmount,
          );
          const standardInterestPayment =
            effectiveStandardBalance * monthlyRate;
          const standardPrincipalPayment =
            monthlyMortgage - standardInterestPayment;

          if (standardPrincipalPayment <= 0) break; // Safety check for negative amortization

          standardBalance = Math.max(
            0,
            standardBalance - standardPrincipalPayment,
          );
        }

        // With additional repayment
        if (withExtraBalance > 0) {
          // Interest is calculated on (balance - offset), but offset doesn't reduce the actual balance
          const effectiveExtraBalance = Math.max(
            0,
            withExtraBalance - offsetAmount,
          );
          const extraInterestPayment = effectiveExtraBalance * monthlyRate;
          const extraPrincipalPayment =
            monthlyMortgage - extraInterestPayment + additionalRepayment;

          if (extraPrincipalPayment <= 0) break; // Safety check for negative amortization

          withExtraBalance = Math.max(
            0,
            withExtraBalance - extraPrincipalPayment,
          );
        }

        // Stop early if both loans are paid off
        if (standardBalance <= 0 && withExtraBalance <= 0) {
          break;
        }
      }
    }

    return data;
  }, [
    loanAmount,
    monthlyMortgage,
    interestRate,
    loanTermYears,
    additionalRepayment,
    offsetAmount,
  ]);

  const loanMetrics = useMemo(() => {
    if (loanAmount <= 0 || monthlyMortgage <= 0) {
      return {
        standardTotalRepayments: 0,
        standardTotalInterest: 0,
        extraTotalRepayments: 0,
        extraTotalInterest: 0,
        timeSavedYears: 0,
        timeSavedMonths: 0,
        interestSaved: 0,
        standardTermMonths: 0,
        extraTermMonths: 0,
      };
    }

    const monthlyRate = interestRate / 100 / 12;

    // Check if the monthly payment is sufficient to cover interest on the initial effective loan
    const effectiveBalance = Math.max(0, loanAmount - offsetAmount);
    const initialMonthlyInterest = effectiveBalance * monthlyRate;
    if (monthlyMortgage <= initialMonthlyInterest) {
      // Payment is insufficient - return zero values to avoid infinite loops
      return {
        standardTotalRepayments: 0,
        standardTotalInterest: 0,
        extraTotalRepayments: 0,
        extraTotalInterest: 0,
        timeSavedYears: 0,
        timeSavedMonths: 0,
        interestSaved: 0,
        standardTermMonths: 0,
        extraTermMonths: 0,
      };
    }

    // Calculate standard loan metrics
    let standardBalance = loanAmount;
    let standardTotalInterestPaid = 0;
    let standardMonths = 0;

    while (standardBalance > 0.01 && standardMonths < loanTermYears * 12) {
      // Interest is calculated on (balance - offset)
      const effectiveStandardBalance = Math.max(
        0,
        standardBalance - offsetAmount,
      );
      const interestPayment = effectiveStandardBalance * monthlyRate;
      const principalPayment = monthlyMortgage - interestPayment;

      if (principalPayment <= 0) break; // Safety check for negative amortization

      standardTotalInterestPaid += interestPayment;
      standardBalance = Math.max(0, standardBalance - principalPayment);
      standardMonths++;
    }

    const standardTotalRepayments = standardMonths * monthlyMortgage;

    // Calculate extra repayment loan metrics (only if additional repayment > 0)
    let extraBalance = loanAmount;
    let extraTotalInterestPaid = 0;
    let extraMonths = 0;
    let extraTotalAdditionalPayments = 0;

    if (additionalRepayment > 0) {
      while (extraBalance > 0.01 && extraMonths < loanTermYears * 12) {
        // Interest is calculated on (balance - offset)
        const effectiveExtraBalance = Math.max(0, extraBalance - offsetAmount);
        const interestPayment = effectiveExtraBalance * monthlyRate;
        const principalPayment =
          monthlyMortgage - interestPayment + additionalRepayment;

        if (principalPayment <= 0) break; // Safety check for negative amortization

        extraTotalInterestPaid += interestPayment;
        extraTotalAdditionalPayments += additionalRepayment;
        extraBalance = Math.max(0, extraBalance - principalPayment);
        extraMonths++;
      }
    }

    const extraTotalRepayments =
      extraMonths * monthlyMortgage + extraTotalAdditionalPayments;

    // Calculate time saved in years and months
    const monthsSaved = standardMonths - extraMonths;
    const timeSavedYears = Math.floor(monthsSaved / 12);
    const timeSavedMonths = monthsSaved % 12;
    const interestSaved = standardTotalInterestPaid - extraTotalInterestPaid;

    return {
      standardTotalRepayments,
      standardTotalInterest: standardTotalInterestPaid,
      extraTotalRepayments,
      extraTotalInterest: extraTotalInterestPaid,
      timeSavedYears,
      timeSavedMonths,
      interestSaved: Math.max(0, interestSaved),
      standardTermMonths: standardMonths,
      extraTermMonths: extraMonths,
    };
  }, [
    loanAmount,
    monthlyMortgage,
    interestRate,
    loanTermYears,
    additionalRepayment,
    offsetAmount,
  ]);

  return {
    repaymentData,
    loanMetrics,
  };
}
