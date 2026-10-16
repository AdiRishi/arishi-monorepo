import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  handleInputChange,
  handleInputBlur,
  useFormattedNumberInput,
} from "@/lib/input-utils";
import { DollarSign } from "lucide-react";
import type React from "react";

interface RentalIncomeSectionProps {
  weeklyRent: number;
  managementFeePercentage: number;
  setWeeklyRent: React.Dispatch<React.SetStateAction<number>>;
  setManagementFeePercentage: React.Dispatch<React.SetStateAction<number>>;
}

export function RentalIncomeSection({
  weeklyRent,
  managementFeePercentage,
  setWeeklyRent,
  setManagementFeePercentage,
}: RentalIncomeSectionProps) {
  // Use the reusable hook for better decimal input handling
  const {
    input: managementFeeInput,
    onChange: handleManagementFeeChange,
    onBlur: handleManagementFeeBlur,
  } = useFormattedNumberInput(
    managementFeePercentage,
    setManagementFeePercentage,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4" />
        <h3 className="font-medium">Rental Income</h3>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="weeklyRent">Weekly Rent ($)</Label>
          <Input
            id="weeklyRent"
            type="text"
            min="0"
            placeholder="0.00"
            value={weeklyRent.toLocaleString()}
            onChange={handleInputChange(setWeeklyRent)}
            onBlur={handleInputBlur}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="managementFee">Management Agency Fee (%)</Label>
          <Input
            id="managementFee"
            type="text"
            min="0"
            max="100"
            step="0.1"
            placeholder="0.0"
            value={managementFeeInput}
            onChange={handleManagementFeeChange}
            onBlur={handleManagementFeeBlur}
          />
        </div>
      </div>
    </div>
  );
}
