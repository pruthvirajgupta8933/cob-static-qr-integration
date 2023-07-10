import React from 'react'
import { Chart } from "react-google-charts";



function DataVisualizatoin({data, chartTitle}) {
  // const data = [
  //   ["Year", "Sales"],
  //   ["2004", 1000],
  //   ["2005", 1170],
  //   ["2006", 660],
  //   ["2007", 1030],
  // ];

  

  const options = {
    title: chartTitle,
    curveType: "function",
    legend: { position: "bottom" },
  };


  return (
    <React.Fragment>
    <hr/>
    <Chart
      chartType="LineChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
    <hr/>
    </React.Fragment>
  )
}

export default DataVisualizatoin