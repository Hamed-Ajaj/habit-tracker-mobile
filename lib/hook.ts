import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createHabite, fetchHabits } from "./api";
export const useHabits = (userId: string) => {
  return useQuery({
    queryKey: ["habits"],
    queryFn: () => fetchHabits(userId),
    enabled: !!userId,
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    staleTime: 1000 * 60 * 1, // Data is considered fresh for 1 minute
  });
};

export const useCreateHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      title,
      description,
      frequency,
    }: {
      userId: string;
      title: string;
      description: string;
      frequency: string;
    }) => createHabite(userId, title, description, frequency),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] }); // Refetch habits after creation
    },
  });
};
