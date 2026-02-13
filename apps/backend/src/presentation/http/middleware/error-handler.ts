import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import {
  DomainError,
  NotFoundError,
  ConflictError,
  ValidationError,
} from "@domain/errors/domain.errors";

function domainErrorToStatusCode(error: DomainError): number {
  if (error instanceof NotFoundError) return StatusCodes.NOT_FOUND;
  if (error instanceof ConflictError) return StatusCodes.CONFLICT;
  if (error instanceof ValidationError) return StatusCodes.UNPROCESSABLE_ENTITY;
  return StatusCodes.BAD_REQUEST;
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ValidationError) {
    res.status(domainErrorToStatusCode(err)).json({
      error: err.message,
      details: err.details,
    });
    return;
  }

  if (err instanceof DomainError) {
    res.status(domainErrorToStatusCode(err)).json({
      error: err.message,
    });
    return;
  }

  req.log.error(err, "Unhandled error");

  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: "Internal server error" });
}
