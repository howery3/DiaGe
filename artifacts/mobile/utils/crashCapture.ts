import AsyncStorage from "@react-native-async-storage/async-storage";

const CRASH_KEY = "@dige_crash_info";

type ErrorHandler = (error: Error, isFatal?: boolean) => void;

// React Native exposes ErrorUtils on the global object but TypeScript doesn't
// know about it, so we reach through `unknown` to avoid the type error.
const g = global as unknown as {
  ErrorUtils?: {
    getGlobalHandler: () => ErrorHandler;
    setGlobalHandler: (handler: ErrorHandler) => void;
  };
};

/**
 * Install a global fatal-error handler that saves the JS error message and
 * stack trace to AsyncStorage BEFORE letting React Native call abort().
 *
 * We delay the crash by waiting for the AsyncStorage write to finish in
 * `.finally()` so the data is actually persisted on disk. On the NEXT launch
 * we can read and display it instead of crashing again immediately.
 */
export function installCrashCapture(): void {
  if (!g.ErrorUtils) return;

  const prevHandler = g.ErrorUtils.getGlobalHandler();

  g.ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
    if (isFatal && error) {
      // Delay calling the original handler until the write completes.
      // AsyncStorage on iOS uses a background native thread so it usually
      // finishes in <10 ms even while the JS thread is "stuck" here.
      AsyncStorage.setItem(
        CRASH_KEY,
        JSON.stringify({
          message: error.message || "(no message)",
          stack: (error.stack || "").slice(0, 3000),
          buildVersion: "14",
          ts: new Date().toISOString(),
        })
      )
        .catch(() => {/* ignore write failure */})
        .finally(() => {
          prevHandler(error, isFatal);
        });
      return; // don't call prevHandler yet — wait for the write
    }
    prevHandler(error, isFatal);
  });
}

/** Read (and clear) any crash info saved by a previous fatal error. */
export async function popCrashInfo(): Promise<{
  message: string;
  stack: string;
  buildVersion: string;
  ts: string;
} | null> {
  try {
    const raw = await AsyncStorage.getItem(CRASH_KEY);
    if (!raw) return null;
    await AsyncStorage.removeItem(CRASH_KEY);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
