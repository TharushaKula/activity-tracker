"use client";

import { useState } from "react";
import { Activity } from "@/lib/firebase/activities";
import { SearchFilter } from "@/components/activities/search-filter";
import { ActivityItem } from "@/components/activities/activity-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchViewProps {
  activities: Activity[];
}

export function SearchView({ activities: initialActivities }: SearchViewProps) {
  const [filteredActivities, setFilteredActivities] = useState(initialActivities);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;

    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setFilteredActivities((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  const handleEdit = (activity: Activity) => {
    // This would open an edit dialog in a real implementation
    console.log("Edit activity:", activity);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
          Search & Filter
        </h1>
        <p className="text-lg text-gray-600">
          Find and filter your activities by keywords, mood, or tags
        </p>
      </div>

      {/* Search Filter Card */}
      <SearchFilter
        activities={initialActivities}
        onFiltered={setFilteredActivities}
      />

      {/* Results Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-gray-900">
            <div className="p-2 rounded-lg bg-[#0D7AB8]">
              <Search className="h-5 w-5 text-white" />
            </div>
            <span>Results ({filteredActivities.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium mb-2">No activities found</p>
              <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredActivities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ActivityItem
                      activity={activity}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

