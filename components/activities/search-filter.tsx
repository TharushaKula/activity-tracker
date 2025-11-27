"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, Filter } from "lucide-react";
import { Activity } from "@/lib/firebase/activities";
import { Badge } from "@/components/ui/badge";

interface SearchFilterProps {
  activities: Activity[];
  onFiltered: (filtered: Activity[]) => void;
}

const moods: Activity["mood"][] = [
  "happy",
  "neutral",
  "sad",
  "excited",
  "tired",
  "anxious",
];

export function SearchFilter({ activities, onFiltered }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Extract unique tags from activities
  useEffect(() => {
    const tags = new Set<string>();
    activities.forEach((activity) => {
      activity.tags.forEach((tag) => tags.add(tag));
    });
    setAvailableTags(Array.from(tags));
  }, [activities]);

  const handleFilter = () => {
    let filtered = [...activities];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(query) ||
          activity.description.toLowerCase().includes(query) ||
          activity.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Mood filter
    if (selectedMood !== "all") {
      filtered = filtered.filter((activity) => activity.mood === selectedMood);
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((activity) =>
        selectedTags.some((tag) => activity.tags.includes(tag))
      );
    }

    onFiltered(filtered);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSelectedMood("all");
    setSelectedTags([]);
    onFiltered(activities);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-gray-900">
          <div className="p-2 rounded-lg bg-gray-100">
            <Filter className="h-5 w-5 text-gray-700" />
          </div>
          <span>Search & Filter</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 text-base"
            />
          </div>
          <Select value={selectedMood} onValueChange={setSelectedMood}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Moods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Moods</SelectItem>
              {moods.map((mood) => (
                <SelectItem key={mood} value={mood}>
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {availableTags.length > 0 && (
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">Filter by Tags:</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    selectedTags.includes(tag)
                      ? "bg-[#0D7AB8] text-white border-[#0D7AB8] hover:bg-[#0a6a9f]"
                      : "bg-white border-2 border-gray-300 text-gray-700 hover:border-[#0D7AB8] hover:text-[#0D7AB8]"
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button 
            onClick={handleFilter} 
            className="flex-1 bg-[#0D7AB8] hover:bg-[#0a6a9f]"
          >
            <Search className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
          <Button 
            variant="outline" 
            onClick={handleClear}
            className="border-2"
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

