import { LeadSubmitError, readLeadProblem } from "./lead-submit-error";
import { launchMsg91Otp, widgetIdentifier } from "./msg91-widget";

// Every website form submits through here. OTP, the reused session, and the
// CRM post stay in one place so a new form does not copy the widget snippet.

const RETRY_CODES = new Set(["otp_required", "otp_invalid", "otp_expired", "otp_mismatch"]);

export type SubmitLeadOptions = {
  apiUrl: string;
  fetch?: typeof fetch;
  launchOtp?: (identifier?: string) => Promise<string>;
};

export async function submitLead(data: Record<string, unknown>, options: SubmitLeadOptions): Promise<void> {
  const fetchImpl = options.fetch ?? globalThis.fetch;
  const api = options.apiUrl.replace(/\/$/, "");
  const identifier = widgetIdentifier(data);
  const launchOtp =
    options.launchOtp ??
    ((id?: string) => launchMsg91Otp(id, { apiUrl: api, fetch: fetchImpl }));

  const sessionRes = await fetchImpl(`${api}/otp/session`, { credentials: "include", cache: "no-store" });
  if (sessionRes.status === 429) {
    const problem = await readLeadProblem(sessionRes);
    throw new LeadSubmitError(problem.error, "rate_limited");
  }
  const session = sessionRes.ok ? ((await sessionRes.json().catch(() => null)) as { verified?: unknown } | null) : null;
  let launched = false;
  let accessToken: string | undefined;
  if (!session?.verified) {
    accessToken = await obtainToken(launchOtp, identifier);
    launched = true;
  }

  let res = await postLead(fetchImpl, api, data, accessToken);
  if (res.status === 429) {
    const problem = await readLeadProblem(res);
    throw new LeadSubmitError(problem.error, "rate_limited");
  }
  if (!res.ok && !launched) {
    const problem = await readLeadProblem(res);
    if (RETRY_CODES.has(problem.code)) {
      accessToken = await obtainToken(launchOtp, identifier);
      launched = true;
      res = await postLead(fetchImpl, api, data, accessToken);
    } else {
      throw new LeadSubmitError(problem.error, problem.code);
    }
  }
  if (!res.ok) {
    const problem = await readLeadProblem(res);
    throw new LeadSubmitError(problem.error, problem.code);
  }
}

async function obtainToken(launchOtp: (identifier?: string) => Promise<string>, identifier?: string): Promise<string> {
  try {
    return await launchOtp(identifier);
  } catch (err) {
    if (err instanceof LeadSubmitError) throw err;
    throw new LeadSubmitError("Verification was cancelled. Please try again.", "otp_cancelled");
  }
}

async function postLead(fetchImpl: typeof fetch, api: string, data: Record<string, unknown>, accessToken?: string): Promise<Response> {
  const body: Record<string, unknown> = { ...data };
  delete body.accessToken;
  delete body.website;
  if (accessToken) body.accessToken = accessToken;
  return fetchImpl(`${api}/otp/submit`, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export { LeadSubmitError };
