import type { ClientProfile, Engagement, Finding, FindingStatus } from "./types";

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.error ?? `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json();
}

async function patch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  return res.json();
}

export function requestMagicLink(email: string) {
  return post<{ ok: true; devLink?: string }>("/api/auth/request-link", { email });
}

export function verifyMagicLink(token: string) {
  return post<{ ok: true }>("/api/auth/verify", { token });
}

export async function logout(): Promise<void> {
  await post("/api/auth/logout", {});
}

export async function getMe(): Promise<ClientProfile | null> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  const data = await res.json();
  return data.client;
}

export async function getCurrentEngagement(): Promise<Engagement | null> {
  const res = await fetch("/api/engagements/current", { credentials: "include" });
  if (res.status === 401 || res.status === 404) return null;
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  const data = await res.json();
  return data.engagement;
}

export async function updateFindingStatus(
  findingId: string,
  status: FindingStatus,
): Promise<Finding> {
  const data = await patch<{ finding: Finding }>(
    `/api/engagements/findings/${findingId}`,
    { status },
  );
  return data.finding;
}

export function startScan(email: string, domain: string) {
  return post<{
    ok: true;
    engagementId: string;
    devLink?: string;
    emailError?: string;
  }>("/api/scan", { email, domain });
}

export function submitContactMessage(name: string, email: string, message: string) {
  return post<{ ok: true; id: string }>("/api/contact", { name, email, message });
}
