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
      const locationMap = {};

      allLocations.forEach((location) => {
        const city = location.split(/,| -/)[0].trim();
        if (!locationMap[city]) {
          locationMap[city] = 0;
        }
        locationMap[city] += events.filter((event) => event.location === location).length;
      });

      return Object.entries(locationMap).map(([city, count]) => ({ city, count }));
    };

    setData(getData());
  }, [allLocations, events]);

  return (
    <ResponsiveContainer width="100%" minWidth={500} height={400}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: -30 }}>
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
          domain={[0, 'dataMax + 1']}
          tick={{ fontSize: 14 }}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          formatter={(value, name) => [`${value}`, "Events"]}
          labelFormatter={(label) => `City: ${label}`}
        />
        <Scatter name="Event count" data={data} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default CityEventsChart;
