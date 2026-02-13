import { Hobbies } from "../entities/hobbies.entity";

export interface IHobbiesRepository {
  findAll(): Promise<Hobbies[]>;
  findByUsers(users: string[]): Promise<Hobbies[]>;
  save(hobbies: Hobbies): Promise<Hobbies>;
}
