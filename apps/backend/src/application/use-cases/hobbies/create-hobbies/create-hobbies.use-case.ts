import { Hobbies } from "@domain/entities/hobbies.entity";
import { CreateHobbiesRequest } from "./create-hobbies.request";
import { CreateHobbiesResponse } from "./create-hobbies.response";
import { IHobbiesRepository } from "@domain/interfaces/hobbies-repository.interface";

export class CreateHobbiesUseCase {
  constructor(private readonly hobbiesRepository: IHobbiesRepository) {}

  async execute(request: CreateHobbiesRequest): Promise<CreateHobbiesResponse> {
    const hobbies = Hobbies.create(request);

    const saved = await this.hobbiesRepository.save(hobbies);

    return this.toResponse(saved);
  }

  private toResponse(hobbies: Hobbies): CreateHobbiesResponse {
    return {
      id: hobbies.id,
      userId: hobbies.userId,
      hobbies: hobbies.hobbies,
      createdAt: hobbies.createdAt,
      updatedAt: hobbies.updatedAt,
    };
  }
}
