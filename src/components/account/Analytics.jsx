import { useState } from "react";

import { DatePicker } from "@/components/DatePicker";
import { Select } from "@/components/fields/Select";
import { Tabs } from "@/components/Tabs";
import { UsageChart } from "@/components/UsageChart";

import { useAnalytics } from "@/hooks/use-analytics";

const Usage = ({ dateRange, metrics }) => {
  const { start, end } = dateRange;
  const { data, error, isLoading } = useAnalytics({ start, end, metrics: metrics?.map(metric => metric?.key)?.filter(n => n) });
  return(
    <div className="mt-12 flex flex-col space-y-12 md:space-y-0 md:flex-row md:space-x-6 pe-12">
      {metrics.map(metric => {
        const { label, key, className } = metric;
        /*
        if (!key || !data?.[key]) {
          return <div className={["bg-pink-800", className].join(' ')}>No data available</div>;
        };
        */
        if (isLoading) return <div>Loading...</div>;
        if (error) return <div>Error: Unable to load data</div>;
        return(
          <div className={className ?? ''}>
            <UsageChart
              dateRange={dateRange}
              data={data?.[key] ?? []}
              title={label ?? ''}
            />
          </div>
        );
      })}
    </div>
  );
};

const getDateRangeFromPreset = (range) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const date = today.getDate();
  switch (range) {
    case "last7Days":
      return {
        start: new Date(year, month, date-7),
        end: new Date(year, month, date)
      };
    case "last30Days":
      return {
        start: new Date(year, month, date-30),
        end: new Date(year, month, date)
      };
    case "today":
      return {
        start: new Date(year, month, date),
        end: new Date(year, month, date)
      };
    case "yesterday":
      return {
        start: new Date(year, month, date-1),
        end: new Date(year, month, date-1)
      };
    case "thisWeek":
      const currentDay = today.getDay();
      const startOfWeek = new Date(today.getTime() - (currentDay * 24 * 60 * 60 * 1000));
      const endOfWeek = new Date(startOfWeek.getTime() + (6 * 24 * 60 * 60 * 1000));
      return {
        start: startOfWeek,
        end: endOfWeek
      };
    case "lastWeek":
      const lastWeekDay = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000)).getDay();
      const startOfLastWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000) - (lastWeekDay * 24 * 60 * 60 * 1000));
      const endOfLastWeek = new Date(startOfLastWeek.getTime() + (6 * 24 * 60 * 60 * 1000));
      return {
        start: startOfLastWeek,
        end: endOfLastWeek
      };
    case "thisMonth":
      return {
        start: new Date(year, month, 1),
        end: new Date(year, month + 1, 0)
      };
    case "lastMonth":
      return {
        start: new Date(year, month-1, 1),
        end: new Date(year, month, 0)
      };
    case "thisQuarter":
      const quarterStartMonth = Math.floor(month / 3) * 3;
      return {
        start: new Date(year, quarterStartMonth, 1),
        end: new Date(year, quarterStartMonth + 3, 0)
      };
    case "lastQuarter":
      const prevQuarterStartMonth = Math.floor((month - 1) / 3) * 3;
      return {
        start: new Date(year, prevQuarterStartMonth, 1),
        end: new Date(year, prevQuarterStartMonth + 3, 0)
      };
    case "thisYear":
      return {
        start: new Date(year, 0, 1),
        end: new Date(year+1, 0, 0)
      };
    case "lastYear":
      return {
        start: new Date(year-1, 0, 1),
        end: new Date(year, 0, 0)
      };
    default:
      return null;
  };
};

const presetOptions = Object.freeze([
  { label: "Last 7 Days", value: "last7Days" },
  { label: "Last 30 Days", value: "last30Days" },
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "thisWeek" },
  { label: "Last Week", value: "lastWeek" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last Month", value: "lastMonth" },
  { label: "This Quarter", value: "thisQuarter" },
  { label: "Last Quarter", value: "lastQuarter" },
  { label: "This Year", value: "thisYear" },
  //{ label: "Last Year", value: "lastYear" },
]);

const Analytics = () => {
  const start = new Date();
  const end = new Date();
  const [dateRange, setDateRange] = useState({ start, end });
  const [dateRangePreset, setDateRangePreset] = useState();

  const handleDateRangeSelectChange = (selectedDate) => {
    if (!selectedDate?.from || !selectedDate?.to) return;
    const { from, to } = selectedDate;
    const start = new Date(from);
    const end = new Date(to);
    setDateRangePreset(undefined);
    setDateRange({ start, end });
  };

  const handleDateRangePresetChange = (presetValue) => {
    if (!presetValue) return;
    const dateRange = getDateRangeFromPreset(presetValue);
    setDateRangePreset(presetValue);
    setDateRange(dateRange);
  };

  return(
    <div className="flex flex-col space-y-8">
      <div
        className={[
          "flex mx-auto md:ms-auto",
          "md:flex-row md:space-x-2 md:items-center",
          "flex-col space-y-2 justify-center"
        ].join(' ')}
      >
        <DatePicker
          mode="range"
          value={{
            from: dateRange?.start ?? new Date(),
            to: dateRange?.end ?? new Date(),
          }}
          onChange={handleDateRangeSelectChange}
          className="min-w-[275px]"
        />
        <Select
          label="Date Range Preset"
          items={presetOptions}
          value={dateRangePreset}
          onChange={handleDateRangePresetChange}
          className="py-2 mb-6 min-w-[250px]"
        />
      </div>
      <div className="mx-auto md:me-auto">
        <Tabs items={[
          {
            label: "USAGE",
            content: (
              <Usage
                dateRange={dateRange}
                metrics={[
                  {
                    label: "Signups",
                    key: "signup",
                    className: "h-48 w-[350px] md:w-1/2"
                  },
                  {
                    label: "Sessions",
                    key: "session_start",
                    className: "h-48 w-[350px] md:w-1/2"
                  }
                ]}
              />
            )
          },
          {
            label: "DATA",
            content: (
              <Usage
                dateRange={dateRange}
                metrics={[
                  {
                    label: "API Requests",
                    key: "api_request",
                    className: "h-48 w-[350px] md:w-1/2"
                  },
                  {
                    label: "Tokens",
                    key: "tokens",
                    className: "h-48 w-[350px] md:w-1/2"
                  }
                ]}
              />
            )
          }
        ]} />
      </div>
    </div>
  );
};
export default Analytics;
