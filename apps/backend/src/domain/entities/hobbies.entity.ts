import { randomUUID } from "crypto";

export interface IHobbies {
  id: string;
  userId: string;
  hobbies: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Hobbies {
  get id() {
    return this.props.id;
  }

  get userId() {
    return this.props.userId;
  }

  get hobbies() {
    return this.props.hobbies;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private constructor(private props: IHobbies) {}

  static create(
    input: Omit<IHobbies, "id" | "createdAt" | "updatedAt">,
  ): Hobbies {
    const now = new Date();

    return new Hobbies({
      id: randomUUID(),
      userId: input.userId,
      hobbies: input.hobbies,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: IHobbies): Hobbies {
    return new Hobbies({ ...props });
  }
}
