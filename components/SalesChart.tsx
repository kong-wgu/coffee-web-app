import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SalesData {
  coffee_name: string;
  sales: number;
  hour_of_day: number;
}

interface SalesChartProps {
  data: SalesData[];
}

const SalesChart = ({ data }: SalesChartProps) => {
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.sales - a.sales).slice(0, 3);
  }, [data]);

  return (
    <div className="w-full h-[400px] animate-slide-up">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sortedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value) => [
              `${value} sales`,
              `${data.filter((what) => what.sales == value).at(0).coffee_name} at ${sortedData[0].hour_of_day}`,
            ]}
          />
          <Bar
            dataKey="sales"
            label="coffee_name"
            fill="#8B5E3C"
            radius={[4, 4, 0, 0]}
            maxBarSize={100}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;