"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useClipboardImage } from "@/hooks/vastu-layout-inspector/use-clipboard-image";
import { useFileUpload } from "@/hooks/vastu-layout-inspector/use-file-upload";
import { useImageProcessor } from "@/hooks/vastu-layout-inspector/use-image-processor";
import { Clipboard, Upload } from "lucide-react";

interface ImageUploadProps {
  onImageLoad: (imageSrc: string, width: number, height: number) => void;
  onImageRemove: () => void;
}

export default function ImageUpload({ onImageLoad }: ImageUploadProps) {
  const { processImageFile } = useImageProcessor(onImageLoad);
  const { pasteImageFromClipboard } = useClipboardImage({
    onImageSelect: processImageFile,
    enableKeyboardShortcut: true,
  });

  const handlePasteFromClipboard = () => {
    pasteImageFromClipboard(processImageFile);
  };

  const {
    dragOver,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileInputChange,
    openFileDialog,
  } = useFileUpload({
    onFileSelect: processImageFile,
    acceptedTypes: ["image/*"],
  });

  return (
    <div className="h-full w-full">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"} `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={openFileDialog}
          >
            <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="mb-2 text-lg font-medium text-gray-700">
              Drop your image here, or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supports JPG, PNG, GIF, WebP • Right-click for options • Ctrl+V to
              paste
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={openFileDialog}>
            <Upload className="mr-2 h-4 w-4" />
            Browse Files
          </ContextMenuItem>
          <ContextMenuItem onClick={handlePasteFromClipboard}>
            <Clipboard className="mr-2 h-4 w-4" />
            Paste from Clipboard
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
