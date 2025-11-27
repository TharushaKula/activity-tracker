"use client";

import { Activity } from "@/lib/firebase/activities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import { Edit, Trash2, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface ActivityItemProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
}

const moodColors = {
  happy: "bg-green-100 text-green-700 border-green-200",
  neutral: "bg-gray-100 text-gray-700 border-gray-200",
  sad: "bg-blue-100 text-blue-700 border-blue-200",
  excited: "bg-yellow-100 text-yellow-700 border-yellow-200",
  tired: "bg-purple-100 text-purple-700 border-purple-200",
  anxious: "bg-red-100 text-red-700 border-red-200",
};

export function ActivityItem({ activity, onEdit, onDelete }: ActivityItemProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-5 border border-gray-200 hover:border-[#0D7AB8] hover:shadow-md transition-all duration-200 group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-[#0D7AB8] transition-colors">
                {activity.title}
              </h3>
              <Badge 
                className={`${moodColors[activity.mood]} border font-medium text-xs px-2.5 py-0.5`}
                variant="outline"
              >
                {activity.mood}
              </Badge>
            </div>
            {activity.description && (
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
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
                      className="text-xs bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 font-normal"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(activity)}
              className="hover:bg-gray-100 hover:text-[#0D7AB8]"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(activity.id!)}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

