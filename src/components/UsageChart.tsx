import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const formatDate = (date: Date) => {
  const options: any = {
    day: "2-digit",
    month: "short",
    timeZone: "UTC"
  };
  return date?.toLocaleDateString("en-US", options) ?? "";
};

const CustomTooltip = ({
  active,
  payload,
  label, // day
  title,
  start
}: {
  title: string;
  start: string;
  active?: boolean;
  label?: number;
  payload?: any[];
}) => {
  if (active && payload && payload?.length && label) {
    if (label !== 0 && typeof label !== "number") {
      return null;
    }
    const date = new Date(start);
    date.setDate(date.getDate() + label);
    const formattedDate = formatDate(date);
    return (
      <div className="surfaces rings rounded px-2">
        <span className="">{formattedDate}</span>
        <div className="flex flex-row space-x-2 items-center">
          <span
            className="h-4 w-4 rounded bg-pink-600"
            style={{ backgroundColor: payload?.[0]?.fill }}
          ></span>
          <span className="text-xs">{title}</span>
          <span className="text-sm">{payload?.[0]?.value}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const UsageChart = ({
  dateRange,
  data,
  title,
  colors
}: {
  dateRange: any;
  data: any[];
  title: string;
  colors: any;
}) => {
  const { start, end } = dateRange;
  //if (!start || !end || data?.length < 1) return null;
  if (!start || !end) return null;
  const formattedStartDate = formatDate(new Date(start));
  const formattedEndDate = formatDate(new Date(end));
  return (
    <div className="flex flex-col space-y-2 h-[300px] w-[600px]">
      <div className="mx-auto font-bold">{title}</div>
      <div className="flex flex-row justify-between items-center text-xs placeholders">
        <span className="ms-16">{formattedStartDate}</span>
        <span>{formattedEndDate}</span>
      </div>
      <hr className="mx-auto ms-12 md:ms-20 w-5/6 border-0 border-t border-neutral-200 dark:border-neutral-700" />
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart data={data}>
          <XAxis
            dataKey="day"
            type="number"
            interval={0}
            //tickFormatter={formatDate}
            tick={false}
            //ticks={[1, data.length]}
            //domain={[1, data.length]}
          />
          <YAxis />
          <Tooltip
            content={<CustomTooltip title={title} start={dateRange?.start} />}
          />
          <Area
            type="monotone"
            dataKey="value"
            dot={false}
            stroke="#000000"
            fill="#ccc"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
