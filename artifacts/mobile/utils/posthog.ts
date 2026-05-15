import PostHog from "posthog-react-native";

let _client: PostHog | null = null;

export function getPostHog(): PostHog | null {
  const key = process.env.EXPO_PUBLIC_POSTHOG_KEY;
  if (!key) return null;
  if (_client) return _client;
  try {
    _client = new PostHog(key, {
      host: "https://us.i.posthog.com",
      disabled: false,
    });
  } catch {
    _client = null;
  }
  return _client;
}

export function capture(
  event: string,
  properties?: Record<string, string | number | boolean | null>
) {
  try {
    getPostHog()?.capture(event, properties ?? {});
  } catch {
    // analytics failures must never surface to the user
  }
}
