import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { groupBy, sumBy } from 'lodash';

const StatisticsPage = ({ trainings }) => {
  const [statistics, setStatistics] = useState([]);

  useEffect(() => {
    if (trainings) {
      // Ryhmitellään harjoitukset tyyppien mukaan
      const groupedByActivity = groupBy(trainings, 'activity');

      // Lasketaan kunkin harjoitustyypin varatut minuutit
      const stats = Object.keys(groupedByActivity).map(activity => {
        const totalMinutes = sumBy(groupedByActivity[activity], 'duration');
        return {
          activity,
          totalMinutes,
        };
      });

      setStatistics(stats);
    }
  }, [trainings]);

  return (
    <div>
      <h2>Harjoitustyypit ja varatut minuutit</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={statistics}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="activity" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalMinutes" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatisticsPage;
