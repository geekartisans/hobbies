import { z } from "zod";
import { ValidationError } from "@domain/errors/domain.errors";
import { formatErrors } from "@application/helpers/format-errors";

const schema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  address: z.string().max(255).optional().default(""),
  phoneNumber: z.string().max(50).optional().default(""),
});

export class CreateUserRequest {
  private constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly address: string,
    public readonly phoneNumber: string,
  ) {}

  static create(input: unknown): CreateUserRequest {
    const result = schema.safeParse(input);

    if (!result.success) {
      throw new ValidationError("Invalid input", formatErrors(result.error));
    }

    return new CreateUserRequest(
      result.data.firstName,
      result.data.lastName,
      result.data.address,
      result.data.phoneNumber,
    );
  }
}
