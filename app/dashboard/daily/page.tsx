import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getActivitiesByDay } from "@/lib/firebase/activities";
import { DailyView } from "@/components/views/daily-view";
import { getStartOfDay } from "@/lib/utils";

export default async function DailyPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; action?: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const date = params.date ? new Date(params.date) : new Date();
  const activities = await getActivitiesByDay(userId, date);

  return <DailyView activities={activities} selectedDate={date} />;
}

