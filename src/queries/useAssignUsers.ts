import { MutationFunction, useMutation, UseMutationOptions } from "react-query";
import { storageKey } from "./constants";

type MutationBody = { userId: string; userGroupIds: string[] };

export const useAssignUserHook = () => {
  const assignUsers = (userId: string, userGroupIds: string[]) => {
    const storage = localStorage.getItem(storageKey);
    if (!storage) {
      throw new Error("Storage error!");
    }
    const usersToUserGroups = JSON.parse(storage);

    const value = {
      ...usersToUserGroups,
      [userId]: [
        ...new Set([
          ...(usersToUserGroups[userId] ? usersToUserGroups[userId] : []),
          ...userGroupIds,
        ]),
      ],
    };

    localStorage.setItem(storageKey, JSON.stringify(value));
  };

  const assignUser = async function (body: MutationBody) {
    assignUsers(body.userId, body.userGroupIds);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return new Promise((resolve) => resolve("success"));
  };

  return (body: MutationBody) => {
    return assignUser(body);
  };
};

export const useAssignUserMutationOptions = <
  TError = unknown,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<ReturnType<typeof useAssignUserHook>>>,
    TError,
    { data: MutationBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<ReturnType<typeof useAssignUserHook>>>,
  TError,
  { data: MutationBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const assignUser = useAssignUserHook();

  const mutationFn: MutationFunction<
    Awaited<ReturnType<ReturnType<typeof useAssignUserHook>>>,
    { data: MutationBody }
  > = (props) => {
    const { data } = props ?? {};

    return assignUser(data);
  };

  return { mutationFn, ...mutationOptions };
};

export const useAssignUser = <TError = unknown, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<ReturnType<typeof useAssignUserHook>>>,
    TError,
    { data: MutationBody },
    TContext
  >;
}) => {
  const mutationOptions = useAssignUserMutationOptions(options);

  return useMutation(mutationOptions);
};
