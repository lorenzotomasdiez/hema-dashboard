"use client";
import { Controller, useFormContext } from "react-hook-form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Button } from "../ui/button"
import { format } from "date-fns"
import { Calendar } from "../ui/calendar"
import { cn } from "@/lib/utils"
import { es } from "date-fns/locale"

export const RHFDatePicker = ({ name, className, disabled = false }: { name: string, className?: string, disabled?: boolean }) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full pl-3 text-left font-normal",
                className,
                !field.value && "text-muted-foreground",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {field.value ? (
                format(field.value, "PPP", { locale: es })
              ) : (
                <span>Selecciona una fecha</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              locale={es}
              disabled={disabled}
            />
          </PopoverContent>
        </Popover>
      )}
    />
  )
}