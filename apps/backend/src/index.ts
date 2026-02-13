import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../../../.env") });

import { getPrismaClient } from "@infrastructure/persistence/prisma.client";
import { UserRepository } from "@infrastructure/persistence/user.repository";
import { HobbiesRepository } from "@infrastructure/persistence/hobbies.repository";
import { CreateUserUseCase } from "@application/use-cases/users/create-user/create-user.use-case";
import { ListUsersUseCase } from "@application/use-cases/users/list-users/list-users.use-case";
import { DeleteUserUseCase } from "@application/use-cases/users/delete-user/delete-user.use-case";
import { UserController } from "@presentation/http/controllers/user.controller";
import { createApp } from "@presentation/http/app";
import { HobbiesController } from "@presentation/http/controllers/hobbies.controller";
import { CreateHobbiesUseCase } from "@application/use-cases/hobbies/create-hobbies/create-hobbies.use-case";

import { logger } from "@infrastructure/logger/logger";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const prismaClient = getPrismaClient();

/* Repositories */
const userRepository = new UserRepository(prismaClient);
const hobbiesRepository = new HobbiesRepository(prismaClient);

/* UseCases */
const createUserUseCase = new CreateUserUseCase(userRepository);
const listUsersUseCase = new ListUsersUseCase(
  userRepository,
  hobbiesRepository,
);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const createHobbiesUseCase = new CreateHobbiesUseCase(hobbiesRepository);

/* Controllers */
const userController = new UserController(
  createUserUseCase,
  listUsersUseCase,
  deleteUserUseCase,
);
const hobbiesController = new HobbiesController(createHobbiesUseCase);

async function main() {
  const app = await createApp(userController, hobbiesController, logger);

  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  logger.error(err, "Failed to start server");
  process.exit(1);
});
