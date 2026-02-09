import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { UpdateHobbyDto } from './dto/update-hobby.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HobbiesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.hobbies.findMany();
  }

  async create(createHobbyDto: CreateHobbyDto) {
    const { userId, ...payload } = createHobbyDto;

    const user = await this.prisma.users.findUnique({
      where: { id: +userId },
    });

    if (!user) {
      throw new BadRequestException(
        `Cannot create hobbies with the given userId`,
      );
    }

    return this.prisma.hobbies.create({
      data: {
        ...payload,
        user: {
          connect: { id: user.id },
        },
      },
    });
  }

  async findOne(id: number) {
    const hobbies = await this.prisma.hobbies.findUnique({
      where: { id },
    });

    if (!hobbies) throw new NotFoundException(`Hobbies with ${id} not found`);

    return hobbies;
  }

  async update(id: number, updateHobbyDto: UpdateHobbyDto) {
    await this.findOne(id);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId: _userId, ...payload } = updateHobbyDto;

    const data = payload;

    return this.prisma.hobbies.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.hobbies.delete({ where: { id } });
  }
}
