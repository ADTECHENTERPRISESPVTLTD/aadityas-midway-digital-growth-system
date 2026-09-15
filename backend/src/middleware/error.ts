import { NextFunction, Request, Response } from "express";

export function notFound(req: Request, res: Response) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  if (err?.name === "ValidationError") {
    return res.status(400).json({ success: false, message: "Validation error", errors: err.errors });
  }

  if (err?.code === 11000) {
    return res.status(409).json({ success: false, message: "Duplicate value", details: err.keyValue });
  }

  const status = err?.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err?.message || "Internal server error"
  });
}
