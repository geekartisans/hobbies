import { IHobbiesRepository } from "@domain/interfaces/hobbies-repository.interface";
import { Hobbies } from "@domain/entities/hobbies.entity";
import { PrismaClient } from "../generated/prisma/client";

export class HobbiesRepository implements IHobbiesRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Hobbies[]> {
    const rows = await this.prisma.hobbies.findMany();

    return rows.map((row) =>
      Hobbies.fromPersistence({
        id: row.id,
        userId: row.userId,
        hobbies: row.hobbies,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }),
    );
  }

  async findByUsers(userIds: string[]): Promise<Hobbies[]> {
    const rows = await this.prisma.hobbies.findMany({
      where: { userId: { in: userIds } },
    });

    return rows.map((row) =>
      Hobbies.fromPersistence({
        id: row.id,
        userId: row.userId,
        hobbies: row.hobbies,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }),
    );
  }

  async save(hobbies: Hobbies): Promise<Hobbies> {
    const row = await this.prisma.hobbies.create({
      data: {
        id: hobbies.id,
        userId: hobbies.userId,
        hobbies: hobbies.hobbies,
      },
    });

    return Hobbies.fromPersistence({
      id: row.id,
      userId: row.userId,
      hobbies: row.hobbies,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
