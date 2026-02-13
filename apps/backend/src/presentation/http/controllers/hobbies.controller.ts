import { CreateHobbiesRequest } from "@application/use-cases/hobbies/create-hobbies/create-hobbies.request";
import { CreateHobbiesUseCase } from "@application/use-cases/hobbies/create-hobbies/create-hobbies.use-case";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export class HobbiesController {
  constructor(private readonly createHobbiesUseCase: CreateHobbiesUseCase) {}

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const request = CreateHobbiesRequest.create(req.body);
      const result = await this.createHobbiesUseCase.execute(request);

      res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  };
}
