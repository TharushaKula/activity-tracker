import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  createActivity,
  getActivities,
  Activity,
} from "@/lib/firebase/activities";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const mood = searchParams.get("mood") as Activity["mood"] | null;
    const tagsParam = searchParams.get("tags");

    const filters: any = {};
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    if (mood) filters.mood = mood;
    if (tagsParam) filters.tags = tagsParam.split(",");

    const activities = await getActivities(userId, filters);

    // Serialize dates to ISO strings for JSON response
    const serializedActivities = activities.map((activity) => ({
      ...activity,
      time: activity.time.toISOString(),
      createdAt: activity.createdAt?.toISOString(),
      updatedAt: activity.updatedAt?.toISOString(),
    }));

    return NextResponse.json(serializedActivities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, time, mood, tags } = body;

    if (!title || !time || !mood) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const activityId = await createActivity(userId, {
      title,
      description: description || "",
      time: new Date(time),
      mood,
      tags: tags || [],
    });

    return NextResponse.json({ id: activityId, success: true });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 }
    );
  }
}

