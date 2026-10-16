---
globs: src/components/expense-calculator/**/*.tsx,src/hooks/expense-calculator/**/*.ts,src/app/home-loan-expense-calculator/**/*.tsx,src/lib/input-utils.ts
alwaysApply: false
---
# Calculation Logic - Simple Expense Calculator

## Core Calculation Hook

[src/hooks/expense-calculator/use-expense-calculations.ts](mdc:src/hooks/expense-calculator/use-expense-calculations.ts) - Central calculation logic with React state management

## Mortgage Calculation

### Standard Mortgage Formula

```
M = P * [r(1+r)^n] / [(1+r)^n - 1]
```

Where:

- M = Monthly payment
- P = Principal loan amount
- r = Monthly interest rate (annual rate / 12)
- n = Total number of payments (years × 12)

### Default Assumptions

- **Loan Term**: 30 years (fixed)
- **Deposit**: 5% of property price (adjustable)
- **Interest Rate**: 5.68% per annum (adjustable)
- **Payment Type**: Principal and interest

### Implementation Details

- Loan amount = Property price × (1 - deposit percentage / 100)
- Monthly interest rate = Annual rate / 100 / 12
- Number of payments = 30 × 12 = 360

## Quarterly Fees Conversion

### Monthly Conversion

- Strata fees: Quarterly amount ÷ 3
- Council rates: Quarterly amount ÷ 3
- Water fees: Quarterly amount ÷ 3

### Rationale

Australian property fees are typically charged quarterly, but users need monthly budgets for comparison with mortgage payments.

## Rental Income Calculation

### Monthly Rental Income Formula

```
Monthly Rental Income = (Weekly Rent × 52 weeks ÷ 12 months) × (1 - Management Fee % / 100)
```

### Net Expense Calculation

```
Net Monthly Expenses = Monthly Total Expenses - Monthly Rental Income
```

### Implementation Details

- Convert weekly rent to annual: Weekly Rent × 52
- Convert annual to monthly: Annual Rent ÷ 12
- Apply management fee deduction: × (1 - fee percentage / 100)
- Calculate net expenses by subtracting rental income from total expenses

## Weekly Calculation

### Formula

```
Weekly expenses = (Monthly total × 12) ÷ 52
```

### Rationale

Provides accurate weekly amount accounting for varying month lengths throughout the year.

## Additional Repayment Calculations

### Impact Analysis

- [src/hooks/expense-calculator/use-repayment-calculations.ts](mdc:src/hooks/expense-calculator/use-repayment-calculations.ts) - Calculates loan balance over time
- Shows how additional payments reduce total interest and loan term
- Generates data for repayment graph visualization

### Amortization Schedule

- Tracks principal vs interest portions over loan term
- Calculates remaining balance after each payment
- Compares standard vs accelerated repayment scenarios

## Data Persistence

### localStorage Strategy

- Debounced updates (500ms delay) to avoid excessive writes
- Individual keys for each input value
- Graceful fallbacks for SSR and localStorage errors
- Reset function clears all stored values

### Storage Keys

```typescript
const STORAGE_KEYS = {
  PROPERTY_PRICE: "expense-calc-property-price",
  STRATA: "expense-calc-strata",
  COUNCIL: "expense-calc-council",
  WATER: "expense-calc-water",
  DEPOSIT_PERCENTAGE: "expense-calc-deposit-percentage",
  INTEREST_RATE: "expense-calc-interest-rate",
  ADDITIONAL_REPAYMENT: "expense-calc-additional-repayment",
  WEEKLY_RENT: "expense-calc-weekly-rent",
  MANAGEMENT_FEE_PERCENTAGE: "expense-calc-management-fee-percentage",
};
```

## Real-time Updates

### useEffect Dependencies

- Mortgage calculation: `[propertyPrice, depositPercentage, interestRate]`
- Monthly total: `[monthlyMortgage, strata, council, water]`
- Rental income: `[weeklyRent, managementFeePercentage, monthlyTotal]`
- Automatic recalculation when any input changes

### Calculation Flow

1. Property price → Loan amount
2. Loan amount + Interest rate → Monthly mortgage
3. Monthly mortgage + Quarterly fees → Monthly total
4. Weekly rent + Management fee → Monthly rental income
5. Monthly total - Rental income → Net monthly expenses
6. Monthly total → Weekly total

## Error Handling

### Input Validation

- [src/lib/input-utils.ts](mdc:src/lib/input-utils.ts) - Handles number formatting and validation
- Prevents invalid characters in numeric inputs
- Graceful handling of empty or invalid values
- `useFormattedNumberInput` hook for decimal percentage inputs

### Calculation Safety

- Check for zero values before performing calculations
- Handle division by zero scenarios
- Default to zero for invalid calculations

- Check for zero values before performing calculations
- Handle division by zero scenarios
- Default to zero for invalid calculations
