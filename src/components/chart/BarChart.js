import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarChart = ({ data, chartTitle, extraParamName, xAxisTitle, yAxisTitle }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            // Destroy the previous chart instance
            chartInstance.current.destroy();
        }

        if (chartRef && chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [
                        {
                            label: chartTitle, // line label
                            data: data.values,
                            borderColor: 'rgba(75,192,192,1)',
                            backgroundColor: '#377CCF',
                            borderWidth: 1, // line width
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            tension: 0.4,
                        },
                    ],
                },
                options: {
                    plugins: {
                        title: {
                            display: false, // not required to display
                            text: 'Line Chart', // chart title
                        },
                        tooltip: {
                            callbacks: {
                                title: (tooltipItems) => {
                                    return data.labels[tooltipItems[0].dataIndex];
                                },
                                label: (context) => {
                                    const dataset = context.dataset;
                                    const value = dataset.data[context.dataIndex];
                                    const extraValue = extraParamName + ' : ' + data.extraValues[context.dataIndex];
                                    return `${dataset.label}: ${value} | ${extraValue}`;
                                },
                            },
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: xAxisTitle
                            },
                            grid: {
                                display: false, // hide the x-axis grid lines
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: yAxisTitle
                            },
                            grid: {
                                display: false, // hide the x-axis grid lines
                            },
                        }
                    },
                },
            });
        }

        // Cleanup: Destroy the chart instance when the component is unmounted
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data]);

    return <canvas ref={chartRef} />;
};

export default BarChart;


