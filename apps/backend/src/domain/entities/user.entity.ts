import { randomUUID } from "node:crypto";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  get id() {
    return this.props.id;
  }

  get firstName() {
    return this.props.firstName;
  }

  get lastName() {
    return this.props.lastName;
  }

  get address() {
    return this.props.address;
  }

  get phoneNumber() {
    return this.props.phoneNumber;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private constructor(private props: IUser) {}

  static create(input: Omit<IUser, "id" | "createdAt" | "updatedAt">): User {
    const now = new Date();

    return new User({
      id: randomUUID(),
      firstName: input.firstName,
      lastName: input.lastName,
      address: input.address,
      phoneNumber: input.phoneNumber,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: IUser): User {
    return new User({ ...props });
  }
}
