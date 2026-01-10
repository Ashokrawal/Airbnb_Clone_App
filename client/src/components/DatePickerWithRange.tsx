import * as React from "react";
import { addDays, format, startOfToday, isBefore } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Calendar } from "@/components/Calender";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover";
import "../styles/DatePickerWithRange.css";

interface DatePickerWithRangeProps {
  className?: string;
  from: Date | null;
  to: Date | null;
  setDateRange: (range: DateRange) => void;
}

export default function DatePickerWithRange({
  className,
  from,
  to,
  setDateRange,
}: DatePickerWithRangeProps) {
  const range: DateRange = { from: from ?? undefined, to: to ?? undefined };

  return (
    <div className={`date-picker-wrapper ${className || ""}`}>
      <Popover>
        <PopoverTrigger asChild>
          <button className="date-picker-button">
            <CalendarIcon size={16} />
            <span className="date-picker-text">
              {from
                ? to
                  ? `${format(from, "MMM dd")} → ${format(to, "MMM dd")}`
                  : format(from, "MMM dd, yyyy")
                : "Pick a date"}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="popover-content-wrapper" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={from ?? new Date()}
            selected={range}
            onSelect={(newRange) => {
              // Ensure from/to are never null when calling parent
              setDateRange({
                from: newRange?.from ?? null,
                to: newRange?.to ?? null,
              });
            }}
            numberOfMonths={1}
            disabled={(day) => isBefore(day, startOfToday())}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
