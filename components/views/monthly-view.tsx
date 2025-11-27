"use client";

import { Activity } from "@/lib/firebase/activities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MonthlyChart } from "@/components/charts/monthly-chart";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import {
  formatDate,
  getStartOfMonth,
  getEndOfMonth,
  getDaysInMonth,
} from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface MonthlyViewProps {
  activities: Activity[];
  month: Date;
}

export function MonthlyView({ activities: initialActivities, month: initialMonth }: MonthlyViewProps) {
  const [activities, setActivities] = useState(initialActivities);
  const [month, setMonth] = useState(initialMonth);
  const [isLoading, setIsLoading] = useState(false);

  const fetchActivities = async (monthDate: Date) => {
    setIsLoading(true);
    try {
      const start = getStartOfMonth(monthDate);
      const end = getEndOfMonth(monthDate);
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
    fetchActivities(month);
  }, [month]);

  const handleMonthChange = (months: number) => {
    const newMonth = new Date(month);
    newMonth.setMonth(newMonth.getMonth() + months);
    setMonth(newMonth);
  };

  const monthName = month.toLocaleString("default", { month: "long", year: "numeric" });
  const daysInMonth = getDaysInMonth(month);
  const startOfMonth = getStartOfMonth(month);
  const firstDayOfWeek = startOfMonth.getDay();

  // Group activities by day
  const activitiesByDay: { [key: number]: Activity[] } = {};
  activities.forEach((activity) => {
    // Convert time string to Date object if needed
    const timeDate = typeof activity.time === "string" 
      ? new Date(activity.time) 
      : activity.time;
    const day = timeDate.getDate();
    if (!activitiesByDay[day]) {
      activitiesByDay[day] = [];
    }
    activitiesByDay[day].push(activity);
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Monthly View
          </h1>
          <p className="text-lg text-gray-600">
            Your monthly activity calendar and trends
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleMonthChange(-1)}
            className="border-2 hover:border-[#0D7AB8] hover:text-[#0D7AB8]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setMonth(getStartOfMonth(new Date()))}
            className="border-2 hover:border-[#0D7AB8] hover:text-[#0D7AB8]"
          >
            This Month
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleMonthChange(1)}
            className="border-2 hover:border-[#0D7AB8] hover:text-[#0D7AB8]"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-900">
            <div className="p-2 rounded-lg bg-[#0D7AB8]">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span>{monthName}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyChart activitiesByDay={activitiesByDay} month={month} />
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Monthly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm font-medium text-gray-600 mb-2 uppercase tracking-wide">Total Activities</p>
              <p className="text-4xl font-bold text-[#0D7AB8]">{activities.length}</p>
            </div>
            <div className="p-6 bg-purple-50 rounded-xl border border-purple-100">
              <p className="text-sm font-medium text-gray-600 mb-2 uppercase tracking-wide">Average per Day</p>
              <p className="text-4xl font-bold text-purple-600">
                {daysInMonth > 0
                  ? Math.round((activities.length / daysInMonth) * 10) / 10
                  : 0}
              </p>
            </div>
            <div className="p-6 bg-green-50 rounded-xl border border-green-100">
              <p className="text-sm font-medium text-gray-600 mb-2 uppercase tracking-wide">Active Days</p>
              <p className="text-4xl font-bold text-green-600">
                {Object.keys(activitiesByDay).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

