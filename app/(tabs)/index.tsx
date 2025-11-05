import { useAuth } from "@/context/auth-context";
import { useHabits } from "@/lib/hook";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Surface } from "react-native-paper";
export default function Index() {
  const { signOut, user } = useAuth();
  const {
    data: habits,
    isLoading,
    isError,
    error,
  } = useHabits(user?.$id || "");

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
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
      <ScrollView>
        {habits?.length === 0 ? (
          <View style={styles.emptyState}>
            <Text variant="bodyMedium" style={styles.emptyStateText}>
              You have no habits yet. Start by adding a new habit!
            </Text>
          </View>
        ) : (
          habits?.map((habit) => (
            <Surface key={habit.$id} style={styles.habitCard}>
              <View key={habit.$id} style={styles.habitCardContent}>
                <Text variant="titleMedium" style={styles.habitCardTitle}>
                  {habit.title}
                </Text>
                <Text variant="bodyMedium" style={styles.habitCardDescription}>
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
});
