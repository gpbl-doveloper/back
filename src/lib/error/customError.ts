import { TErrorCode } from "./errorCode";

class CustomError extends Error {
  statusCode: number;
  errorCode: number;

  constructor(errorCode: TErrorCode) {
    super(errorCode.message);
    this.errorCode = errorCode.code;
    this.statusCode = errorCode.statusCode;

    // Maintaining the prototype chain when extending built-ins like Error
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export { CustomError };
