"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity } from "@/lib/firebase/activities";
import { motion } from "framer-motion";

interface ActivityFormProps {
  activity?: Activity;
  onSubmit: (data: Omit<Activity, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const moods: Activity["mood"][] = [
  "happy",
  "neutral",
  "sad",
  "excited",
  "tired",
  "anxious",
];

export function ActivityForm({
  activity,
  onSubmit,
  onCancel,
  isLoading,
}: ActivityFormProps) {
  const [title, setTitle] = useState(activity?.title || "");
  const [description, setDescription] = useState(activity?.description || "");
  const [time, setTime] = useState(
    activity?.time
      ? new Date(activity.time).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );
  const [mood, setMood] = useState<Activity["mood"]>(
    activity?.mood || "neutral"
  );
  const [tags, setTags] = useState(activity?.tags.join(", ") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      time: new Date(time),
      mood,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
          Title *
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What did you do?"
          required
          className="text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details about this activity..."
          rows={4}
          className="text-base"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="time" className="text-sm font-semibold text-gray-700">
            Date & Time *
          </Label>
          <Input
            id="time"
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mood" className="text-sm font-semibold text-gray-700">
            Mood *
          </Label>
          <Select value={mood} onValueChange={(value) => setMood(value as Activity["mood"])}>
            <SelectTrigger id="mood" className="text-base h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {moods.map((m) => (
                <SelectItem key={m} value={m} className="text-base">
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags" className="text-sm font-semibold text-gray-700">
          Tags
        </Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="work, exercise, reading (comma separated)"
          className="text-base"
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate tags with commas
        </p>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-2"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || !title.trim()}
          className="bg-[#0D7AB8] hover:bg-[#0a6a9f] min-w-[140px]"
        >
          {isLoading ? "Saving..." : activity ? "Update Activity" : "Create Activity"}
        </Button>
      </div>
    </motion.form>
  );
}

