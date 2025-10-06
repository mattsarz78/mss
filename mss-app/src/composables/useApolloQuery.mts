import { apolloClient } from '#/apolloClient.mjs';
import type { ObservableQuery, OperationVariables } from '@apollo/client/core';
import type { DocumentNode } from 'graphql';
import type { Ref } from 'vue';
import { onUnmounted, ref } from 'vue';

export type UseApolloQueryReturn<TData = unknown, TVars extends OperationVariables = OperationVariables> = {
  data: Ref<TData | null>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  refetch: (vars?: Partial<TVars>) => Promise<unknown>;
  observable: ObservableQuery<TData, TVars>;
};

export function useApolloQuery<TData = unknown, TVars extends OperationVariables = OperationVariables>(
  query: DocumentNode,
  variables?: TVars,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _options: Record<string, unknown> = {}
): UseApolloQueryReturn<TData, TVars> {
  const data = ref<TData | null>(null) as Ref<TData | null>;
  const loading = ref<boolean>(true) as Ref<boolean>;
  const error = ref<Error | null>(null) as Ref<Error | null>;

  const rawOpts = {
    query,
    variables: variables as unknown,
    // default to network-only for clarity
    fetchPolicy: 'network-only'
  } as unknown;

  const observable = apolloClient.watchQuery<TData, TVars>(rawOpts as never) as ObservableQuery<TData, TVars>;

  const subscription = observable.subscribe({
    next(result) {
      data.value = (result.data ?? null) as TData;
      loading.value = !!result.loading;
      error.value = result?.error ?? null;
    },
    error(err: unknown) {
      error.value = err instanceof Error ? err : new Error(String(err));
      loading.value = false;
    }
  });

  onUnmounted(() => subscription.unsubscribe());

  const refetch: (vars?: Partial<TVars>) => Promise<unknown> = (vars?: Partial<TVars>) =>
    observable.refetch(vars as unknown as TVars | undefined) as unknown as Promise<unknown>;

  return { data, loading, error, refetch, observable };
}
