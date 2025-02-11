import React from "react";
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
    Legend
} from "recharts";

const lineChartData = [
    { month: "Jan", value: 16 },
    { month: "Feb", value: 18.2 },
    { month: "Mar", value: 23.1 },
    { month: "Apr", value: 27.9 },
    { month: "May", value: 32.2 },
    { month: "Jun", value: 36.4 },
    { month: "Jul", value: 38.8 },
    { month: "Aug", value: 38.4 },
    { month: "Sep", value: 35.5 },
    { month: "Oct", value: 29.2 },
    { month: "Nov", value: 22 },
    { month: "Dec", value: 17.8 }
];

const pieChartData = [
    { name: "UPI", value: 1000, color: "#ff6666" },
    { name: "Cards", value: 1500, color: "#ffcc66" },
    { name: "Wallet", value: 3000, color: "#66b3ff" },
    { name: "Net Banking", value: 2000, color: "#99ff99" }
];

const Charts = ({ chartType }) => {
    if (chartType === "line") {
        return (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#4caf50" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        );
    }

    if (chartType === "donut") {
        return (
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#82ca9d"
                        label
                    >
                        {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
            </ResponsiveContainer>
        );
    }

    return null;
};

export default Charts;
