import React, { useState, useEffect, useMemo } from "react";
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
import { colourArr } from "../../../../utilities/colourArr";



const colors = colourArr;

const CustomLegend = ({ data, colorMode }) => {


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


  const chartData = useMemo(() =>
    chartType === "donut"
      ? data
        ?.filter((entry) => entry.trans_mode)
        .map((entry, index) => {
          return {
            name: entry.trans_mode,
            value: entry.total_paid,
            color: colors[index % colors.length],
          };
        })
      : Array.isArray(data)
        ? data?.map((entry) => {

          return {
            date: Object.keys(entry)[0],
            value: Object.values(entry)[0] < 0 ? null : Object.values(entry)[0],
          };
        })
        : [],
    [data])



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
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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
      <React.Fragment>
        <div className="card-body border-0 bg-white">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={115}
                fill="#82ca9d"
                label={({ name, value }) => `${value}`}

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
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card-footer border-0 bg-white">
          <CustomLegend data={chartData} colorMode={colorMode} />
        </div>
      </React.Fragment>

    );
  }

  return null;
};

export default Charts;
