
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Image, Upload } from "lucide-react";

export interface CoverImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export const CoverImageUploader = ({ value, onChange }: CoverImageUploaderProps) => {
  const [preview, setPreview] = useState<string>(value || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // When the user selects a file, upload it
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Use random UUID for the filename to avoid collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from("covers")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (error) throw error;

      // Build the public URL for display
      const { data: urlData } = supabase.storage.from("covers").getPublicUrl(fileName);
      const url = urlData.publicUrl;
      setPreview(url);
      onChange(url);

      toast({ title: "Success", description: "Cover image uploaded." });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Upload error",
        description: err?.message || "Failed to upload cover image",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Preview */}
      <div className="relative h-40 w-32 rounded bg-muted flex items-center justify-center overflow-hidden">
        {preview ? (
          <img
            src={preview}
            alt="Cover preview"
            className="object-cover w-full h-full"
          />
        ) : (
          <Image className="text-muted-foreground w-12 h-12" />
        )}
      </div>
      {/* File input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <Button
        variant="outline"
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        <Upload className="mr-2" /> {uploading ? "Uploading..." : "Upload Image"}
      </Button>
      {/* Optional: show current URL */}
      {preview && (
        <div className="break-all text-xs text-muted-foreground">URL: {preview}</div>
      )}
    </div>
  );
};
