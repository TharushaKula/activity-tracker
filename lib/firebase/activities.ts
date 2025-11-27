import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./config";

export interface Activity {
  id?: string;
  title: string;
  description: string;
  time: Date;
  mood: "happy" | "neutral" | "sad" | "excited" | "tired" | "anxious";
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const activitiesCollection = (userId: string) =>
  collection(db, `users/${userId}/activities`);

// Create activity
export async function createActivity(
  userId: string,
  activity: Omit<Activity, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const activitiesRef = activitiesCollection(userId);
  const docRef = await addDoc(activitiesRef, {
    ...activity,
    time: Timestamp.fromDate(activity.time),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

// Get activity by ID
export async function getActivity(
  userId: string,
  activityId: string
): Promise<Activity | null> {
  const activityRef = doc(db, `users/${userId}/activities/${activityId}`);
  const activitySnap = await getDoc(activityRef);

  if (!activitySnap.exists()) {
    return null;
  }

  const data = activitySnap.data();
  return {
    id: activitySnap.id,
    ...data,
    time: data.time.toDate(),
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as Activity;
}

// Get all activities with optional filters
export async function getActivities(
  userId: string,
  filters?: {
    startDate?: Date;
    endDate?: Date;
    mood?: Activity["mood"];
    tags?: string[];
  }
): Promise<Activity[]> {
  const activitiesRef = activitiesCollection(userId);
  const constraints: QueryConstraint[] = [orderBy("time", "desc")];

  if (filters?.startDate) {
    constraints.push(where("time", ">=", Timestamp.fromDate(filters.startDate)));
  }

  if (filters?.endDate) {
    constraints.push(where("time", "<=", Timestamp.fromDate(filters.endDate)));
  }

  if (filters?.mood) {
    constraints.push(where("mood", "==", filters.mood));
  }

  const q = query(activitiesRef, ...constraints);
  const querySnapshot = await getDocs(q);

  let activities = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      time: data.time.toDate(),
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Activity;
  });

  // Filter by tags if provided (client-side since Firestore doesn't support array-contains-any easily)
  if (filters?.tags && filters.tags.length > 0) {
    activities = activities.filter((activity) =>
      filters.tags!.some((tag) => activity.tags.includes(tag))
    );
  }

  return activities;
}

// Update activity
export async function updateActivity(
  userId: string,
  activityId: string,
  updates: Partial<Omit<Activity, "id" | "createdAt">>
): Promise<void> {
  const activityRef = doc(db, `users/${userId}/activities/${activityId}`);
  const updateData: any = {
    ...updates,
    updatedAt: Timestamp.now(),
  };

  if (updates.time) {
    updateData.time = Timestamp.fromDate(updates.time);
  }

  await updateDoc(activityRef, updateData);
}

// Delete activity
export async function deleteActivity(
  userId: string,
  activityId: string
): Promise<void> {
  const activityRef = doc(db, `users/${userId}/activities/${activityId}`);
  await deleteDoc(activityRef);
}

// Get activities by date range
export async function getActivitiesByDateRange(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<Activity[]> {
  return getActivities(userId, { startDate, endDate });
}

// Get activities for a specific day
export async function getActivitiesByDay(
  userId: string,
  date: Date
): Promise<Activity[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return getActivitiesByDateRange(userId, startOfDay, endOfDay);
}

// Get activities for a week
export async function getActivitiesByWeek(
  userId: string,
  weekStart: Date
): Promise<Activity[]> {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return getActivitiesByDateRange(userId, weekStart, weekEnd);
}

// Get activities for a month
export async function getActivitiesByMonth(
  userId: string,
  month: Date
): Promise<Activity[]> {
  const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  return getActivitiesByDateRange(userId, startOfMonth, endOfMonth);
}

