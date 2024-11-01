import { Switch } from "@/components/ui/switch";
import { SwitchProps } from "@radix-ui/react-switch";
import { useFormContext } from "react-hook-form";
import { FormField } from "../ui/form";

export const RHFSwitch = ({ name, ...props }: SwitchProps & { name: string }) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <Switch
          checked={field.value}
          onCheckedChange={field.onChange}
          {...props}
        />
      )}
    />
  );
};
