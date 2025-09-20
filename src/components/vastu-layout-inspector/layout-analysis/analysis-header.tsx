import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, RotateCcw, Download } from "lucide-react";
import React from "react";

interface AnalysisHeaderProps {
  onResetCompass: () => void;
  onRemoveImage: () => void;
  onDownloadImage: () => void;
  rotation: number;
  onRotationChange: (newAngle: number) => void;
}

export default function AnalysisHeader({
  onResetCompass,
  onRemoveImage,
  onDownloadImage,
  rotation,
  onRotationChange,
}: AnalysisHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Layout Analysis</h2>
        <button
          onClick={onResetCompass}
          className="flex items-center gap-2 rounded-md bg-blue-100 px-3 py-1.5 text-sm text-blue-700 transition-colors hover:bg-blue-200"
          title="Reset compass position"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Compass
        </button>
        <button
          onClick={onDownloadImage}
          className="flex items-center gap-2 rounded-md bg-green-100 px-3 py-1.5 text-sm text-green-700 transition-colors hover:bg-green-200"
          title="Download layout with compass"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
        <div className="flex items-center gap-2">
          <Label htmlFor="rotation-input" className="text-sm font-medium">
            Rotation
          </Label>
          <Input
            id="rotation-input"
            type="number"
            className="w-24"
            value={rotation.toFixed(1)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onRotationChange(Number(e.target.value))
            }
            step="0.1"
            min="-180"
            max="180"
          />
        </div>
      </div>
      <button
        onClick={onRemoveImage}
        className="flex items-center gap-2 rounded-md bg-red-100 px-3 py-1.5 text-sm text-red-700 transition-colors hover:bg-red-200"
      >
        <X className="h-4 w-4" />
        Remove Image
      </button>
    </div>
  );
}
