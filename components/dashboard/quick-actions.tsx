"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-gray-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button asChild className="w-full justify-start bg-[#0D7AB8] hover:bg-[#0a6a9f]" size="lg">
          <Link href="/dashboard/daily?action=add">
            <Plus className="mr-2 h-5 w-5" />
            Add New Activity
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full justify-start border-2 hover:border-[#0D7AB8] hover:text-[#0D7AB8]"
          size="lg"
        >
          <Link href="/dashboard/daily?action=search">
            <Search className="mr-2 h-5 w-5" />
            Search Activities
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full justify-start border-2 hover:border-[#0D7AB8] hover:text-[#0D7AB8]"
          size="lg"
        >
          <Link href="/dashboard/daily?action=filter">
            <Filter className="mr-2 h-5 w-5" />
            Filter by Tags
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

