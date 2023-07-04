import React, { useEffect } from 'react'
import { Chart } from "react-google-charts";



function DataVisualizatoin() {
  const data = [
    ["Year", "Sales"],
    ["2004", 1000],
    ["2005", 1170],
    ["2006", 660],
    ["2007", 1030],
  ];

  const options = {
    title: "Company Performance",
    curveType: "function",
    legend: { position: "bottom" },
  };


  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="400px"
      data={data}
      options={options}

    />
  )
}

export default DataVisualizatoin