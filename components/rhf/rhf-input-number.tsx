"use client";
import { Controller, useFormContext } from "react-hook-form"
import { Input, InputProps } from "@/components/ui/input"
import { cn } from "@/lib/utils";
import { FormMessage } from "@/components/ui/form";

export const RHFInputNumber = ({ name, className, ...props }: InputProps & { name: string }) => {
  const { control, formState: { errors } } = useFormContext()
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <>
          <Input
            {...field}
            {...props}
            className={cn(
              "w-full",
              className
            )}
            onChange={(e) => field.onChange(Number(e.target.value))}
            type="number"
          />
          {errors[name] && (
            <FormMessage>{errors[name]?.message as string}</FormMessage>
          )}
        </>
      )}
    />
  )
}
