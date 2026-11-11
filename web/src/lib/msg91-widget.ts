import { LeadSubmitError, readLeadProblem } from "./lead-submit-error";

// Official MSG91 OTP widget. Loaded once and shared by every website form.
// AuthKey is not part of this configuration.

export const OTP_PROVIDER_SCRIPTS = [
  "https://verify.msg91.com/otp-provider.js",
  "https://verify.phone91.com/otp-provider.js",
] as const;

export type Msg91WidgetConfig = {
  widgetId: string;
  tokenAuth: string;
  identifier?: string;
  exposeMethods?: boolean;
  success: (data: unknown) => void;
  failure: (error: unknown) => void;
};

declare global {
  interface Window {
    initSendOTP?: (configuration: Msg91WidgetConfig) => void;
  }
}

const JWT_RE = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

export function accessTokenFromWidget(data: unknown, depth = 0): string | null {
  if (typeof data === "string") return looksLikeJwt(data.trim()) ? data.trim() : null;
  if (!data || typeof data !== "object" || depth > 3) return null;
  const record = data as Record<string, unknown>;
  for (const key of ["access-token", "accessToken", "access_token", "token", "jwt"]) {
    const value = record[key];
    if (typeof value === "string" && looksLikeJwt(value.trim())) return value.trim();
  }
  if (typeof record.message === "string" && looksLikeJwt(record.message.trim())) return record.message.trim();
  if ("data" in record) return accessTokenFromWidget(record.data, depth + 1);
  return null;
}

export function widgetIdentifier(data: Record<string, unknown>): string | undefined {
  if (typeof data.phone === "string") {
    const digits = data.phone.replace(/\D/g, "");
    if (digits.length === 10) return `91${digits}`;
    if (digits.length >= 11 && digits.length <= 15) return digits;
  }
  if (typeof data.email === "string" && data.email.includes("@")) return data.email.trim();
  return undefined;
}

export function widgetConfiguration(options: {
  widgetId: string;
  tokenAuth: string;
  identifier?: string;
  exposeMethods?: boolean;
  onSuccess: (token: string) => void;
  onFailure: (error: unknown) => void;
}): Msg91WidgetConfig {
  const config: Msg91WidgetConfig = {
    widgetId: options.widgetId,
    tokenAuth: options.tokenAuth,
    success: (data) => {
      const token = accessTokenFromWidget(data);
      if (!token) options.onFailure(new LeadSubmitError("Verification did not return a token. Please try again.", "otp_invalid"));
      else options.onSuccess(token);
    },
    failure: (error) => options.onFailure(error),
  };
  if (options.identifier) config.identifier = options.identifier;
  if (options.exposeMethods !== undefined) config.exposeMethods = options.exposeMethods;
  return config;
}

export function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${CSS.escape(src)}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      reject(new Error("OTP provider failed to load"));
    };
    document.head.appendChild(script);
  });
}

function providerReady(): boolean {
  return typeof window !== "undefined" && typeof window.initSendOTP === "function";
}

export async function ensureOtpProvider(
  load: (src: string) => Promise<void> = loadScript,
  ready: () => boolean = providerReady,
): Promise<void> {
  if (ready()) return;
  let last: unknown;
  for (const src of OTP_PROVIDER_SCRIPTS) {
    try {
      await load(src);
      if (ready()) return;
      last = new Error("OTP provider did not start");
    } catch (err) {
      last = err;
    }
  }
  throw last instanceof Error ? last : new Error("OTP provider did not load");
}

export type WidgetDeps = {
  apiUrl: string;
  fetch?: typeof fetch;
  ensureProvider?: () => Promise<void>;
  initSendOTP?: (configuration: Msg91WidgetConfig) => void;
};

export async function launchMsg91Otp(identifier: string | undefined, deps: WidgetDeps): Promise<string> {
  const fetchImpl = deps.fetch ?? fetch;
  const res = await fetchImpl(`${deps.apiUrl.replace(/\/$/, "")}/otp/config`, { credentials: "include", cache: "no-store" });
  if (!res.ok) {
    const problem = await readLeadProblem(res);
    throw new LeadSubmitError(problem.error, problem.code);
  }
  const config = (await res.json()) as { widgetId?: unknown; tokenAuth?: unknown };
  if (typeof config.widgetId !== "string" || typeof config.tokenAuth !== "string" || !config.widgetId || !config.tokenAuth) {
    throw new LeadSubmitError("We couldn’t verify your number just now. Please try again in a moment.", "otp_unavailable");
  }
  await (deps.ensureProvider ?? ensureOtpProvider)();
  const init =
    deps.initSendOTP ??
    ((configuration: Msg91WidgetConfig) => {
      if (!window.initSendOTP) throw new LeadSubmitError("We couldn’t verify your number just now. Please try again in a moment.", "otp_unavailable");
      window.initSendOTP(configuration);
    });
  return new Promise((resolve, reject) => {
    try {
      init(
        widgetConfiguration({
          widgetId: config.widgetId as string,
          tokenAuth: config.tokenAuth as string,
          identifier,
          onSuccess: resolve,
          onFailure: (error) => {
            if (error instanceof LeadSubmitError) reject(error);
            else reject(new LeadSubmitError("Verification was cancelled. Please try again.", "otp_cancelled"));
          },
        }),
      );
    } catch (err) {
      if (err instanceof LeadSubmitError) reject(err);
      else reject(new LeadSubmitError("Verification was cancelled. Please try again.", "otp_cancelled"));
    }
  });
}

function looksLikeJwt(value: string): boolean {
  return value.length > 20 && value.length < 8192 && JWT_RE.test(value);
}
