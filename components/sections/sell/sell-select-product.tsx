"use client";

import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CreateSellType } from "@/dto/order/create-sell.dto";
import { BoxIcon, ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

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

type RHFComboboxOptions = {
  value: string
  label: string
  price: number | string;
  stock: number;
}

interface SellSelectProductProps {
  handleAddProduct: (productId: number) => void;
  options: RHFComboboxOptions[];
}


export default function SellSelectProduct({ handleAddProduct, options }: SellSelectProductProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { formState: { errors } } = useFormContext<CreateSellType>();

  return (
    <FormItem className="flex flex-col gap-2">
      <FormLabel>Productos</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <ComboboxButton
            value={""}
            options={options}
            placeholder="Agregar un producto"
            label=""
            aria-expanded={open}
          />
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popper-anchor-width] p-0">
          <Command value={inputValue} onValueChange={setInputValue}>
            <CommandInput placeholder="Agregar un producto" />
            <CommandList>
              <CommandEmpty>No se encontraron productos</CommandEmpty>
              <CommandGroup>
                {options?.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      handleAddProduct(Number(option.value));
                      setInputValue("");
                      setOpen(false);
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <BoxIcon className="mr-2 h-4 w-4" />
                      {option.label}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>Stock: {option.stock}</span>
                      <span>${option.price}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {errors.products && <FormMessage>{errors.products.message}</FormMessage>}
    </FormItem>
  )
}