"use client";

import { useState, useMemo, useRef } from "react";
import { format, subDays, startOfWeek, isSameDay, startOfDay } from "date-fns";
import { Activity } from "@/lib/firebase/activities";

interface ContributionGridProps {
  weeks?: number;
  activities?: Activity[];
}

// Process activities to count per day
function processActivities(activities: Activity[] = [], weeks: number = 52) {
  const today = new Date();
  const startDate = subDays(today, weeks * 7 - 1);
  
  // Create a map of date -> count
  const activityMap = new Map<string, number>();
  
  activities.forEach((activity) => {
    const activityDate = startOfDay(new Date(activity.time));
    const dateKey = format(activityDate, "yyyy-MM-dd");
    activityMap.set(dateKey, (activityMap.get(dateKey) || 0) + 1);
  });
  
  // Generate data for all days in the range
  const data: Array<{ date: Date; count: number }> = [];
  for (let i = 0; i < weeks * 7; i++) {
    const date = subDays(today, i);
    const dateKey = format(date, "yyyy-MM-dd");
    const count = activityMap.get(dateKey) || 0;
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

export function ContributionGrid({ weeks = 52, activities = [] }: ContributionGridProps) {
  const [hoveredDay, setHoveredDay] = useState<{
    date: Date;
    count: number;
    element: HTMLElement | null;
  } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const contributionData = useMemo(
    () => processActivities(activities, weeks),
    [activities, weeks]
  );
  
  const today = new Date();
  
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
          <div className="relative mb-2 pl-8" style={{ height: "16px" }}>
            {monthLabels.map(({ month, weekIndex }, idx) => {
              // Each week column is w-3 (12px) + gap-1 (4px) = 16px
              const weekWidth = 16;
              const position = weekIndex * weekWidth;
              // Calculate spacing to next month (or end of grid)
              const nextWeekIndex = idx < monthLabels.length - 1 
                ? monthLabels[idx + 1].weekIndex 
                : weeks;
              const spacing = (nextWeekIndex - weekIndex) * weekWidth;
              
              return (
                <div
                  key={idx}
                  className="text-xs text-gray-600 absolute"
                  style={{
                    left: `${position}px`,
                    minWidth: `${spacing}px`,
                  }}
                >
                  {month}
                </div>
              );
            })}
          </div>

          <div className="flex gap-1 relative">
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
                        onMouseEnter={(e) =>
                          setHoveredDay({ date: day.date, count: day.count, element: e.currentTarget })
                        }
                        onMouseLeave={() => setHoveredDay(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Hover tooltip - positioned absolutely */}
            {hoveredDay && hoveredDay.element && (
              <div
                className="absolute z-50 p-2 bg-gray-900 text-white text-xs rounded shadow-lg pointer-events-none whitespace-nowrap"
                style={{
                  left: `${hoveredDay.element.offsetLeft + hoveredDay.element.offsetWidth / 2 - 50}px`,
                  top: `${hoveredDay.element.offsetTop - 35}px`,
                }}
              >
                <div className="font-semibold mb-1">
                  {hoveredDay.count} {hoveredDay.count === 1 ? "activity" : "activities"} on{" "}
                  {format(hoveredDay.date, "MMM d, yyyy")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-gray-600">
        <span className="text-gray-500">Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
          <div className="w-3 h-3 rounded-sm bg-green-200"></div>
          <div className="w-3 h-3 rounded-sm bg-green-400"></div>
          <div className="w-3 h-3 rounded-sm bg-green-600"></div>
          <div className="w-3 h-3 rounded-sm bg-green-700"></div>
        </div>
        <span className="text-gray-500">More</span>
      </div>
    </div>
  );
}

