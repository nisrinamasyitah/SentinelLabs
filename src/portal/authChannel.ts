/**
 * Cross-tab auth sync. A magic-link click from an email client always opens
 * in a new tab or window — no web API lets a site prevent that. This is the
 * next best thing: when sign-in completes in that new tab, broadcast it so
 * any other already-open tab of this site (e.g. one sitting on "check your
 * email") picks up the session and updates itself automatically, instead of
 * needing a manual refresh.
 */

type AuthEvent = { type: "signed-in" | "signed-out" };

const CHANNEL_NAME = "sentinel-auth";

function getChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === "undefined") return null;
  return new BroadcastChannel(CHANNEL_NAME);
}

export function broadcastAuthChange(type: AuthEvent["type"]) {
  const channel = getChannel();
  if (!channel) return;
  channel.postMessage({ type } satisfies AuthEvent);
  channel.close();
}

export function onAuthChange(handler: (type: AuthEvent["type"]) => void): () => void {
  const channel = getChannel();
  if (!channel) return () => {};
  const listener = (e: MessageEvent<AuthEvent>) => handler(e.data.type);
  channel.addEventListener("message", listener);
  return () => {
    channel.removeEventListener("message", listener);
    channel.close();
  };
}
