import { MutationFunction, useMutation, UseMutationOptions } from "react-query";
import { storageKey } from "./constants";

type MutationBody = { userId: string; userGroupIds: string[] };

export const useRemoveUserHook = () => {
  const removeUsers = (userId: string, userGroupIds: string[]) => {
    const storage = localStorage.getItem(storageKey);
    if (!storage) {
      throw new Error("Storage error!");
    }
    const usersToUserGroups = JSON.parse(storage);

    let value = null;

    const result = usersToUserGroups[userId]?.filter(
      (id: string) => !userGroupIds.includes(id)
    );
    if (!result?.length) {
      value = {
        ...usersToUserGroups,
        [userId]: [],
      };
    } else {
      value = {
        ...usersToUserGroups,
        [userId]: result,
      };
    }

    localStorage.setItem(storageKey, JSON.stringify(value));
  };

  const removeUser = async function (body: MutationBody) {
    removeUsers(body.userId, body.userGroupIds);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return new Promise((resolve) => resolve("success"));
  };

  return (body: MutationBody) => {
    return removeUser(body);
  };
};

export const useRemoveUserMutationOptions = <
  TError = unknown,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<ReturnType<typeof useRemoveUserHook>>>,
    TError,
    { data: MutationBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<ReturnType<typeof useRemoveUserHook>>>,
  TError,
  { data: MutationBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const removeUser = useRemoveUserHook();

  const mutationFn: MutationFunction<
    Awaited<ReturnType<ReturnType<typeof useRemoveUserHook>>>,
    { data: MutationBody }
  > = (props) => {
    const { data } = props ?? {};

    return removeUser(data);
  };

  return { mutationFn, ...mutationOptions };
};

export const useRemoveUser = <TError = unknown, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<ReturnType<typeof useRemoveUserHook>>>,
    TError,
    { data: MutationBody },
    TContext
  >;
}) => {
  const mutationOptions = useRemoveUserMutationOptions(options);

  return useMutation(mutationOptions);
};
