"use client";
import { Controller, useFormContext } from "react-hook-form"
import { Input, InputProps } from "@/components/ui/input"
import { cn } from "@/lib/utils";

export const RHFInput = ({ name, className, ...props }: InputProps & { name: string }) => {
  const { control } = useFormContext()
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Input
          {...field}
          {...props}
          className={cn(
            "w-full",
            className
          )}
        />
      )}
    />
  )
}
