import { Component, onCleanup, onMount, createSignal } from 'solid-js';
import './dashboard.css';
import { create } from '@amcharts/amcharts4/core';
import { XYChart, CategoryAxis, ValueAxis, ColumnSeries, PieChart, PieSeries, LineSeries } from '@amcharts/amcharts4/charts';
import { color } from '@amcharts/amcharts4/core';

const Dashboard: Component = () => {
    let chartDiv: HTMLDivElement;
    let pieChartDiv: HTMLDivElement;
    let lineChartDiv: HTMLDivElement;
    let subscriptionChartDiv: HTMLDivElement;

    // Create signals for statistics
    const [totalUsers, setTotalUsers] = createSignal(3520000);
    const [activeUsers, setActiveUsers] = createSignal(3200000);
    const [totalMovies, setTotalMovies] = createSignal(3520000);
    
    // Loading state
    const [loading, setLoading] = createSignal(true);
    const [error, setError] = createSignal(null);

    // Data for movie genres
    const movieGenres = [
        { genre: "Action", value: 70, color: "#455EFF" },
        { genre: "Comedy", value: 30, color: "#581E9D" },
        { genre: "Drama", value: 20, color: "#878EFE" },
        { genre: "Horror", value: 10, color: "#7159FE" },
        { genre: "Documentary", value: 20, color: "#0E00A2" },
    ];

    // Audience activity data for the line chart
    const audienceActivityData = [
        { date: "00.00", audience: 2500 },
        { date: "02.00", audience: 3500 },
        { date: "04.00", audience: 5000 },
        { date: "06.00", audience: 2800 },
        { date: "08.00", audience: 3000 },
        { date: "10.00", audience: 10000 },
        { date: "12.00", audience: 7500 },
        { date: "14.00", audience: 4000 },
        { date: "16.00", audience: 2000 },
        { date: "18.00", audience: 5000 },
        { date: "20.00", audience: 3500 },
        { date: "22.00", audience: 2500 },
        { date: "23.00", audience: 6000 },
    ];

    // Subscription package data
    const subscriptionPackageData = [
        { package: "ULO LITE", count: 5000 },
        { package: "ULO PLUS", count: 10000 },
        { package: "ULO MAX", count: 15000 },
        { package: "ULO FAMILY", count: 20000 },
        { package: "ULO INFINITY", count: 25000 },
    ];

    onMount(() => {
        try {
            // Simulate a data fetch with a timeout
            setTimeout(() => {
                // Create XY chart instance
                const chart = create(chartDiv, XYChart);

                // Create axes
                const categoryAxis = chart.xAxes.push(new CategoryAxis());
                categoryAxis.dataFields.category = "category";

                const valueAxis = chart.yAxes.push(new ValueAxis());

                // Create series
                const series = chart.series.push(new ColumnSeries());
                series.dataFields.valueY = "value";
                series.dataFields.categoryX = "category";
                series.name = "Data Series";
                series.tooltipText = "{category}: [bold]{value}[/]";

                // Chart data
                chart.data = [
                    { category: "Jan", value: 50 },
                    { category: "Feb", value: 75 },
                    { category: "March", value: 100 },
                    { category: "Apr", value: 85 },
                    { category: "May", value: 120 },
                    { category: "June", value: 50 },
                    { category: "July", value: 75 },
                    { category: "Aug", value: 100 },
                    { category: "Sept", value: 85 },
                    { category: "Oct", value: 120 },
                    { category: "Nov", value: 85 },
                    { category: "Dec", value: 120 }
                ];

                // Clean up chart on unmount
                onCleanup(() => {
                    chart.dispose();
                });

                // Create Pie chart instance
                const pieChart = create(pieChartDiv, PieChart);

                // Create pie series
                const pieSeries = pieChart.series.push(new PieSeries());
                pieSeries.dataFields.value = "value";
                pieSeries.dataFields.category = "genre";

                // Remove unnecessary details from pie chart
                pieSeries.slices.template.tooltipText = ""; // Remove tooltip
                pieSeries.labels.template.disabled = true;  // Disable percentage or genre name labels
                pieSeries.ticks.template.disabled = true;   // Disable ticks lines

                // Pie chart data
                pieChart.data = movieGenres;

                // Clean up pie chart on unmount
                onCleanup(() => {
                    pieChart.dispose();
                });

                // Create XY chart instance for audience activity (line chart)
                const lineChart = create(lineChartDiv, XYChart);

                // Create axes for line chart
                const lineCategoryAxis = lineChart.xAxes.push(new CategoryAxis());
                lineCategoryAxis.dataFields.category = "date";

                const lineValueAxis = lineChart.yAxes.push(new ValueAxis());

                // Disable grid lines for Y axis
                lineValueAxis.renderer.grid.template.disabled = true; // Disable grid lines on the Y axis

                // Create line series for audience activity
                const lineSeries = lineChart.series.push(new LineSeries());
                lineSeries.dataFields.valueY = "audience";
                lineSeries.dataFields.categoryX = "date";
                lineSeries.strokeWidth = 3;
                lineSeries.tooltipText = "{category}: [bold]{value}[/]}";
                lineSeries.stroke = color("#00A2FF");

                // Make the line smooth by setting tensionX
                lineSeries.tensionX = 0.8; // Adjust the value for more or less smoothness (0 to 1)

                // Line chart data
                lineChart.data = audienceActivityData;

                // Clean up line chart on unmount
                onCleanup(() => {
                    lineChart.dispose();
                });

                // Create XY chart instance for subscription packages
                const subscriptionChart = create(subscriptionChartDiv, XYChart);

                // Create axes for subscription chart
                const subscriptionCategoryAxis = subscriptionChart.xAxes.push(new CategoryAxis());
                subscriptionCategoryAxis.dataFields.category = "package";

                const subscriptionValueAxis = subscriptionChart.yAxes.push(new ValueAxis());
                subscriptionValueAxis.min = 0; // Set minimum value for Y axis
                subscriptionValueAxis.renderer.minGridDistance = 50; // Optional: set the minimum distance between grid lines
                subscriptionValueAxis.renderer.labels.template.disabled = false; // Enable labels on Y axis

                // Create column series for subscription packages
                const subscriptionSeries = subscriptionChart.series.push(new ColumnSeries());
                subscriptionSeries.dataFields.valueY = "count";
                subscriptionSeries.dataFields.categoryX = "package";
                subscriptionSeries.name = "Subscriptions";
                subscriptionSeries.tooltipText = "{category}: [bold]{value}[/]}";

                // Subscription chart data
                subscriptionChart.data = subscriptionPackageData;

                // Clean up subscription chart on unmount
                onCleanup(() => {
                    subscriptionChart.dispose();
                });

                // Set loading to false after charts are set up
                setLoading(false);
            }, 1000); // Simulate loading time
        } catch (err) {
            setError("An error occurred while loading the data.");
            setLoading(false);
        }
    });

    return (
        <div class="dashboard">
            <header class="dashboard-header">
                <div class="header-left">
                    <h1>ULO REPORT</h1>
                </div>
                <div class="header-right">
                    <div class="date-range">02 OKT 2024 - 03 OKT 2024</div>
                    <div class="user-profile">William Andre</div>
                </div>
            </header>

            <section class="stats-section">
                <div class="stat-card1" onClick={() => setTotalUsers(totalUsers() + 1)}>
                    Total Users: {totalUsers()}
                </div>
                <div class="stat-card2" onClick={() => setActiveUsers(activeUsers() + 1)}>
                    Active Users: {activeUsers()}
                </div>
                <div class="stat-card3" onClick={() => setTotalMovies(totalMovies() + 1)}>
                    Total Movies: {totalMovies()}
                </div>
            </section>

            {loading() && (
                <div class="loading">
                    Loading data...
                </div>
            )}

            {error() && (
                <div class="error">
                    {error()}
                </div>
            )}

            <section class="charts-section">
                <div class="chart-card revenue">
                    <h3>Revenue</h3>
                    <h2>Rp 15,590,000</h2>
                    <div ref={chartDiv} style={{ height: "300px", width: "100%" }}></div>
                </div>

                <div class="chart-card genre">
                    <h3>Movie Genre</h3>
                    <div ref={pieChartDiv} style={{ height: "300px", width: "100%" }}></div>
                    <section class="legend-section">
                        <div class="legend">
                            <div class="legend-left">
                                {movieGenres.slice(0, 2).map(genre => (
                                    <div class="legend-item">
                                        <div class={`legend-color legend-color-${genre.genre.toLowerCase()}`}></div>
                                        <span>{genre.genre}</span>
                                    </div>
                                ))}
                            </div>

                            <div class="legend-right">
                                {movieGenres.slice(2).map(genre => (
                                    <div class="legend-item">
                                        <div class={`legend-color legend-color-${genre.genre.toLowerCase()}`}></div>
                                        <span>{genre.genre}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                <div class="chart-card audience-activity">
                    <h2>Audience Activity</h2>
                    <div ref={lineChartDiv} style={{ height: "300px", width: "100%" }}></div>
                </div>

                <div class="chart-card subscription-package">
                    <h2>Subscription Packages</h2>
                    <div ref={subscriptionChartDiv} style={{ height: "300px", width: "100%" }}></div>
                </div>
            </section>

            <section class="table-section">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Subscription Package</th>
                            <th>Status</th>
                            <th>Last Login</th>
                            <th>Phone Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Sienna00</td>
                            <td>sienna@gmail.com</td>
                            <td>Ulo Plus</td>
                            <td>Active</td>
                            <td>Today</td>
                            <td>-</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section class="popular-films">
                <h3>Popular Films</h3>
                <ul>
                    <li>Titanic</li>
                    <li>One Piece</li>
                    <li>Extraction 2</li>
                    <li>The Angry Birds Movie 2</li>
                    <li>The Architecture of Love</li>
                </ul>
            </section>
        </div>
    );
};

export default Dashboard;
