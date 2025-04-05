import { useEffect, useState } from "react";

import { format } from "date-fns";

import { Button } from "@/components/buttons/Button";
import { Popover } from "@/components/Popover";

import { CalendarIcon } from "@/components/Icons";

type DateRange = {
  from: Date;
  to?: Date;
};

// TODO: componentize
const Calendar = ({ 
  mode = 'single',
  selected,
  onSelect,
  numberOfMonths = 1,
  initialFocus = true 
}) => {
  const [focusedDate, setFocusedDate] = useState(selected || new Date());
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getMonthData = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const months = Array.from({ length: numberOfMonths }, (_, i) => {
    const monthDate = new Date(focusedDate);
    monthDate.setMonth(monthDate.getMonth() + i);
    return monthDate;
  });

  return (
    <div className="p-4">
      <div className="flex space-x-4">
        {months.map((monthDate, index) => (
          <div key={index} className="w-64">
            <div className="flex justify-between mb-4">
              <button
                onClick={() => {
                  const newDate = new Date(monthDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setFocusedDate(newDate);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                ←
              </button>
              <div>
                {monthDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
              </div>
              <button
                onClick={() => {
                  const newDate = new Date(monthDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setFocusedDate(newDate);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                →
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-center text-sm text-gray-500">
                  {day}
                </div>
              ))}
              {getMonthData(monthDate).map((date, i) => (
                <button
                  key={i}
                  onClick={() => date && onSelect(date)}
                  className={`
                    p-2 text-center rounded-md
                    ${!date ? 'invisible' : 'hover:bg-gray-100'}
                    ${date && selected?.getTime() === date.getTime() ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                  `}
                >
                  {date?.getDate()}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const displayDate = (date: any) => {
  if (!date) return "Pick a date";
  if (typeof date === "object" && date?.from) {
    if (date?.to) {
      return `${format(date.from, "LLL dd, y")} - ${format(
        date.to,
        "LLL dd, y"
      )}`;
    } else {
      return format(date.from, "LLL dd, y");
    }
  }
  if (date) return format(date, "LLL dd, y");
  return "Pick a date";
};

// TODO: i18n support
export const DatePicker = ({
  mode,
  value,
  onChange,
  className
}: {
  mode?: any;
  value: DateRange | Date;
  onChange?: (date: DateRange | Date | undefined) => void;
  className?: string;
}) => {
  if (!mode) mode = "single";
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [date, setDate] = useState<DateRange | Date>();

  useEffect(() => {
    if (value) {
      setDate(value);
    }
  }, [value]);

  const handleSetDate = (date: DateRange | Date | undefined) => {
    if (onChange) {
      onChange?.(date);
    }
    setDate(date);
    return;
  };

  return (
    <div className="relative inline-block">
      <Button variant="surface">
        <CalendarIcon className="mr-2 h-4 w-4" />
        {displayDate?.(date)}
      </Button>
      <Popover isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Calendar
          mode={mode}
          numberOfMonths={mode === "range" ? 2 : 1}
          selected={date}
          onSelect={handleSetDate}
          initialFocus
        />
      </Popover>
    </div>
  );
};
