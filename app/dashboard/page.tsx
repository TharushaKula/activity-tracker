import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getActivities } from "@/lib/firebase/activities";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { StreakCard } from "@/components/dashboard/streak-card";
import { ReminderBanner } from "@/components/dashboard/reminder-banner";
import { ContributionGrid } from "@/components/dashboard/contribution-grid";
import { Card, CardContent } from "@/components/ui/card";
import { calculateStreak } from "@/lib/utils";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const activities = await getActivities(userId);
  const streak = calculateStreak(activities);

  return (
    <div className="space-y-8">
      <ReminderBanner />
      
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
          Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Welcome back! Here's your activity overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStats activities={activities} />
      </div>

      {/* Secondary Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <StreakCard streak={streak} />
        <QuickActions />
      </div>

      {/* Contribution Grid - GitHub Style */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <ContributionGrid weeks={52} activities={activities} />
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <RecentActivities activities={activities.slice(0, 10)} />
    </div>
  );
}

