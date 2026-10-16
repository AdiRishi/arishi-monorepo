# Simple Expense Calculator

A modern, responsive property expense calculator built with Next.js 15, React 19, and Tailwind CSS. Calculate your monthly and weekly property expenses including mortgage payments, strata fees, council rates, water fees, and rental income, plus visualize your loan repayment schedule.

## ✨ Features

- **Property Price Calculator**: Calculate mortgage payments based on property price
- **Rental Income Calculator**: Factor in weekly rental income with management fees to see net expenses
- **Repayment Graph**: Interactive loan balance visualization over time with additional repayment scenarios
- **Additional Repayment Calculator**: See how extra payments reduce loan term and interest
- **Automatic Calculations**: Real-time updates as you input values
- **Quarterly Fees Support**: Input strata, council, and water fees on a quarterly basis
- **Monthly & Weekly Breakdown**: See both monthly and weekly expense totals
- **Net Expense Calculation**: View actual out-of-pocket costs after rental income
- **Data Persistence**: Your inputs are saved locally and restored between sessions
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, accessible interface using shadcn/ui components

## 🧮 Calculations

The calculator uses the following assumptions and formulas:

### Mortgage Calculation

- **Deposit**: 5% of property price (adjustable)
- **Loan Amount**: 95% of property price (based on deposit percentage)
- **Interest Rate**: 5.68% per annum (variable, adjustable)
- **Loan Term**: 30 years
- **Formula**: Standard mortgage payment formula with compound interest

### Rental Income Calculation

- **Weekly Rent**: Gross weekly rental amount from tenant
- **Management Fee**: Percentage taken by property management agency
- **Monthly Rental Income**: `(Weekly Rent × 52 weeks ÷ 12 months) × (1 - Management Fee %/100)`
- **Net Monthly Expenses**: `Monthly Expenses - Monthly Rental Income`

### Repayment Graph

- **Loan Balance Tracking**: Shows remaining loan balance over the 30-year term
- **Additional Repayments**: Compare standard vs. accelerated repayment scenarios
- **Savings Calculation**: Shows total interest saved and time reduction from extra payments
- **Interactive Charts**: Beautiful area charts with gradient fills and tooltips

### Expense Breakdown

- **Quarterly fees** (strata, council, water) are automatically converted to monthly amounts
- **Weekly expenses** are calculated as: `(monthly total × 12) ÷ 52`
- **Rental income** is calculated from weekly amounts and converted to monthly after management fees

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd simple-expense-calculator
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint for code linting
- `pnpm format` - Format code with Prettier

## 🏗️ Project Structure

```
simple-expense-calculator/
├── src/
│   ├── app/
│   │   ├── globals.css      # Global styles and Tailwind CSS
│   │   ├── layout.tsx       # Root layout component
│   │   └── page.tsx         # Home page
│   ├── components/
│   │   ├── calculator/      # Calculator input components
│   │   │   ├── expense-calculator.tsx    # Main calculator component
│   │   │   ├── property-price-section.tsx
│   │   │   ├── quarterly-fees-section.tsx
│   │   │   ├── rental-income-section.tsx
│   │   │   └── index.tsx
│   │   ├── results/         # Results and visualization components
│   │   │   ├── expense-results.tsx
│   │   │   ├── repayment-graph.tsx
│   │   │   └── index.tsx
│   │   └── ui/              # Reusable UI components (shadcn/ui)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── chart.tsx    # Chart components for data visualization
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── ... (30+ additional UI components)
│   ├── hooks/               # Custom React hooks
│   │   ├── use-expense-calculations.ts
│   │   ├── use-repayment-calculations.ts
│   │   └── use-mobile.ts
│   └── lib/                 # Utility functions
│       ├── utils.ts
│       └── input-utils.ts
├── public/                  # Static assets
├── package.json
└── README.md
```

## 🎨 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework

### UI Components

- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Beautiful, customizable components
- **Recharts** - Responsive chart library for data visualization
- **Lucide React** - Icon library
- **class-variance-authority** - Component variant management

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Turbopack** - Fast development bundler
- **pnpm** - Fast, disk space efficient package manager

### Analytics & Performance

- **Vercel Analytics** - Web analytics
- **Vercel Speed Insights** - Performance monitoring

## 📱 Usage

1. **Enter Property Price**: Input the total property purchase price
2. **Adjust Loan Settings**: Modify deposit percentage and interest rate if needed
3. **View Mortgage Details**: See calculated deposit, loan amount, and monthly mortgage payment
4. **Add Quarterly Fees**: Input strata, council rates, and water fees (quarterly amounts)
5. **Add Rental Income**: Enter weekly rent and management agency fee percentage (optional)
6. **See Results**: View your total monthly and weekly property expenses, plus net expenses after rental income
7. **Explore Repayment Graph**: Visualize your loan balance over time
8. **Calculate Extra Repayments**: Add additional monthly payments to see interest savings and time reduction

## 🎯 Use Cases

Perfect for:

- **Property Investors** - Calculate rental property expenses, income, and net cash flow
- **Landlords** - Understand true costs after rental income and management fees
- **First-time Buyers** - Understand ongoing property costs and repayment strategies
- **Financial Planning** - Budget for property ownership and optimize loan repayments
- **Real Estate Professionals** - Quick expense estimates, income analysis, and loan comparisons for clients
- **Mortgage Holders** - Analyze the impact of additional repayments on loan terms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🚀 Deployment

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Alternatively, you can deploy to any platform that supports Node.js applications:

1. Build the application: `pnpm build`
2. Start the production server: `pnpm start`

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Check the [Next.js documentation](https://nextjs.org/docs)
- Visit the [React documentation](https://react.dev)
