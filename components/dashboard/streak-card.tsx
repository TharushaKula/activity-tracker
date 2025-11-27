"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Trophy, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StreakCardProps {
  streak: number;
}

export function StreakCard({ streak }: StreakCardProps) {
  const getStreakBadge = () => {
    if (streak >= 100) {
      return { icon: Trophy, label: "Centurion", color: "text-yellow-600" };
    } else if (streak >= 30) {
      return { icon: Award, label: "Monthly", color: "text-purple-600" };
    } else if (streak >= 7) {
      return { icon: Flame, label: "Weekly", color: "text-orange-600" };
    }
    return { icon: Flame, label: "Getting Started", color: "text-blue-600" };
  };

  const badge = getStreakBadge();
  const Icon = badge.icon;

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-100">
            <Icon className={`h-5 w-5 ${badge.color}`} />
          </div>
          <span className="text-gray-900">Current Streak</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-6xl font-bold text-[#0D7AB8]">
            {streak}
          </span>
          <span className="text-xl text-gray-600 font-medium">days</span>
        </div>
        <Badge className="mb-3 bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200" variant="outline">
          {badge.label}
        </Badge>
        <p className="text-sm text-gray-600 leading-relaxed">
          Keep logging activities daily to maintain your streak!
        </p>
      </CardContent>
    </Card>
  );
}

