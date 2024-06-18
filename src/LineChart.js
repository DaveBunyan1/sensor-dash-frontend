import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

const LineChart = ({ table }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://10.250.66.171:5000/${table}/all`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [table]);

    useEffect(() => {
        if (data.length === 0) return;

        // D3 code to create the line chart
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        d3.select(`#chart-${table}`).selectAll('*').remove();
        
        const svg = d3.select(`#chart-${table}`)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => new Date(d.time)))
            .range([0, width]);

        svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        const y = d3.scaleLinear()
            .domain([d3.min(data, d => d.value), d3.max(data, d => d.value)])
            .nice()
            .range([height, 0]);

        svg.append('g')
            .call(d3.axisLeft(y));

        const line = d3.line()
            .x(d => x(new Date(d.time)))
            .y(d => y(d.value));

        // Title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -margin.top / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .text(`${table}`); // Replace with your desired title

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2)
            .attr('d', line);
    }, [data, table]);

    return (
        <div id={`chart-${table}`}></div>
    );
};

export default LineChart;