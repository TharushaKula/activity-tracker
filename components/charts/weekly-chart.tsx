"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatDate } from "@/lib/utils";
import { Activity } from "@/lib/firebase/activities";

interface WeeklyChartProps {
  activitiesByDay: Activity[][];
  weekDates: Date[];
}

const COLORS = ["#0D7AB8", "#0D7AB8", "#0D7AB8", "#0D7AB8", "#0D7AB8", "#0D7AB8", "#0D7AB8"];

export function WeeklyChart({ activitiesByDay, weekDates }: WeeklyChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = weekDates.map((date, index) => ({
    name: formatDate(date).split(",")[0], // Get day name
    activities: activitiesByDay[index].length,
    fullDate: formatDate(date),
  }));

  if (!mounted) {
    return (
      <div className="w-full h-[350px] py-4 flex items-center justify-center">
        <div className="text-gray-500">Loading chart...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[350px] py-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">{payload[0].payload.fullDate}</p>
                    <p className="text-[#0D7AB8] font-semibold">
                      Activities: {payload[0].value}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="activities" radius={[8, 8, 0, 0]} fill="#0D7AB8">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

