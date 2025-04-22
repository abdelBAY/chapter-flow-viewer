
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "react-hook-form";

type ChapterNumberInputProps = {
  value: number;
  onChange: (n: number) => void;
  error?: FieldError;
};

export default function ChapterNumberInput({ value, onChange, error }: ChapterNumberInputProps) {
  return (
    <div>
      <Label htmlFor="number">Chapter Number</Label>
      <Input
        id="number"
        type="number"
        min={1}
        step={1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
      {error && (
        <p className="text-sm text-destructive mt-1">Enter chapter number</p>
      )}
    </div>
  );
}
