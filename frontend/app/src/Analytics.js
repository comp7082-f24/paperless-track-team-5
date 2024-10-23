import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Analytics.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Analytics = () => {
    // Fake data for the pie chart
    const data = {
        labels: ['Rent', 'Food', 'Gas', 'Miscellaneous'],
        datasets: [
            {
                label: 'Spending Breakdown',
                data: [500, 300, 100, 150], // Example values for now
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8E44AD'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8E44AD'],
            },
        ],
    };

    return (
        <div className="analytics-container">
            <div className="chart-section">
                <h2>Analytics</h2>
                <div className="pie-chart">
                    <Pie data={data} />
                </div>
                <div className="comparison">
                    <h3>Comparison</h3>
                    <ul>
                        <li>Average Person: $1500</li>
                        <li>Spends: $900</li>
                        <li>Rent: $500</li>
                        <li>Gas: $100</li>
                    </ul>
                </div>
            </div>
            <div className="extra-info">
                {/* Placeholder for additional info */}
                <h3>Placeholder for Text or Data</h3>
                <p>Think about adding some data here or an image.</p>
            </div>
        </div>
    );
};

export default Analytics;
