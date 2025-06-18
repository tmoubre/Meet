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
        const count = events.filter(
          (event) => event.location === location
        ).length;
        const city = location.split("/,|-/ ")[0];
        return { city, count };
      });
    };

    setData(getData());
  }, [allLocations, events]);

  return (
    <ResponsiveContainer width="99%" height={400}>
      <ScatterChart
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid />
        <XAxis type="category" dataKey="city" name="City" />
        <YAxis type="number" dataKey="count" name="Number of events"  angle={60} interval={0} tick={{ dx: 20, dy: 40, fontSize: 14 }}/>
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter name="Event count" data={data} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default CityEventsChart;
