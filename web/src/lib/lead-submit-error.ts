export class LeadSubmitError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "LeadSubmitError";
    this.code = code;
  }
}

export async function readLeadProblem(res: Response): Promise<{ code: string; error: string }> {
  const json = (await res.json().catch(() => null)) as { code?: unknown; error?: unknown } | null;
  const code = typeof json?.code === "string" ? json.code : "error";
  const error =
    typeof json?.error === "string" && json.error.trim()
      ? json.error
      : "Sorry, we couldn’t send that just now. Please try again.";
  return { code, error };
}
