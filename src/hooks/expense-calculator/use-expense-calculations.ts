import { useState, useEffect } from "react";
import type React from "react";

// localStorage keys
const STORAGE_KEYS = {
  PROPERTY_PRICE: "expense-calc-property-price",
  STRATA: "expense-calc-strata",
  COUNCIL: "expense-calc-council",
  WATER: "expense-calc-water",
  DEPOSIT_PERCENTAGE: "expense-calc-deposit-percentage",
  DEPOSIT_AMOUNT: "expense-calc-deposit-amount",
  INTEREST_RATE: "expense-calc-interest-rate",
  ADDITIONAL_REPAYMENT: "expense-calc-additional-repayment",
  OFFSET_AMOUNT: "expense-calc-offset-amount",
  WEEKLY_RENT: "expense-calc-weekly-rent",
  MANAGEMENT_FEE_PERCENTAGE: "expense-calc-management-fee-percentage",
};

// Helper functions for localStorage
const getStoredValue = (key: string, defaultValue: number): number => {
  if (typeof window === "undefined") return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? Number.parseFloat(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStoredValue = (key: string, value: number): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value.toString());
  } catch {
    // Silently fail if localStorage is not available
  }
};

export interface ExpenseCalculations {
  propertyPrice: number;
  strata: number;
  council: number;
  water: number;
  weeklyRent: number;
  managementFeePercentage: number;
  loanAmount: number;
  monthlyMortgage: number;
  monthlyTotal: number;
  weeklyTotal: number;
  monthlyRentalIncome: number;
  netMonthlyExpenses: number;
  depositPercentage: number;
  depositAmount: number;
  interestRate: number;
  loanTermYears: number;
  additionalRepayment: number;
  offsetAmount: number;
  setPropertyPrice: React.Dispatch<React.SetStateAction<number>>;
  setStrata: React.Dispatch<React.SetStateAction<number>>;
  setCouncil: React.Dispatch<React.SetStateAction<number>>;
  setWater: React.Dispatch<React.SetStateAction<number>>;
  setWeeklyRent: React.Dispatch<React.SetStateAction<number>>;
  setManagementFeePercentage: React.Dispatch<React.SetStateAction<number>>;
  setDepositPercentage: React.Dispatch<React.SetStateAction<number>>;
  setDepositAmount: React.Dispatch<React.SetStateAction<number>>;
  setInterestRate: React.Dispatch<React.SetStateAction<number>>;
  setAdditionalRepayment: React.Dispatch<React.SetStateAction<number>>;
  setOffsetAmount: React.Dispatch<React.SetStateAction<number>>;
  resetAll: () => void;
}

export function useExpenseCalculations(): ExpenseCalculations {
  const [propertyPrice, setPropertyPrice] = useState<number>(0);
  const [strata, setStrata] = useState<number>(0);
  const [council, setCouncil] = useState<number>(0);
  const [water, setWater] = useState<number>(0);
  const [weeklyRent, setWeeklyRent] = useState<number>(0);
  const [managementFeePercentage, setManagementFeePercentage] =
    useState<number>(0);
  const [depositPercentage, setDepositPercentage] = useState<number>(5);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(5.68);
  const [additionalRepayment, setAdditionalRepayment] = useState<number>(0);
  const [offsetAmount, setOffsetAmount] = useState<number>(0);

  // Load from localStorage after client-side hydration
  useEffect(() => {
    setPropertyPrice(getStoredValue(STORAGE_KEYS.PROPERTY_PRICE, 0));
    setStrata(getStoredValue(STORAGE_KEYS.STRATA, 0));
    setCouncil(getStoredValue(STORAGE_KEYS.COUNCIL, 0));
    setWater(getStoredValue(STORAGE_KEYS.WATER, 0));
    setWeeklyRent(getStoredValue(STORAGE_KEYS.WEEKLY_RENT, 0));
    setManagementFeePercentage(
      getStoredValue(STORAGE_KEYS.MANAGEMENT_FEE_PERCENTAGE, 0),
    );
    setDepositPercentage(getStoredValue(STORAGE_KEYS.DEPOSIT_PERCENTAGE, 5));
    setDepositAmount(getStoredValue(STORAGE_KEYS.DEPOSIT_AMOUNT, 0));
    setInterestRate(getStoredValue(STORAGE_KEYS.INTEREST_RATE, 5.68));
    setAdditionalRepayment(
      getStoredValue(STORAGE_KEYS.ADDITIONAL_REPAYMENT, 0),
    );
    setOffsetAmount(getStoredValue(STORAGE_KEYS.OFFSET_AMOUNT, 0));
  }, []);

  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [monthlyMortgage, setMonthlyMortgage] = useState<number>(0);
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
  const [weeklyTotal, setWeeklyTotal] = useState<number>(0);
  const [monthlyRentalIncome, setMonthlyRentalIncome] = useState<number>(0);
  const [netMonthlyExpenses, setNetMonthlyExpenses] = useState<number>(0);

  // Fixed value
  const loanTermYears = 30;

  // Custom setters that handle synchronization
  const setDepositPercentageWithSync: React.Dispatch<
    React.SetStateAction<number>
  > = (value) => {
    const percentage =
      typeof value === "function" ? value(depositPercentage) : value;
    setDepositPercentage(percentage);
    if (propertyPrice > 0) {
      const calculatedDepositAmount = propertyPrice * (percentage / 100);
      setDepositAmount(calculatedDepositAmount);
    }
  };

  const setDepositAmountWithSync: React.Dispatch<
    React.SetStateAction<number>
  > = (value) => {
    const amount = typeof value === "function" ? value(depositAmount) : value;
    // Cap deposit amount at property price (if property price is set)
    const cappedAmount =
      propertyPrice > 0 ? Math.min(amount, propertyPrice) : amount;
    setDepositAmount(cappedAmount);
    if (propertyPrice > 0) {
      const calculatedDepositPercentage = (cappedAmount / propertyPrice) * 100;
      setDepositPercentage(calculatedDepositPercentage);
    }
  };

  // Synchronize when property price changes
  useEffect(() => {
    if (propertyPrice > 0) {
      const calculatedDepositAmount = propertyPrice * (depositPercentage / 100);
      setDepositAmount(calculatedDepositAmount);
    } else {
      setDepositAmount(0);
    }
  }, [propertyPrice, depositPercentage]);

  useEffect(() => {
    // Calculate loan amount based on deposit amount
    const calculatedLoanAmount = propertyPrice - depositAmount;
    setLoanAmount(Math.max(0, calculatedLoanAmount));

    // Calculate monthly mortgage payment using standard mortgage formula
    // M = P * [r(1+r)^n] / [(1+r)^n - 1]
    if (calculatedLoanAmount > 0) {
      const monthlyInterestRate = interestRate / 100 / 12;
      const numberOfPayments = loanTermYears * 12;

      const monthlyPayment =
        (calculatedLoanAmount *
          (monthlyInterestRate *
            Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

      setMonthlyMortgage(monthlyPayment);
    } else {
      setMonthlyMortgage(0);
    }
  }, [propertyPrice, depositAmount, interestRate]);

  useEffect(() => {
    // Convert quarterly fees to monthly by dividing by 3
    const monthlyStrata = strata / 3;
    const monthlyCouncil = council / 3;
    const monthlyWater = water / 3;

    // Calculate monthly total
    const monthly =
      monthlyMortgage + monthlyStrata + monthlyCouncil + monthlyWater;
    setMonthlyTotal(monthly);

    // Calculate weekly total (monthly * 12 / 52)
    const weekly = (monthly * 12) / 52;
    setWeeklyTotal(weekly);
  }, [monthlyMortgage, strata, council, water]);

  useEffect(() => {
    // Calculate monthly rental income
    // Weekly rent * 52 weeks / 12 months = monthly gross rental income
    // Then subtract management fee percentage
    const monthlyGrossRentalIncome = (weeklyRent * 52) / 12;
    const netRentalIncome =
      monthlyGrossRentalIncome * (1 - managementFeePercentage / 100);
    setMonthlyRentalIncome(netRentalIncome);

    // Calculate net monthly expenses (expenses - rental income)
    const netExpenses = monthlyTotal - netRentalIncome;
    setNetMonthlyExpenses(netExpenses);
  }, [weeklyRent, managementFeePercentage, monthlyTotal]);

  // Save to localStorage when values change (debounced to avoid blocking input)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setStoredValue(STORAGE_KEYS.PROPERTY_PRICE, propertyPrice);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [propertyPrice]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setStoredValue(STORAGE_KEYS.STRATA, strata);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [strata]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setStoredValue(STORAGE_KEYS.COUNCIL, council);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [council]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setStoredValue(STORAGE_KEYS.WATER, water);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [water]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setStoredValue(STORAGE_KEYS.DEPOSIT_PERCENTAGE, depositPercentage);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [depositPercentage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setStoredValue(STORAGE_KEYS.DEPOSIT_AMOUNT, depositAmount);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [depositAmount]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setStoredValue(STORAGE_KEYS.INTEREST_RATE, interestRate);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [interestRate]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setStoredValue(STORAGE_KEYS.ADDITIONAL_REPAYMENT, additionalRepayment);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [additionalRepayment]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setStoredValue(STORAGE_KEYS.OFFSET_AMOUNT, offsetAmount);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [offsetAmount]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setStoredValue(STORAGE_KEYS.WEEKLY_RENT, weeklyRent);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [weeklyRent]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setStoredValue(
        STORAGE_KEYS.MANAGEMENT_FEE_PERCENTAGE,
        managementFeePercentage,
      );
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [managementFeePercentage]);

  // Reset function to clear all values
  const resetAll = () => {
    setPropertyPrice(0);
    setStrata(0);
    setCouncil(0);
    setWater(0);
    setWeeklyRent(0);
    setManagementFeePercentage(0);
    setDepositPercentage(5);
    setDepositAmount(0);
    setInterestRate(5.68);
    setAdditionalRepayment(0);
    setOffsetAmount(0);

    // Clear from localStorage
    Object.values(STORAGE_KEYS).forEach((key) => {
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(key);
        } catch {
          // Silently fail if localStorage is not available
        }
      }
    });
  };

  return {
    propertyPrice,
    strata,
    council,
    water,
    weeklyRent,
    managementFeePercentage,
    loanAmount,
    monthlyMortgage,
    monthlyTotal,
    weeklyTotal,
    monthlyRentalIncome,
    netMonthlyExpenses,
    depositPercentage,
    depositAmount,
    interestRate,
    loanTermYears,
    additionalRepayment,
    offsetAmount,
    setPropertyPrice,
    setStrata,
    setCouncil,
    setWater,
    setWeeklyRent,
    setManagementFeePercentage,
    setDepositPercentage: setDepositPercentageWithSync,
    setDepositAmount: setDepositAmountWithSync,
    setInterestRate,
    setAdditionalRepayment,
    setOffsetAmount,
    resetAll,
  };
}
