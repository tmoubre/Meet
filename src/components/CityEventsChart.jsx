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
      // Generate unique city names and count matching events
      const cityCounts = {};

      events.forEach((event) => {
        const fullLocation = event.location;
        const city = fullLocation.split(/,| -/)[0]; // Fix regex

        if (!cityCounts[city]) {
          cityCounts[city] = 1;
        } else {
          cityCounts[city]++;
        }
      });

      return Object.entries(cityCounts).map(([city, count]) => ({
        city,
        count,
      }));
    };

    setData(getData());
  }, [events]);

  return (
    <ResponsiveContainer width="99%" height={400}>
      <ScatterChart
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid />
        <XAxis type="category" dataKey="city" name="City" />
        <YAxis
          type="number"
          dataKey="count"
          name="Number of events"
          allowDecimals={false}
          tick={{ fontSize: 14 }}
        />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter name="Event count" data={data} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default CityEventsChart;

