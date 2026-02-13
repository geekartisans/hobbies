import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { CreateUserUseCase } from "@application/use-cases/users/create-user/create-user.use-case";
import { CreateUserRequest } from "@application/use-cases/users/create-user/create-user.request";
import { ListUsersUseCase } from "@application/use-cases/users/list-users/list-users.use-case";
import { DeleteUserUseCase } from "@application/use-cases/users/delete-user/delete-user.use-case";
import { DeleteUserRequest } from "@application/use-cases/users/delete-user/delete-user.request";

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  list = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.listUsersUseCase.execute();

      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const request = CreateUserRequest.create(req.body);

      const result = await this.createUserUseCase.execute(request);

      res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  };

  remove = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const request = DeleteUserRequest.create({ id: req.params.id });

      await this.deleteUserUseCase.execute(request);

      res.status(StatusCodes.OK).send({ id: req.params.id });
    } catch (error) {
      next(error);
    }
  };
}
