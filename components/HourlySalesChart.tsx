import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HourlySalesData {
  hour: number;
  totalSales: number;
}

interface HourlySalesChartProps {
  data: HourlySalesData[];
}

const HourlySalesChart = ({ data }: HourlySalesChartProps) => {

  const sortedData = useMemo(() => {
    let what :HourlySalesData[] = [];

    data.map((dat) => {
      if(dat.hour <= 12){
        what.push(dat)
      }else{
        let convert = dat.hour - 12;
        let newData : HourlySalesData = {
          hour: convert,
          totalSales : dat.totalSales
        }
        what.push(newData)
      }
    })

    return what;
  }, [data])

  return (
    <div className="w-full h-[400px] animate-slide-up mt-8">
      <h2 className="text-xl font-semibold text-coffee-dark mb-4">
        Hourly Sales Distribution {"(24H format)"}
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value} sales`, 'Total Sales']}
          />
          <Line
            type="monotone"
            dataKey="totalSales"
            stroke="#8B5E3C"
            strokeWidth={2}
            dot={{ fill: "#4A3428", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HourlySalesChart;