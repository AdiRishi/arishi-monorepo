import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleInputChange, handleInputBlur } from "@/lib/input-utils";
import { Calculator } from "lucide-react";
import type React from "react";

interface QuarterlyfeesSectionProps {
  strata: number;
  council: number;
  water: number;
  setStrata: React.Dispatch<React.SetStateAction<number>>;
  setCouncil: React.Dispatch<React.SetStateAction<number>>;
  setWater: React.Dispatch<React.SetStateAction<number>>;
}

export function QuarterlyFeesSection({
  strata,
  council,
  water,
  setStrata,
  setCouncil,
  setWater,
}: QuarterlyfeesSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calculator className="h-4 w-4" />
        <h3 className="font-medium">Quarterly Fees</h3>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="strata">Strata Cost per Quarter ($)</Label>
          <Input
            id="strata"
            type="text"
            min="0"
            placeholder="0.00"
            value={strata.toLocaleString()}
            onChange={handleInputChange(setStrata)}
            onBlur={handleInputBlur}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="council">Council Fees per Quarter ($)</Label>
          <Input
            id="council"
            type="text"
            min="0"
            placeholder="0.00"
            value={council.toLocaleString()}
            onChange={handleInputChange(setCouncil)}
            onBlur={handleInputBlur}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="water">Water Fees per Quarter ($)</Label>
          <Input
            id="water"
            type="text"
            min="0"
            placeholder="0.00"
            value={water.toLocaleString()}
            onChange={handleInputChange(setWater)}
            onBlur={handleInputBlur}
          />
        </div>
      </div>
    </div>
  );
}
