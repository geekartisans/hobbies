import { Hobbies } from "@domain/entities/hobbies.entity";
import { IHobbiesRepository } from "@domain/interfaces/hobbies-repository.interface";
import { User } from "@domain/entities/user.entity";
import { NotFoundError } from "@domain/errors/domain.errors";
import { IUserRepository } from "@domain/interfaces/user-repository.interface";
import { HobbyDto } from "@application/dto/hobby.dto";
import { GetUserRequest } from "./get-user.request";
import { GetUserResponse } from "./get-user.response";

export class GetUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hobbiesRepository: IHobbiesRepository,
  ) {}

  async execute(request: GetUserRequest): Promise<GetUserResponse> {
    const [user, hobbies] = await Promise.all([
      this.userRepository.findById(request.id),
      this.hobbiesRepository.findByUsers([request.id]),
    ]);

    if (!user) {
      throw new NotFoundError("User", request.id);
    }

    return this.toResponse(user, hobbies);
  }

  private toResponse(user: User, hobbies: Hobbies[]): GetUserResponse {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      hobbies: hobbies.map(this.toHobbyItem),
    };
  }

  private toHobbyItem(hobby: Hobbies): HobbyDto {
    return {
      id: hobby.id,
      userId: hobby.userId,
      hobbies: hobby.hobbies,
      createdAt: hobby.createdAt,
      updatedAt: hobby.updatedAt,
    };
  }
}
