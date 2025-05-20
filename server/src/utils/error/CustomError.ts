export class CustomError extends Error {
  public code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;

    // Set the prototype explicitly (needed when extending built-in classes in TS)
    Object.setPrototypeOf(this, CustomError.prototype);

    // Optional: capture stack trace excluding constructor call
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
