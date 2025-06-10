
"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  setDate?: (date: Date | undefined) => void
  mode?: 'single'
  selected?: Date | undefined
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  initialFocus?: boolean
}

export function DatePicker({ 
  date,
  setDate,
  mode = "single",
  selected,
  onSelect,
  disabled,
  initialFocus
}: DatePickerProps) {
  // For backward compatibility
  const isControlled = date !== undefined && setDate !== undefined;
  
  const handleSelect = (newDate: Date | undefined) => {
    if (isControlled && setDate) {
      setDate(newDate);
    }
    if (!isControlled && onSelect) {
      onSelect(newDate);
    }
  };

  return (
    <div className="grid gap-2">
      <Calendar
        mode="single"
        selected={isControlled ? date : selected}
        onSelect={handleSelect}
        disabled={disabled}
        initialFocus={initialFocus}
        className="pointer-events-auto"
      />
    </div>
  )
}
