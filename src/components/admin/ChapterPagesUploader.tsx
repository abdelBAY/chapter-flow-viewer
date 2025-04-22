
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FileImage, ClipboardPaste } from "lucide-react";

interface ChapterPagesUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function ChapterPagesUploader({ value, onChange }: ChapterPagesUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Image uploading logic (reusable for all methods)
  const uploadFiles = async (files: FileList | File[]) => {
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

      // Add new uploaded images to existing
      const newValue = [...value, ...uploadedUrls];
      onChange(newValue);
    } finally {
      setLoading(false);
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

  return (
    <div>
      <label className="block font-medium mb-2">Upload Chapter Pages</label>
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
        <Button
          type="button"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
        >
          <FileImage className="mr-2" /> Select images
        </Button>
        <span className="text-xs text-muted-foreground mt-3">
          or drag &amp; drop images here
        </span>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-2"
          disabled={loading}
          onClick={handlePaste}
        >
          <ClipboardPaste className="mr-2" /> Paste from clipboard
        </Button>
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
