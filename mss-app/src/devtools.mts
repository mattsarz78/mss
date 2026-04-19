import type { ApolloClient } from '@apollo/client/core';

/**
 * Initialize Apollo VSCode DevTools connection.
 * This file is only imported in development mode and will be completely
 * tree-shaken from production bundles.
 */
export async function initializeApolloDevTools(apolloClient: ApolloClient): Promise<void> {
  try {
    const { connectApolloClientToVSCodeDevTools } = await import('@apollo/client-devtools-vscode');
    if (typeof connectApolloClientToVSCodeDevTools === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      connectApolloClientToVSCodeDevTools(apolloClient as any, 'ws://localhost:7095');
    }
  } catch (err) {
    // Swallow devtools import errors.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const msg = err && (err as any).message ? (err as any).message : String(err);
    console.debug('Apollo VSCode devtools not loaded:', msg);
  }
}
