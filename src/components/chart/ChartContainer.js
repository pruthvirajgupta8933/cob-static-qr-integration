import React from 'react';
import LineChart from './LineChart';

const ChartContainer = ({ data, chartTitle, extraParamName, xAxisTitle, yAxisTitle}) => {
    // const chartData = {
    //     labels: ['January', 'February', 'March', 'April', 'May', 'June','January', 'February', 'March', 'April', 'May', 'June'],
    //     values: [10, 20, 30, 25, 35, 30,10, 20, 30, 25, 35, 30],
    //     extraValues: [5, 10, 15, 12, 20, 18, 5, 10, 15, 12, 20, 18],
    //   };
    //   console.log("chartjs",chartData)

  return (
    <div class="chart-container" >
      <LineChart data={data} chartTitle={chartTitle} extraParamName={extraParamName} xAxisTitle={xAxisTitle} yAxisTitle={yAxisTitle} />
    </div>
  );
};

export default ChartContainer;