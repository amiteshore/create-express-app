import { NotFound } from "http-errors";

export function notFound(req, res, next) {
  next(NotFound());
}

export function genericErrorHandler(err, req, res, next) {
  const statusCode = err.status || 500;
  res.status(statusCode).json({ message: err.message });
}
