
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "react-hook-form";

type PagesInputProps = {
  value: number;
  error?: FieldError;
};

export default function PagesInput({ value, error }: PagesInputProps) {
  return (
    <div>
      <Label htmlFor="pages">Number of Pages</Label>
      <Input
        id="pages"
        type="number"
        min={1}
        step={1}
        value={value}
        readOnly
        className="bg-muted"
      />
      {error && <p className="text-sm text-destructive mt-1">Enter page count</p>}
      {value > 0 && (
        <p className="text-xs text-muted-foreground mt-1">
          {value} page{value !== 1 ? 's' : ''} will be uploaded
        </p>
      )}
    </div>
  );
}
