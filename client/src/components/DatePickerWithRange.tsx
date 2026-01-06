import * as React from "react";
import { addDays, format, startOfToday, isBefore } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";
import { Calendar } from "@/components/Calender";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/PopOver";

// 1. Define the component props interface
interface DatePickerWithRangeProps {
  className?: string;
  // Callback to sync state with the parent (e.g., BookingWidget)
  setDateRange: (range: DateRange | undefined) => void;
}

export default function DatePickerWithRange({
  className,
  setDateRange,
}: DatePickerWithRangeProps) {
  // 2. Type the state with DateRange from react-day-picker
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 5),
  });

  // 3. Sync internal state with parent via useEffect
  React.useEffect(() => {
    setDateRange(date);
  }, [date, setDateRange]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal border-none text-black hover:bg-transparent",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} &rarr;{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span className="text-base font-semibold">Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
            // 4. Disable past dates using date-fns for cleaner logic
            disabled={(day) => isBefore(day, startOfToday())}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
