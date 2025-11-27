"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "@/lib/firebase/activities";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface RecentActivitiesProps {
  activities: Activity[];
}

const moodColors = {
  happy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  neutral: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  sad: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  excited: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  tired: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  anxious: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function RecentActivities({ activities }: RecentActivitiesProps) {
  if (activities.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            No activities yet. Start logging your activities!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start justify-between p-5 rounded-xl border border-gray-200 bg-white hover:border-[#0D7AB8] hover:shadow-sm transition-all duration-200 group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-semibold text-gray-900 text-base">{activity.title}</h3>
                  <Badge
                    className={`${moodColors[activity.mood]} border font-medium`}
                    variant="outline"
                  >
                    {activity.mood}
                  </Badge>
                </div>
                {activity.description && (
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                    {activity.description}
                  </p>
                )}
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {formatDateTime(activity.time)}
                  </div>
                  {activity.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {activity.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

