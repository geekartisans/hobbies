import { HobbyDto } from "../../../dto/hobby.dto";
import { UserDto } from "../../../dto/user.dto";

export interface GetUserResponse extends UserDto {
  hobbies: HobbyDto[];
}
