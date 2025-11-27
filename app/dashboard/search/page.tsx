import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getActivities } from "@/lib/firebase/activities";
import { SearchView } from "@/components/views/search-view";

export default async function SearchPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const activities = await getActivities(userId);

  return <SearchView activities={activities} />;
}

