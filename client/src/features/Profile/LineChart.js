import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js';
import PropTypes from 'prop-types';

const LineChart = ({ xyData, label }) => {
    const chartRef = useRef();
    var timeFormat = 'D/M/YYYY';

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');

        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: label,
                        borderColor: '#7619cc',
                        backgroundColor: '#7619cc80',
                        fill: false,
                        data: xyData
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: label,
                    fontSize: '30',
                    fontFamily: 'Lato',
                    fontStyle: 'normal',
                    fontColor: '#252227'
                },
                legend: {
                    display: false
                },
                elements: {
                    line: {
                        tension: 0
                    }
                },

                scales: {
                    xAxes: [
                        {
                            type: 'time',
                            time: {
                                parser: timeFormat,
                                round: 'day',
                                tooltipFormat: 'll',
                                minUnit: 'day'
                            },
                            ticks: {
                                beginAtZero: false,
                                source: 'auto',
                                maxTicksLimit: 20
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Date'
                            },
                            gridLines: {
                                display: false,
                                zeroLineWidth: '5'
                            }
                        }
                    ],
                    yAxes: [
                        {
                            scaleLabel: {
                                display: true,
                                labelString: label
                            },
                            ticks: {
                                precision: 0
                            }
                        }
                    ]
                }
            }
        });
    });

    return (
        <div className='profile__chart'>
            <canvas ref={chartRef} />
        </div>
    );
};
LineChart.propTypes = {
    xyData: PropTypes.arrayOf(PropTypes.object).isRequired,
    label: PropTypes.string.isRequired
};

export default LineChart;
