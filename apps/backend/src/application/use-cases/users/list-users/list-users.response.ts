import { HobbyDto } from "@application/dto/hobby.dto";
import { UserDto } from "@application/dto/user.dto";

export interface ListUsersResponseItem extends UserDto {
  hobbies: HobbyDto[];
}

export type ListUsersResponse = ListUsersResponseItem[];
