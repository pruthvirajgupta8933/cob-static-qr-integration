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
    { month: "Dec", value: 17.8 }
];

const pieChartData = [
    { name: "UPI", value: 3000, color: "#F93C65" },
    { name: "Cards", value: 1500, color: "#F89131" },
    { name: "Wallet", value: 1000, color: "#008ADE" },
    { name: "Net Banking", value: 2000, color: "#029053" }
];

const CustomLegend = ({ data }) => {
    return (
        <div className="d-inline-flex flex-wrap gap-2 mt-3">
            {data.map((entry, index) => (
                <div
                    key={index}
                    className="d-inline-flex align-items-center border rounded px-3 py-2 gap-2"
                    style={{
                        borderColor: entry.color,
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
            <div className="w-100 text-center  p-3">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#82ca9d"
                            label
                        >
                            {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <CustomLegend data={pieChartData} />
            </div>
        );
    }

    return null;
};

export default Charts;
