"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useFormContext } from "react-hook-form"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

type RHFComboboxOptions = {
  value: string
  label: string
}

interface RHFComboboxProps {
  options?: RHFComboboxOptions[];
  label: string;
  name: string;
  placeholder?: string;
  emptyMessage?: string;
}

const ComboboxButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    value?: string;
    options?: RHFComboboxOptions[];
    placeholder?: string;
    label: string;
  }
>(({ value, options, placeholder, label, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    role="combobox"
    {...props}
    className="w-full justify-between"
  >
    {value
      ? options?.find((option) => option.value === value)?.label
      : placeholder || label}
    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
  </Button>
));
ComboboxButton.displayName = "ComboboxButton";

export default function RHFCombobox({ options, label, name, placeholder, emptyMessage = "No option found." }: RHFComboboxProps) {
  const { control } = useFormContext();
  const [open, setOpen] = React.useState(false);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedOption = options?.find((option) => option.value === field.value);
        return (
          <FormItem className="w-full flex flex-col gap-1 relative">
            <FormLabel>{label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <ComboboxButton
                  value={field.value}
                  options={options}
                  placeholder={placeholder}
                  label={label}
                  aria-expanded={open}
                />
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popper-anchor-width] p-0">
                <Command>
                  <CommandInput placeholder={placeholder || label} />
                  <CommandList>
                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                    <CommandGroup>
                      {options?.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.label}
                          onSelect={(currentValue) => {
                            field.onChange(currentValue === selectedOption?.label ? "" : option.value)
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === option.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  );
} 