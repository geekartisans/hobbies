import { User } from "@domain/entities/user.entity";
import { IUserRepository } from "@domain/interfaces/user-repository.interface";
import { CreateUserRequest } from "./create-user.request";
import { CreateUserResponse } from "./create-user.response";

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    const user = User.create(request);

    const saved = await this.userRepository.save(user);

    return this.toResponse(saved);
  }

  private toResponse(user: User): CreateUserResponse {
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
