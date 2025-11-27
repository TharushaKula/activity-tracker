"use client";

import { useState, useEffect } from "react";
import { Activity } from "@/lib/firebase/activities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActivityForm } from "@/components/activities/activity-form";
import { ActivityItem } from "@/components/activities/activity-item";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { formatDate, getStartOfDay } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface DailyViewProps {
  activities: Activity[];
  selectedDate: Date;
}

export function DailyView({ activities: initialActivities, selectedDate: initialDate }: DailyViewProps) {
  const [activities, setActivities] = useState(initialActivities);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchActivities = async (date: Date) => {
    setIsLoading(true);
    try {
      const dateStr = date.toISOString().split("T")[0];
      const response = await fetch(`/api/activities?startDate=${dateStr}T00:00:00&endDate=${dateStr}T23:59:59`);
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
    fetchActivities(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleSubmit = async (data: Omit<Activity, "id" | "createdAt" | "updatedAt">) => {
    setIsLoading(true);
    try {
      if (editingActivity) {
        const response = await fetch(`/api/activities/${editingActivity.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          await fetchActivities(selectedDate);
          setIsFormOpen(false);
          setEditingActivity(null);
        }
      } else {
        const response = await fetch("/api/activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          await fetchActivities(selectedDate);
          setIsFormOpen(false);
        }
      }
    } catch (error) {
      console.error("Error saving activity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchActivities(selectedDate);
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            Daily View
          </h1>
          <p className="text-lg text-gray-600">
            Track your activities day by day
          </p>
        </div>
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="bg-[#0D7AB8] hover:bg-[#0a6a9f] shadow-sm hover:shadow-md"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Activity
        </Button>
      </div>

      {/* Date Navigation Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <div className="p-2 rounded-lg bg-[#0D7AB8]">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl">{formatDate(selectedDate)}</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDateChange(-1)}
                className="border-2 hover:border-[#0D7AB8] hover:text-[#0D7AB8]"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedDate(new Date())}
                className="border-2 hover:border-[#0D7AB8] hover:text-[#0D7AB8]"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDateChange(1)}
                className="border-2 hover:border-[#0D7AB8] hover:text-[#0D7AB8]"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading && activities.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D7AB8] mb-4"></div>
              <p>Loading activities...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium mb-2">No activities for this day</p>
              <p className="text-sm text-gray-500 mb-4">Start by adding your first activity!</p>
              <Button 
                onClick={() => setIsFormOpen(true)}
                className="bg-[#0D7AB8] hover:bg-[#0a6a9f]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Activity
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {activities.map((activity) => (
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingActivity ? "Edit Activity" : "Add New Activity"}
            </DialogTitle>
          </DialogHeader>
          <ActivityForm
            activity={editingActivity || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingActivity(null);
            }}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

