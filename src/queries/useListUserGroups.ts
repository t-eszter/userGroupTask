import {
  QueryFunction,
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "react-query";
import { MOCK_USERS_GROUPS, storageKey } from "./constants";
import { Entity, ListUserGroupsParams } from "./types";
import { produce } from "immer";

type CustomUserGroupsInstanceInputs = { params?: ListUserGroupsParams };

const useCustomUserGroupsInstance = (): (({
  params,
}: CustomUserGroupsInstanceInputs) => Promise<Entity[] | undefined>) => {
  return async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return produce(MOCK_USERS_GROUPS, (draft) => {
      const storage = localStorage.getItem(storageKey);
      if (!storage) {
        throw new Error("Storage error!");
      }
      const parsed = JSON.parse(storage);
      if (params) {
        const {
          count = 25,
          start = 0,
          name,
          containedUser,
          notContainedUser,
        } = params;
        if (containedUser && notContainedUser) {
          throw new Error("Either or: containedUser, notContainedUser");
        }
        if (name) {
          draft = draft.filter((s) => s.name === name);
        }
        if (containedUser) {
          const ids = parsed[containedUser];
          draft = draft.filter((ug) => ids.includes(ug.id));
          return draft.slice(start, start + count);
        } else if (notContainedUser) {
          const ids = parsed[notContainedUser];
          draft = draft.filter((ug) => !ids.includes(ug.id));
          return draft.slice(start, start + count);
        }
      }

      return draft;
    });
  };
};

// List user groups available to the user.
export const useListUserGroupsHook = () => {
  const listUserGroups = useCustomUserGroupsInstance();

  return (params?: ListUserGroupsParams) => {
    return listUserGroups({
      params,
    });
  };
};

export const getListUserGroupsQueryKey = (params?: ListUserGroupsParams) =>
  ["user-groups", ...(params ? [params] : [])] as const;

export const useListUserGroupsQueryOptions = <
  TData = Awaited<ReturnType<ReturnType<typeof useListUserGroupsHook>>>,
  TError = unknown
>(
  params?: ListUserGroupsParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<ReturnType<typeof useListUserGroupsHook>>>,
      TError,
      TData
    >;
  }
): UseQueryOptions<
  Awaited<ReturnType<ReturnType<typeof useListUserGroupsHook>>>,
  TError,
  TData
> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListUserGroupsQueryKey(params);

  const listUserGroups = useListUserGroupsHook();

  const queryFn: QueryFunction<
    Awaited<ReturnType<ReturnType<typeof useListUserGroupsHook>>>
  > = () => listUserGroups(params);

  return { queryKey, queryFn, ...queryOptions };
};

export const useListUserGroups = <
  TData = Awaited<ReturnType<ReturnType<typeof useListUserGroupsHook>>>,
  TError = Error
>(
  params?: ListUserGroupsParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<ReturnType<typeof useListUserGroupsHook>>>,
      TError,
      TData
    >;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = useListUserGroupsQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};
