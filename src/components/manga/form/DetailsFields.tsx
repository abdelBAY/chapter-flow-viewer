import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { MangaFormData } from "@/hooks/useMangaForm";
import { CoverImageUploader } from "./CoverImageUploader";
import { Input } from "@/components/ui/input";

interface DetailsFieldsProps {
  form: UseFormReturn<MangaFormData>;
}

export const DetailsFields = ({ form }: DetailsFieldsProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Enter manga description"
                className="min-h-[120px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select manga status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="hiatus">Hiatus</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cover_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cover Image</FormLabel>
            <CoverImageUploader
              value={field.value}
              onChange={field.onChange}
            />
            <div className="mt-2">
              <FormLabel className="text-xs font-normal">Or paste image URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter cover image URL directly" />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
