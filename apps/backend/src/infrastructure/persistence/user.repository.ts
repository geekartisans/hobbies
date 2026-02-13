import { IUserRepository } from "@domain/interfaces/user-repository.interface";
import { User } from "@domain/entities/user.entity";
import { PrismaClient } from "../generated/prisma/client";

export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<User[]> {
    const records = await this.prisma.users.findMany();

    return records.map((record) =>
      User.fromPersistence({
        id: record.id,
        firstName: record.firstName,
        lastName: record.lastName,
        address: record.address ?? "",
        phoneNumber: record.phoneNumber ?? "",
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      }),
    );
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.users.findUnique({ where: { id } });

    if (!record) return null;

    return User.fromPersistence({
      id: record.id,
      firstName: record.firstName,
      lastName: record.lastName,
      address: record.address ?? "",
      phoneNumber: record.phoneNumber ?? "",
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async save(user: User): Promise<User> {
    const record = await this.prisma.users.create({
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        phoneNumber: user.phoneNumber,
      },
    });

    return User.fromPersistence({
      id: record.id,
      firstName: record.firstName,
      lastName: record.lastName,
      address: record.address ?? "",
      phoneNumber: record.phoneNumber ?? "",
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  async delete(id: string): Promise<User> {
    const record = await this.prisma.users.delete({ where: { id } });

    return User.fromPersistence({
      id: record.id,
      firstName: record.firstName,
      lastName: record.lastName,
      address: record.address ?? "",
      phoneNumber: record.phoneNumber ?? "",
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
