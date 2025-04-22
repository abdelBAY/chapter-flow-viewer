
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "react-hook-form";

type ChapterTitleInputProps = {
  value: string;
  onChange: (v: string) => void;
  error?: FieldError;
};

export default function ChapterTitleInput({ value, onChange, error }: ChapterTitleInputProps) {
  return (
    <div>
      <Label htmlFor="title">Chapter Title</Label>
      <Input
        id="title"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder='e.g. "The Adventure Begins"'
      />
      {error && <p className="text-sm text-destructive mt-1">Title is required</p>}
    </div>
  );
}
