import { apolloClient } from '#/apolloClient.mjs';
import type { ApolloQueryResult, ObservableQuery, OperationVariables } from '@apollo/client/core';
import type { DocumentNode } from 'graphql';
import type { Ref } from 'vue';
import { onUnmounted, ref } from 'vue';

export function useApolloLazyQuery<TData = unknown, TVars extends OperationVariables = OperationVariables>(
  query: DocumentNode,
  defaultOptions: Record<string, unknown> = {}
) {
  const data = ref<TData | null>(null) as Ref<TData | null>;
  const loading = ref<boolean>(false) as Ref<boolean>;
  const error = ref<Error | null>(null) as Ref<Error | null>;
  const called = ref<boolean>(false) as Ref<boolean>;

  let observable: ObservableQuery<TData, TVars> | undefined;
  let subscription: { unsubscribe: () => void } | undefined;

  function createAndSubscribe(variables?: TVars, options?: Record<string, unknown>) {
    const opts = Object.assign({}, defaultOptions || {}, options || {});
    opts.query = query as unknown as DocumentNode;
    opts.variables = variables as unknown as TVars | undefined;
    opts.fetchPolicy = (options && options.fetchPolicy) ?? 'network-only';

    observable = apolloClient.watchQuery<TData, TVars>(opts as never) as ObservableQuery<TData, TVars>;

    subscription = observable.subscribe({
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

    return observable;
  }

  async function load(variables?: TVars, options?: Record<string, unknown>) {
    called.value = true;
    loading.value = true;

    if (!observable) {
      createAndSubscribe(variables, options as Record<string, unknown>);
    } else if (variables && typeof (observable as unknown as { setVariables?: unknown }).setVariables === 'function') {
      try {
        await (observable as unknown as { setVariables: (v: TVars) => Promise<unknown> }).setVariables(variables);
      } catch {
        // ignore setVariables errors
      }
    }

    try {
      const result = await (
        observable as unknown as { refetch: (v?: TVars) => Promise<ApolloQueryResult<TData>> }
      ).refetch(variables as unknown as TVars);
      loading.value = !!result.loading;
      return result as ApolloQueryResult<TData>;
    } catch (err) {
      loading.value = false;
      error.value = err instanceof Error ? err : new Error(String(err));
      throw err;
    }
  }

  async function refetch(vars?: Partial<TVars>) {
    if (!observable) {
      await load(vars as TVars);
    }
    return (observable as unknown as { refetch: (v?: Partial<TVars>) => Promise<ApolloQueryResult<TData>> }).refetch(
      vars as Partial<TVars>
    );
  }

  function stop() {
    if (subscription) {
      subscription.unsubscribe();
      subscription = undefined;
    }
    observable = undefined;
    loading.value = false;
  }

  onUnmounted(stop);

  return {
    load,
    called,
    data,
    loading,
    error,
    refetch,
    get observable() {
      return observable;
    },
    stop
  };
}
