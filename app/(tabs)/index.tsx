import { ProgressBarLoader } from "@/components/loader";
import { useAuth } from "@/context/auth-context";
import {
  useDeleteHabit,
  useHabits,
  useTodayCompletedHabits,
  useUpdateHabit,
} from "@/lib/hook";
import { Habit } from "@/types/habits";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRef } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Text, Button, Surface } from "react-native-paper";
export default function Index() {
  const { signOut, user } = useAuth();
  const {
    data: habits,
    isLoading,
    isError,
    error,
  } = useHabits(user?.$id || "");

  const { data: completedHabits, error: completionsError } =
    useTodayCompletedHabits(user?.$id || "");
  const deleteHabitMutation = useDeleteHabit();
  const updateHabitMutation = useUpdateHabit();

  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});
  const isHabitCompleted = (habitId: string) => {
    return completedHabits?.some(
      (completion) => completion.habit_id === habitId,
    );
  };
  const handleCompleteHabit = (habit: Habit) => {
    if (!user || isHabitCompleted(habit.$id)) {
      return;
    } else {
      try {
        updateHabitMutation.mutate(habit);
      } catch (error) {
        if (error instanceof Error) {
          console.log("Error completing habit:", error.message);
        } else {
          console.log("Unknown error completing habit");
        }
      }
    }
  };
  const renderRightActions = (habitId: string) => (
    <View style={styles.swipeActionRight}>
      {isHabitCompleted(habitId) ? (
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          Completed
        </Text>
      ) : (
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={32}
          color={"#fff"}
        />
      )}
    </View>
  );

  const renderLeftActions = () => (
    <View style={styles.swipeActionLeft}>
      <MaterialCommunityIcons
        name="trash-can-outline"
        size={32}
        color={"#fff"}
      />
    </View>
  );
  if (isLoading) {
    return <ProgressBarLoader />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Today's Habits
        </Text>
        <Button mode="text" onPress={signOut} icon={"logout"}>
          Sign Out
        </Button>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {habits?.length === 0 && !isLoading ? (
          <View style={styles.emptyState}>
            <Text variant="bodyMedium" style={styles.emptyStateText}>
              You have no habits yet. Start by adding a new habit!
            </Text>
          </View>
        ) : (
          habits?.map((habit) => (
            <Swipeable
              ref={(ref) => {
                swipeableRefs.current[habit.$id] = ref;
              }}
              key={habit.$id}
              overshootLeft={false}
              overshootRight={false}
              renderLeftActions={renderLeftActions}
              renderRightActions={() => renderRightActions(habit.$id)}
              onSwipeableOpen={(diretion) => {
                if (diretion === "left") {
                  deleteHabitMutation.mutate(habit.$id);
                } else if (diretion === "right") {
                  handleCompleteHabit(habit);
                }
                swipeableRefs.current[habit.$id]?.close();
              }}
            >
              <Surface
                style={[
                  styles.habitCard,
                  isHabitCompleted(habit.$id) && styles.habitCardCompleted,
                ]}
              >
                <View style={styles.habitCardContent}>
                  <Text variant="titleMedium" style={styles.habitCardTitle}>
                    {habit.title}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={styles.habitCardDescription}
                  >
                    {habit.description}
                  </Text>
                  <View style={styles.habitCardFooter}>
                    <View style={styles.habitStreakBadge}>
                      <MaterialCommunityIcons
                        name="fire"
                        color={"#ff9800"}
                        size={18}
                      />
                      <Text style={styles.habitStreakText}>
                        {habit.streak_count} day streak
                      </Text>
                    </View>
                    <View style={styles.habitFrequencyBadge}>
                      <Text style={styles.habitFrequencyText}>
                        {habit.frequency.charAt(0).toLocaleUpperCase() +
                          habit.frequency.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              </Surface>
            </Swipeable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
    overflow: "visible",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontWeight: "bold",
  },
  habitCard: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "#f7f2fa",
    elevation: 1,
  },
  habitCardCompleted: {
    opacity: 0.6,
  },
  habitCardContent: {
    padding: 20,
  },
  habitCardTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 4,
    color: "#22223b",
  },
  habitCardDescription: {
    fontSize: 15,
    marginBottom: 16,
    color: "6c6c80",
  },
  habitCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  habitStreakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff4e5",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  habitStreakText: {
    marginLeft: 6,
    color: "#ff9800",
    fontWeight: "bold",
    fontSize: 14,
  },

  habitFrequencyBadge: {
    backgroundColor: "#ede7f6",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  habitFrequencyText: {
    color: "#7c4dff",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
  },
  swipeActionLeft: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: "#e53935",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingLeft: 16,
  },
  swipeActionRight: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    backgroundColor: "#4caf50",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingRight: 16,
  },
});
