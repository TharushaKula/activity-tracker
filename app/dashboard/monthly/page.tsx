import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getActivitiesByMonth } from "@/lib/firebase/activities";
import { MonthlyView } from "@/components/views/monthly-view";
import { getStartOfMonth } from "@/lib/utils";

export default async function MonthlyPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const month = params.month
    ? getStartOfMonth(new Date(params.month))
    : getStartOfMonth(new Date());
  const activities = await getActivitiesByMonth(userId, month);

  return <MonthlyView activities={activities} month={month} />;
}

