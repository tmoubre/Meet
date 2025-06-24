// src/components/CityEventsChart.jsx

import React, { useState, useEffect } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CityEventsChart = ({ allLocations, events }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = () => {
      const cityDataMap = new Map();

      allLocations.forEach((location) => {
        const count = events.filter((event) => event.location === location).length;
        const city = location.split(/,| -/)[0].trim();

        // Accumulate event counts for cities with same display name
        if (cityDataMap.has(city)) {
          cityDataMap.set(city, cityDataMap.get(city) + count);
        } else {
          cityDataMap.set(city, count);
        }
      });

      const chartData = Array.from(cityDataMap, ([city, count]) => ({
        city,
        count,
      }));

      return chartData;
    };

    setData(getData());
  }, [allLocations, events]);

  return (
    <ResponsiveContainer width="99%" height={400}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
        <CartesianGrid />
        <XAxis
          type="category"
          dataKey="city"
          name="City"
          angle={60}
          interval={0}
          tick={{ dx: 20, dy: 40, fontSize: 14 }}
        />
        <YAxis
          type="number"
          dataKey="count"
          name="Number of events"
          allowDecimals={false}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          formatter={(value, name) => [value, "Event count"]}
          labelFormatter={(label) => `City: ${label}`}
        />
        <Scatter data={data} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default CityEventsChart;
