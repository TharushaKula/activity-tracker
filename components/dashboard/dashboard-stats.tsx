"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, Calendar, Smile } from "lucide-react";
import { Activity as ActivityType } from "@/lib/firebase/activities";
import { formatDate } from "@/lib/utils";

interface DashboardStatsProps {
  activities: ActivityType[];
}

export function DashboardStats({ activities }: DashboardStatsProps) {
  const today = new Date();
  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);
  
  const todayActivities = activities.filter(
    (a) => {
      const activityDate = new Date(a.time);
      return activityDate >= todayStart && activityDate <= todayEnd;
    }
  );

  const thisWeekActivities = activities.filter((a) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const activityDate = typeof a.time === "string" ? new Date(a.time) : a.time;
    return activityDate >= weekAgo;
  });

  const happyMoods = activities.filter((a) => a.mood === "happy").length;
  const moodPercentage =
    activities.length > 0
      ? Math.round((happyMoods / activities.length) * 100)
      : 0;

  const stats = [
    {
      title: "Today's Activities",
      value: todayActivities.length.toString(),
      icon: Activity,
      description: `${todayActivities.length} logged today`,
      color: "text-blue-600",
    },
    {
      title: "This Week",
      value: thisWeekActivities.length.toString(),
      icon: Calendar,
      description: "Activities this week",
      color: "text-purple-600",
    },
    {
      title: "Total Activities",
      value: activities.length.toString(),
      icon: TrendingUp,
      description: "All time activities",
      color: "text-green-600",
    },
    {
      title: "Happy Mood",
      value: `${moodPercentage}%`,
      icon: Smile,
      description: "Positive mood ratio",
      color: "text-yellow-600",
    },
  ];

  return (
    <>
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color.replace('text-', 'bg-').replace('-600', '-100')} ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <p className="text-sm text-gray-500">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}

