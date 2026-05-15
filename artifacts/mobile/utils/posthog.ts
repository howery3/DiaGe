import PostHog from "posthog-react-native";

let _client: PostHog | null = null;

export function getPostHog(): PostHog | null {
  const key = process.env.EXPO_PUBLIC_POSTHOG_KEY;
  if (!key) return null;
  if (!_client) {
    _client = new PostHog(key, {
      host: "https://us.i.posthog.com",
      disabled: false,
    });
  }
  return _client;
}

export function capture(
  event: string,
  properties?: Record<string, string | number | boolean | null>
) {
  getPostHog()?.capture(event, properties ?? {});
}
