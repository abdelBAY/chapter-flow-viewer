
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FileImage } from "lucide-react";

interface ChapterPagesUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function ChapterPagesUploader({ value, onChange }: ChapterPagesUploaderProps) {
  const [loading, setLoading] = useState(false);

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

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

  // Remove an image
  const handleRemove = (url: string) => {
    onChange(value.filter((u) => u !== url));
  };

  return (
    <div>
      <label className="block font-medium mb-2">Upload Chapter Pages</label>
      <Input
        type="file"
        accept="image/*"
        multiple
        disabled={loading}
        onChange={handleFilesChange}
      />
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
      {loading && (
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <Loader2 className="animate-spin" /> Uploading images...
        </div>
      )}
    </div>
  );
}
