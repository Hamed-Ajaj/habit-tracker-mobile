import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "./appwrite";
import { ID, Query } from "react-native-appwrite";
import { Habit } from "@/types/habits";

export const fetchHabits = async (userId: string) => {
  const res = await databases.listDocuments(DATABASE_ID, HABITS_COLLECTION_ID, [
    Query.equal("user_id", userId || ""),
  ]);
  return res.documents as Habit[];
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

export const deleteHabit = async (habitId: string) => {
  try {
    await databases.deleteDocument(DATABASE_ID, HABITS_COLLECTION_ID, habitId);
  } catch (error) {
    throw error;
  }
};
