import { z } from "zod";
import { ValidationError } from "@domain/errors/domain.errors";
import { formatErrors } from "@application/helpers/format-errors";

const schema = z.object({
  userId: z.string().uuid(),
  hobbies: z.string().min(1).max(255),
});

export class CreateHobbiesRequest {
  private constructor(
    public readonly userId: string,
    public readonly hobbies: string,
  ) {}

  static create(input: unknown): CreateHobbiesRequest {
    const result = schema.safeParse(input);

    if (!result.success) {
      throw new ValidationError("Invalid input", formatErrors(result.error));
    }

    return new CreateHobbiesRequest(result.data.userId, result.data.hobbies);
  }
}
