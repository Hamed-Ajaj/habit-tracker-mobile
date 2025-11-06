import {
  COMPLETIONS_COLLECTION_ID,
  DATABASE_ID,
  databases,
  HABITS_COLLECTION_ID,
} from "./appwrite";
import { ID, Query } from "react-native-appwrite";
import { Habit, HabitCompletion } from "@/types/habits";

export const fetchHabits = async (userId: string) => {
  const res = await databases.listDocuments(DATABASE_ID, HABITS_COLLECTION_ID, [
    Query.equal("user_id", userId || ""),
  ]);
  return res.documents as Habit[];
};

export const fetchCompletedHabits = async (userId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  try {
    const res = await databases.listDocuments(
      DATABASE_ID,
      COMPLETIONS_COLLECTION_ID!,
      [
        Query.equal("user_id", userId || ""),
        Query.greaterThanEqual("completed_at", today.toISOString()),
      ],
    );
    return res.documents as HabitCompletion[];
  } catch (error) {
    throw error;
  }
};

export const createHabite = async (
  userId: string,
  title: string,
  description: string,
  frequency: string,
) => {
  try {
    await databases.createDocument(
      DATABASE_ID,
      HABITS_COLLECTION_ID,
      ID.unique(),
      {
        user_id: userId,
        title,
        description,
        frequency,
        streak_count: 0,
        last_completed: new Date().toISOString(),
      },
    );
  } catch (error) {
    throw error;
  }
};

export const completeHabit = async (habit: Habit) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // 1️⃣ Check if already completed today
  const existingCompletion = await databases.listDocuments(
    DATABASE_ID,
    COMPLETIONS_COLLECTION_ID!,
    [
      Query.equal("habit_id", habit.$id),
      Query.equal("user_id", habit.user_id),
      Query.between(
        "completed_at",
        startOfDay.toISOString(),
        endOfDay.toISOString(),
      ),
    ],
  );

  if (existingCompletion.documents.length > 0) {
    // Already completed → prevent streak update
    return { message: "Already completed today" };
  }

  // Create new completion
  const currentDate = new Date().toISOString();
  await databases.createDocument(
    DATABASE_ID,
    COMPLETIONS_COLLECTION_ID!,
    ID.unique(),
    {
      habit_id: habit.$id,
      completed_at: currentDate,
      user_id: habit.user_id,
    },
  );

  await databases.updateDocument(DATABASE_ID, HABITS_COLLECTION_ID, habit.$id, {
    streak_count: habit.streak_count + 1,
    last_completed: currentDate,
  });
};
export const deleteHabit = async (habitId: string) => {
  try {
    await databases.deleteDocument(DATABASE_ID, HABITS_COLLECTION_ID, habitId);
  } catch (error) {
    throw error;
  }
};
