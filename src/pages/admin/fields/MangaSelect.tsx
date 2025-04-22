
import { Label } from "@/components/ui/label";
import { FieldError } from "react-hook-form";

type MangaSelectProps = {
  value: string;
  onChange: (v: string) => void;
  options: { id: string; title: string }[];
  disabled?: boolean;
  error?: FieldError;
};

export default function MangaSelect({ value, onChange, options, disabled, error }: MangaSelectProps) {
  return (
    <div>
      <Label htmlFor="manga">Manga Series</Label>
      <select
        id="manga"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="block mt-1 w-full rounded-md border border-input px-3 py-2 bg-background text-base"
        disabled={disabled}
      >
        <option value="">Select manga</option>
        {options.map(manga => (
          <option key={manga.id} value={manga.id}>{manga.title}</option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-destructive mt-1">Please select a manga</p>
      )}
    </div>
  );
}
