import { z } from "zod";
import { ValidationError } from "@domain/errors/domain.errors";
import { formatErrors } from "@application/helpers/format-errors";

const schema = z.object({
  id: z.string().uuid("Invalid user ID"),
});

export class GetUserRequest {
  private constructor(public readonly id: string) {}

  static create(input: unknown): GetUserRequest {
    const result = schema.safeParse(input);
    if (!result.success) {
      throw new ValidationError("Invalid input", formatErrors(result.error));
    }
    return new GetUserRequest(result.data.id);
  }
}
