"use client";

import { useState } from "react";
import { format, subDays, startOfWeek, isSameDay } from "date-fns";

interface ContributionGridProps {
  weeks?: number;
  data?: Array<{ date: Date; count: number }>;
}

// Generate sample data if none provided
function generateSampleData(weeks: number = 52) {
  const data: Array<{ date: Date; count: number }> = [];
  const today = new Date();
  
  for (let i = 0; i < weeks * 7; i++) {
    const date = subDays(today, i);
    // Random activity count (0-10) with some realistic patterns
    const count = Math.floor(Math.random() * 11);
    data.push({ date, count });
  }
  
  return data.reverse();
}

function getIntensityLevel(count: number): string {
  if (count === 0) return "bg-gray-100";
  if (count <= 2) return "bg-green-200";
  if (count <= 5) return "bg-green-400";
  if (count <= 8) return "bg-green-600";
  return "bg-green-700";
}

export function ContributionGrid({ weeks = 52, data }: ContributionGridProps) {
  const [hoveredDay, setHoveredDay] = useState<{
    date: Date;
    count: number;
  } | null>(null);

  const contributionData = data || generateSampleData(weeks);
  const today = new Date();
  const startDate = subDays(today, weeks * 7 - 1);
  
  // Group data by weeks
  const weeksData: Array<Array<{ date: Date; count: number }>> = [];
  for (let week = 0; week < weeks; week++) {
    const weekStart = startOfWeek(subDays(today, (weeks - week - 1) * 7), {
      weekStartsOn: 0,
    });
    const weekData: Array<{ date: Date; count: number }> = [];
    
    for (let day = 0; day < 7; day++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + day);
      
      // Find matching data for this date
      const dayData = contributionData.find((d) =>
        isSameDay(d.date, date)
      );
      weekData.push(
        dayData || { date, count: 0 }
      );
    }
    weeksData.push(weekData);
  }

  const monthLabels: Array<{ month: string; weekIndex: number }> = [];
  let lastMonth = "";
  weeksData.forEach((week, weekIndex) => {
    if (week.length > 0) {
      const month = format(week[0].date, "MMM");
      if (month !== lastMonth) {
        monthLabels.push({ month, weekIndex });
        lastMonth = month;
      }
    }
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Activity Overview
        </h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded bg-gray-100"></div>
            <div className="w-3 h-3 rounded bg-green-200"></div>
            <div className="w-3 h-3 rounded bg-green-400"></div>
            <div className="w-3 h-3 rounded bg-green-600"></div>
            <div className="w-3 h-3 rounded bg-green-700"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex mb-2 pl-8">
            {monthLabels.map(({ month, weekIndex }, idx) => (
              <div
                key={idx}
                className="text-xs text-gray-600"
                style={{
                  marginLeft: idx === 0 ? `${weekIndex * 14}px` : "0px",
                }}
              >
                {month}
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 pt-6">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, idx) => (
                  <div
                    key={day}
                    className="text-xs text-gray-600 h-3 flex items-center justify-end pr-2"
                    style={{
                      visibility: idx % 2 === 0 ? "visible" : "hidden",
                    }}
                  >
                    {day}
                  </div>
                )
              )}
            </div>

            {/* Grid */}
            <div className="flex gap-1">
              {weeksData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => {
                    const intensity = getIntensityLevel(day.count);
                    const isToday = isSameDay(day.date, today);
                    
                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`w-3 h-3 rounded-sm ${intensity} transition-all duration-200 cursor-pointer hover:ring-2 hover:ring-gray-400 hover:ring-offset-1 ${
                          isToday ? "ring-2 ring-[#0D7AB8] ring-offset-1" : ""
                        }`}
                        onMouseEnter={() =>
                          setHoveredDay({ date: day.date, count: day.count })
                        }
                        onMouseLeave={() => setHoveredDay(null)}
                        title={`${format(day.date, "MMM d, yyyy")}: ${day.count} activities`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredDay && (
        <div className="mt-4 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg inline-block">
          <div className="font-semibold">
            {format(hoveredDay.date, "MMM d, yyyy")}
          </div>
          <div className="text-gray-300">
            {hoveredDay.count} {hoveredDay.count === 1 ? "activity" : "activities"}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
          <span>No activities</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-green-400"></div>
          <span>1-5 activities</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-green-600"></div>
          <span>6-8 activities</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-green-700"></div>
          <span>9+ activities</span>
        </div>
      </div>
    </div>
  );
}

