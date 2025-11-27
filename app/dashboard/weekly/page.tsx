import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getActivitiesByWeek } from "@/lib/firebase/activities";
import { WeeklyView } from "@/components/views/weekly-view";
import { getStartOfWeek } from "@/lib/utils";

export default async function WeeklyPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const weekStart = params.week
    ? getStartOfWeek(new Date(params.week))
    : getStartOfWeek(new Date());
  const activities = await getActivitiesByWeek(userId, weekStart);

  return <WeeklyView activities={activities} weekStart={weekStart} />;
}

