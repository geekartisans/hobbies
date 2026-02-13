import { Hobbies } from "@domain/entities/hobbies.entity";
import { IHobbiesRepository } from "@domain/interfaces/hobbies-repository.interface";
import { User } from "@domain/entities/user.entity";
import { IUserRepository } from "@domain/interfaces/user-repository.interface";
import { HobbyDto } from "@application/dto/hobby.dto";
import {
  ListUsersResponse,
  ListUsersResponseItem,
} from "./list-users.response";

export class ListUsersUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hobbiesRepository: IHobbiesRepository,
  ) {}

  async execute(): Promise<ListUsersResponse> {
    const [users, hobbies] = await Promise.all([
      this.userRepository.findAll(),
      this.hobbiesRepository.findAll(),
    ]);

    const hobbiesByUserId = new Map<string, Hobbies[]>();

    for (const hobby of hobbies) {
      const list = hobbiesByUserId.get(hobby.userId) ?? [];
      list.push(hobby);
      hobbiesByUserId.set(hobby.userId, list);
    }

    return users.map((user) =>
      this.toResponseItem(user, hobbiesByUserId.get(user.id) ?? []),
    );
  }

  private toResponseItem(
    user: User,
    hobbies: Hobbies[],
  ): ListUsersResponseItem {
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
