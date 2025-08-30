export async function checkVersion() {
  try {
    const response = await fetch('/assets/version.json', {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });

    if (!response.ok) return false;

    const { version } = await response.json();
    const currentVersion = import.meta.env.VITE_APP_VERSION;

    return version !== currentVersion;
  } catch {
    return false;
  }
}
