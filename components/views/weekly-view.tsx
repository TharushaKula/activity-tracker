"use client";

import { Activity } from "@/lib/firebase/activities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WeeklyChart } from "@/components/charts/weekly-chart";
import { ActivityItem } from "@/components/activities/activity-item";
import { ChevronLeft, ChevronRight, BarChart3 } from "lucide-react";
import { formatDate, getStartOfWeek, getEndOfWeek, getWeekDates } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface WeeklyViewProps {
  activities: Activity[];
  weekStart: Date;
}

export function WeeklyView({ activities: initialActivities, weekStart: initialWeekStart }: WeeklyViewProps) {
  const [activities, setActivities] = useState(initialActivities);
  const [weekStart, setWeekStart] = useState(initialWeekStart);
  const [isLoading, setIsLoading] = useState(false);

  const fetchActivities = async (start: Date) => {
    setIsLoading(true);
    try {
      const end = getEndOfWeek(start);
      const response = await fetch(
        `/api/activities?startDate=${start.toISOString()}&endDate=${end.toISOString()}`
      );
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(weekStart);
  }, [weekStart]);

  const handleWeekChange = (weeks: number) => {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(newWeekStart.getDate() + weeks * 7);
    setWeekStart(newWeekStart);
  };

  const weekDates = getWeekDates(weekStart);
  const activitiesByDay = weekDates.map((date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return activities.filter((activity) => {
      const activityDate = new Date(activity.time);
      return activityDate >= dayStart && activityDate <= dayEnd;
    });
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Weekly View
          </h1>
          <p className="text-lg text-gray-600">
            Your weekly activity overview and productivity insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleWeekChange(-1)}
            className="border-2 hover:border-[#0D7AB8] hover:text-[#0D7AB8]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setWeekStart(getStartOfWeek(new Date()))}
            className="border-2 hover:border-[#0D7AB8] hover:text-[#0D7AB8]"
          >
            This Week
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleWeekChange(1)}
            className="border-2 hover:border-[#0D7AB8] hover:text-[#0D7AB8]"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chart Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-900">
            <div className="p-2 rounded-lg bg-[#0D7AB8]">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span>Week of {formatDate(weekStart)} - {formatDate(getEndOfWeek(weekStart))}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyChart activitiesByDay={activitiesByDay} weekDates={weekDates} />
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {weekDates.map((date, index) => (
          <motion.div
            key={date.toISOString()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-gray-900">{formatDate(date)}</CardTitle>
              </CardHeader>
              <CardContent>
                {activitiesByDay[index].length === 0 ? (
                  <p className="text-center text-gray-500 py-6 text-sm">
                    No activities for this day
                  </p>
                ) : (
                  <div className="space-y-3">
                    {activitiesByDay[index].map((activity) => (
                      <ActivityItem
                        key={activity.id}
                        activity={activity}
                        onEdit={() => {}}
                        onDelete={async () => {
                          await fetch(`/api/activities/${activity.id}`, {
                            method: "DELETE",
                          });
                          fetchActivities(weekStart);
                        }}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

