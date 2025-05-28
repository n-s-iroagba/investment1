import type { Request, Response } from "express"
import logger from "../logger/logger.js"
import { CustomError } from "./CustomError.js"

export function errorHandler(err: unknown, req: Request, res: Response) {
  // Default to 500 if no code provided
  let statusCode = 500
  let message = "Internal Server Error"

  if (err instanceof CustomError) {
    statusCode = err.code
    message = err.message

    logger.warn(`CustomError - ${statusCode}: ${message} - URL: ${req.originalUrl}`)
  } else if (err instanceof Error) {
    message = err.message
    // Log unknown errors at 'error' level
    logger.error(`Error: ${message} - URL: ${req.originalUrl} - Stack: ${err.stack}`)
  } else {
    // If err is something else (string, object, etc)
    logger.error(`Unknown error type: ${JSON.stringify(err)} - URL: ${req.originalUrl}`)
  }

  return res.status(statusCode).json({
    error: {
      code: statusCode,
      message,
    },
  })
}

export { CustomError } from "./CustomError.js"
