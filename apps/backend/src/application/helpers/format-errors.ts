import { z } from "zod";

export function formatErrors(error: z.ZodError): Record<string, string[]> {
  const details: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    details[key] = details[key] ?? [];
    details[key].push(issue.message);
  }
  return details;
}
