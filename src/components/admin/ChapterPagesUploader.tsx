
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FileImage, ClipboardPaste, ListOrdered } from "lucide-react";

interface ChapterPagesUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function ChapterPagesUploader({ value, onChange }: ChapterPagesUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkFiles, setBulkFiles] = useState<File[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bulkInputRef = useRef<HTMLInputElement>(null);

  // Image uploading logic (reusable for all methods)
  const uploadFiles = async (files: FileList | File[], prepend = false) => {
    if (!files || files.length === 0) return;

    setLoading(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = (files instanceof FileList ? files[i] : files[i]);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt||"png"}`;

        const { data, error } = await supabase.storage
          .from("chapter-pages")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          toast({
            variant: "destructive",
            title: "Upload failed",
            description: error.message
          });
          continue;
        }

        const url = supabase.storage.from("chapter-pages").getPublicUrl(fileName).data.publicUrl;
        uploadedUrls.push(url);
      }

      // For bulk uploads, allow to insert at start (if prepend = true)
      const newValue = prepend ? [...uploadedUrls, ...value] : [...value, ...uploadedUrls];
      onChange(newValue);
    } finally {
      setLoading(false);
      setBulkLoading(false);
      setBulkFiles(null);
      setBulkModalOpen(false);
    }
  };

  // File input change
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    uploadFiles(files!);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  // Clipboard paste handler
  const handlePaste = async () => {
    setLoading(true);
    try {
      // Clipboard API for images (must be triggered by user gesture)
      const clipboardItems = await navigator.clipboard.read();
      const files: File[] = [];
      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith("image/")) {
            const blob = await item.getType(type);
            // Provide a default filename and type
            files.push(new File([blob], `pasted-${Date.now()}.png`, { type }));
          }
        }
      }
      if (files.length === 0) {
        toast({
          variant: "destructive",
          title: "No image found",
          description: "Clipboard does not contain an image.",
        });
        return;
      }
      await uploadFiles(files);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Paste failed",
        description: "Could not paste image. Clipboard permissions may be needed.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Remove an image
  const handleRemove = (url: string) => {
    onChange(value.filter((u) => u !== url));
  };

  // BULK: Open bulk modal
  const handleBulkOpen = () => {
    setBulkModalOpen(true);
    setBulkFiles(null);
  };

  // BULK: Select and preview files
  const handleBulkFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    // Try to sort files by leading number in filename (page numbers)
    files.sort((a: File, b: File) => {
      // Extract numbers from filenames for smarter sort
      // Eg: "Page-01.jpg", "Page-02.jpg", "3.png"
      const numA = Number((a.name.match(/\d+/) ?? ["0"])[0]);
      const numB = Number((b.name.match(/\d+/) ?? ["0"])[0]);
      return numA - numB;
    });

    setBulkFiles(files);
  };

  // BULK: Upload files
  const handleBulkUpload = async () => {
    if (!bulkFiles || bulkFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "No files selected",
        description: "Please select image files first.",
      });
      return;
    }
    setBulkLoading(true);
    await uploadFiles(bulkFiles);
    setBulkFiles(null);
    setBulkModalOpen(false);
  };

  return (
    <div>
      <label className="block font-medium mb-2">Upload Chapter Pages</label>
      <div className="flex gap-2 mb-2">
        <Button
          type="button"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
        >
          <FileImage className="mr-2" /> Select images
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className=""
          onClick={handleBulkOpen}
          disabled={loading}
        >
          <ListOrdered className="mr-1" /> Bulk Add Pages
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={loading}
          onClick={handlePaste}
        >
          <ClipboardPaste className="mr-2" /> Paste from clipboard
        </Button>
      </div>
      {/* Bulk modal */}
      {bulkModalOpen && (
        <div className="fixed z-30 inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative border">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <ListOrdered /> Bulk Add Pages
            </h2>
            <Input
              type="file"
              accept="image/*"
              multiple
              ref={bulkInputRef}
              disabled={bulkLoading}
              onChange={handleBulkFilesChange}
              className="mb-3"
            />
            {bulkFiles && bulkFiles.length > 0 && (
              <ul className="mb-3 max-h-32 overflow-y-auto border rounded p-2 bg-muted/20 text-xs">
                {bulkFiles.map((file, idx) => (
                  <li key={file.name} className="truncate">
                    {idx + 1}. {file.name}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setBulkModalOpen(false)}
                disabled={bulkLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleBulkUpload}
                disabled={bulkLoading || !bulkFiles || bulkFiles.length === 0}
              >
                {bulkLoading && <Loader2 className="animate-spin mr-2" />}
                Upload {bulkFiles && bulkFiles.length > 1 ? `${bulkFiles.length} pages` : "Pages"}
              </Button>
            </div>
          </div>
        </div>
      )}
      <div
        className={`transition-all border-2 border-dashed rounded-md flex flex-col items-center justify-center p-4 relative bg-background group
          ${dragActive ? "border-blue-500 bg-blue-50" : "border-muted"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        tabIndex={-1}
      >
        <Input
          type="file"
          accept="image/*"
          multiple
          disabled={loading}
          className="hidden"
          ref={inputRef}
          onChange={handleFilesChange}
        />
        <span className="text-xs text-muted-foreground mt-1">
          or drag &amp; drop images here
        </span>
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
            <Loader2 className="animate-spin mb-2" />Uploading images...
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3 mt-3">
        {value.length === 0 && (
          <span className="text-muted-foreground text-sm flex items-center gap-2">
            <FileImage className="w-4 h-4" /> No pages uploaded yet.
          </span>
        )}
        {value.map((url, i) => (
          <div className="relative group" key={url + i}>
            <img
              src={url}
              alt={`Page ${i + 1}`}
              className="h-32 w-auto rounded border object-contain"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1 opacity-70 group-hover:opacity-100 px-2 py-1"
              onClick={() => handleRemove(url)}
            >
              Remove
            </Button>
            <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-black/60 text-white text-xs rounded">
              {i + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
