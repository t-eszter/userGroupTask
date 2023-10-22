import {
  QueryFunction,
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "react-query";
import { MOCK_USERS } from "./constants";
import { ListUsersParams, Entity } from "./types";

type CustomUsersInstanceInputs = { params?: ListUsersParams };

const useCustomUsersInstance = (): (({
  params,
}: CustomUsersInstanceInputs) => Promise<Entity[] | undefined>) => {
  return async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_USERS;
  };
};

// List users available to the user.
export const useListUsersHook = () => {
  const listUsers = useCustomUsersInstance();

  return (params?: ListUsersParams) => {
    return listUsers({ params });
  };
};

export const getListUsersQueryKey = (params?: ListUsersParams) =>
  ["users", ...(params ? [params] : [])] as const;

export const useListUsersQueryOptions = <
  TData = Awaited<ReturnType<ReturnType<typeof useListUsersHook>>>,
  TError = unknown
>(
  params?: ListUsersParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<ReturnType<typeof useListUsersHook>>>,
      TError,
      TData
    >;
  }
): UseQueryOptions<
  Awaited<ReturnType<ReturnType<typeof useListUsersHook>>>,
  TError,
  TData
> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListUsersQueryKey(params);

  const listUsers = useListUsersHook();

  const queryFn: QueryFunction<
    Awaited<ReturnType<ReturnType<typeof useListUsersHook>>>
  > = () => listUsers(params);

  return { queryKey, queryFn, ...queryOptions };
};

export const useListUsers = <
  TData = Awaited<ReturnType<ReturnType<typeof useListUsersHook>>>,
  TError = unknown
>(
  params?: ListUsersParams,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<ReturnType<typeof useListUsersHook>>>,
      TError,
      TData
    >;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = useListUsersQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};
