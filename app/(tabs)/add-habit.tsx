import { useAuth } from "@/context/auth-context";
import { useCreateHabit } from "@/lib/hook";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Button,
  SegmentedButtons,
  TextInput,
  useTheme,
  Text,
} from "react-native-paper";
const FREQUECIES = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];
type Frequency = "daily" | "weekly" | "monthly";
const AddHabitScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const createHabitMutation = useCreateHabit();
  const handleSubmit = async () => {
    if (!user) return;
    createHabitMutation.mutate({
      userId: user.$id,
      title: title.trim(),
      description: description.trim(),
      frequency,
    });
    setTitle("");
    setDescription("");
    setFrequency("daily");
    router.back();
  };
  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        mode="outlined"
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        label="Description"
        mode="outlined"
        style={styles.input}
        onChangeText={setDescription}
      />
      <View style={styles.frequencyContainer}>
        <SegmentedButtons
          buttons={FREQUECIES.map((frequency) => ({
            ...frequency,
          }))}
          onValueChange={(value) => setFrequency(value as Frequency)}
          value={frequency}
          style={styles.segmentedButtons}
        />
      </View>
      <Button
        mode="contained"
        style={styles.button}
        disabled={!title.trim() || !description.trim()}
        onPress={handleSubmit}
      >
        {createHabitMutation.isPending ? "Adding..." : "Add Habit"}
      </Button>

      {createHabitMutation.error && (
        <Text style={{ color: theme.colors.error }}>
          {createHabitMutation.error.message}
        </Text>
      )}
    </View>
  );
};
export default AddHabitScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  input: {
    marginBottom: 16,
  },
  frequencyContainer: {
    marginBottom: 24,
  },
  segmentedButtons: {
    marginTop: 8,
  },
  button: {
    marginTop: 8,
  },
});
