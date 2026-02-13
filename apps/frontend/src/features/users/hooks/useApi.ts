import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers, postUsers, deleteUsers, postHobbies } from "../api";

const USERS_QUERY_KEY = ["users"] as const;

export const useUsersQuery = () => {
  const query = useQuery({ queryKey: USERS_QUERY_KEY, queryFn: getUsers });

  return {
    ...query,
    users: query.data ?? [],
  };
};

export const useAddUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};

export const useAddHobbiesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postHobbies,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
};
