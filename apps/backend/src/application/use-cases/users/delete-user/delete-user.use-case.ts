import { User } from "@domain/entities/user.entity";
import { NotFoundError } from "@domain/errors/domain.errors";
import { IUserRepository } from "@domain/interfaces/user-repository.interface";
import { DeleteUserRequest } from "./delete-user.request";
import { DeleteUserResponse } from "./delete-user.response";

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: DeleteUserRequest): Promise<DeleteUserResponse> {
    const user = await this.userRepository.findById(request.id);

    if (!user) {
      throw new NotFoundError("User", request.id);
    }

    await this.userRepository.delete(request.id);

    return this.toResponse(user);
  }

  private toResponse(user: User): DeleteUserResponse {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
