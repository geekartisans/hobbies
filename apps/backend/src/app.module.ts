import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { HobbiesModule } from './hobbies/hobbies.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    HobbiesModule,
    ...(process.env.NODE_ENV === 'production'
      ? [
          ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../../../frontend/dist'),
            exclude: ['/api/(.*)'],
          }),
        ]
      : []),
  ],
})
export class AppModule {}
