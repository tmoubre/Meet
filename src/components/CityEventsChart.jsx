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
      return allLocations.map((location) => {
        const count = events.filter((event) => event.location === location).length;
        const city = location.split(/,| -/)[0].trim();
        return { city, count };
      });
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
          angle={-45}
          interval={0}
          tick={{ fontSize: 12, dy: 10 }}
        />
        <YAxis
          type="number"
          dataKey="count"
          name="Number of events"
          tickFormatter={(value) => Math.round(value)}
        />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter data={data} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default CityEventsChart;


