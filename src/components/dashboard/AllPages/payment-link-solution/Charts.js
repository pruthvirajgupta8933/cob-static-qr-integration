import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const lineChartData = [
  { month: "Jan 2023", value: 16 },
  { month: "Feb 2024", value: 18.2 },
  { month: "Mar", value: 23.1 },
  { month: "Apr", value: 27.9 },
  { month: "May", value: 32.2 },
  { month: "Jun", value: 36.4 },
  { month: "Jul", value: 38.8 },
  { month: "Aug", value: 38.4 },
  { month: "Sep", value: 35.5 },
  { month: "Oct", value: 29.2 },
  { month: "Nov", value: 22 },
  { month: "Dec", value: 17.8 },
];

const pieChartData = [
  { name: "UPI", value: 3000, color: "#F93C65" },
  { name: "Cards", value: 1500, color: "#F89131" },
  { name: "Wallet", value: 1000, color: "#008ADE" },
  { name: "Net Banking", value: 2000, color: "#029053" },
];

const CustomLegend = ({ data, colorMode }) => {
  const borderColor = colorMode === "dark" ? "#fff" : "#000"; // Light or dark mode logic

  return (
    <div className="d-inline-flex flex-wrap gap-2 mt-3">
      {data?.map((entry, index) => (
        <div
          key={index}
          className="d-inline-flex align-items-center border rounded px-3 py-2 gap-2"
          style={{
            borderColor: colorMode === "dark" ? "#fff" : entry.color, // Dynamic border color
            borderWidth: "2px",
            borderStyle: "solid",
            backgroundColor: "#fff",
            color: entry.color,
            fontWeight: "bold",
          }}
        >
          <span
            className="rounded-circle d-inline-block"
            style={{
              width: "12px",
              height: "12px",
              backgroundColor: entry.color,
            }}
          ></span>

          {entry.name}
        </div>
      ))}
    </div>
  );
};

const Charts = ({ data, chartType, colorMode = "light" }) => {
  const [total, setTotal] = useState(0);
  const chartData =
    chartType === "donut"
      ? data
          ?.filter((entry) => entry.trans_mode)
          .map((entry, index) => {
            return {
              name: entry.trans_mode,
              value: entry.total_paid,
              color: pieChartData[index % pieChartData.length].color,
            };
          })
      : Array.isArray(data)
      ? data?.map((entry) => {
          return {
            date: Object.keys(entry)[0],
            value: Object.values(entry)[0],
          };
        })
      : [];

  useEffect(() => {
    const fetchData = async () => {
      const data = chartData?.map((entry) => entry.value);
      const sum = data?.reduce((acc, value) => acc + value, 0);
      setTotal(sum);
    };

    fetchData();
  }, [chartData]);

  if (!data) return null;
  if (chartType === "line") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#238BE6"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (chartType === "donut") {
    return (
      <div className="w-100 text-center p-3">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#82ca9d"
              label
            >
              {chartData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>

            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
              <tspan x="50%" dy="-10" className="font-weight-bold">
                Total
              </tspan>
              <tspan x="50%" dy="20" style={{ fontSize: "19px" }}>
                {total}
              </tspan>
            </text>
          </PieChart>
        </ResponsiveContainer>
        <CustomLegend data={chartData} colorMode={colorMode} />
      </div>
    );
  }

  return null;
};

export default Charts;
