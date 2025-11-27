"use client";

import { Activity } from "@/lib/firebase/activities";
import { getDaysInMonth, getStartOfMonth } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface MonthlyChartProps {
  activitiesByDay: { [key: number]: Activity[] };
  month: Date;
}

export function MonthlyChart({ activitiesByDay, month }: MonthlyChartProps) {
  const daysInMonth = getDaysInMonth(month);
  const startOfMonth = getStartOfMonth(month);
  const firstDayOfWeek = startOfMonth.getDay();

  const getIntensity = (count: number) => {
    if (count === 0) return "bg-gray-50 border-gray-200";
    if (count <= 2) return "bg-blue-100 border-blue-200";
    if (count <= 5) return "bg-blue-300 border-blue-400";
    return "bg-[#0D7AB8] border-[#0a6a9f] text-white";
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-7 gap-3">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-3">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const count = activitiesByDay[day]?.length || 0;
          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.01 }}
              className={`aspect-square rounded-xl border-2 ${getIntensity(count)} flex flex-col items-center justify-center p-2 hover:scale-105 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md`}
              title={`${day}: ${count} activities`}
            >
              <span className={`text-sm font-semibold ${count > 5 ? 'text-white' : 'text-gray-900'}`}>{day}</span>
              {count > 0 && (
                <Badge 
                  variant="secondary" 
                  className={`mt-1 text-xs ${count > 5 ? 'bg-white/20 text-white border-white/30' : 'bg-white/80 text-gray-700 border-gray-200'}`}
                >
                  {count}
                </Badge>
              )}
            </motion.div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-6 text-xs text-gray-600 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-gray-200 bg-gray-50" />
          <span>Less</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-blue-200 bg-blue-100" />
          <span>More</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-[#0a6a9f] bg-[#0D7AB8]" />
          <span>Most</span>
        </div>
      </div>
    </div>
  );
}

