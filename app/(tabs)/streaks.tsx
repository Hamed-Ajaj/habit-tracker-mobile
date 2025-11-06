import { useAuth } from "@/context/auth-context";
import { useAllCompletedHabits, useHabits } from "@/lib/hook";

const StreaksScreen = () => {
  const { user } = useAuth();
  const {
    data: habits,
    isLoading,
    isError,
    error,
  } = useHabits(user?.$id || "");

  const { data: completedHabits, error: completionsError } =
    useAllCompletedHabits(user?.$id || "");
  console.log("All complete habits:", completedHabits);

  return null;
};

export default StreaksScreen;
