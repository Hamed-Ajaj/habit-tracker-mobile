import { useAuth } from "@/context/auth-context";
import { useCreateHabit } from "@/lib/hook";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  View,
  StyleSheet,
} from "react-native";
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          label="Title"
          mode="outlined"
          onChangeText={setTitle}
          value={title}
          style={styles.input}
        />
        <TextInput
          label="Description"
          mode="outlined"
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.frequencyContainer}>
          <SegmentedButtons
            buttons={FREQUECIES}
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
          <Text style={{ color: theme.colors.error, marginTop: 10 }}>
            {createHabitMutation.error.message}
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddHabitScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
    marginTop: 30,
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
