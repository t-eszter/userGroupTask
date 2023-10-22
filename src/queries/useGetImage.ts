import {
  QueryFunction,
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "react-query";

import DOC from "../assets/musterrechnung.jpeg";
import DOC_LANDSCAPE from "../assets/musterrechnung_landscape.jpeg";

type Params = { pageNum: number };

const useCustomInstance = (): ((
  params: Params
) => Promise<string | undefined>) => {
  return async (params: Params) => {
    const { pageNum } = params;
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (pageNum === 0) {
      return DOC;
    } else if (pageNum === 1) {
      return DOC_LANDSCAPE;
    }
  };
};

/**
 * Retrieve the image for a given document
 */
export const useGetImageHook = () => {
  const getImage = useCustomInstance();

  return (pageNum: number) => {
    return getImage({ pageNum });
  };
};

export const getGetImageQueryKey = (pageNum: number) =>
  [`/api/image/${pageNum}`] as const;

export const useGetImageQueryOptions = <
  TData = Awaited<ReturnType<ReturnType<typeof useGetImageHook>>>,
  TError = unknown
>(
  pageNum: number,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<ReturnType<typeof useGetImageHook>>>,
      TError,
      TData
    >;
  }
): UseQueryOptions<
  Awaited<ReturnType<ReturnType<typeof useGetImageHook>>>,
  TError,
  TData
> & { queryKey: QueryKey } => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetImageQueryKey(pageNum);

  const getImage = useGetImageHook();

  const queryFn: QueryFunction<
    Awaited<ReturnType<ReturnType<typeof useGetImageHook>>>
  > = () => getImage(pageNum);

  return { queryKey, queryFn, enabled: true, ...queryOptions };
};

export const useGetImage = <
  TData = Awaited<ReturnType<ReturnType<typeof useGetImageHook>>>,
  TError = unknown
>(
  pageNum: number,
  options?: {
    query?: UseQueryOptions<
      Awaited<ReturnType<ReturnType<typeof useGetImageHook>>>,
      TError,
      TData
    >;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = useGetImageQueryOptions(pageNum, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};
