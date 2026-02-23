import { useQuery, useQueryClient } from "@tanstack/react-query";
import { gameService } from "../services";
import { useAuth } from "../contexts/AuthContext";

export const useGameProgress = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["gameProgress", user?.id],
    queryFn: () => gameService.getProgress(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const invalidateProgressBar = () => {
    queryClient.invalidateQueries({ queryKey: ["gameProgress", user?.id] });
  };

  return {
    progress: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    invalidateProgressBar,
    coins: query.data?.totalCoins || 0,
    level: query.data?.currentLevel || 1,
  };
};
