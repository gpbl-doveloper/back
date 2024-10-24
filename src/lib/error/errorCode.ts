import HttpStatusCodes from "../../common/HttpStatusCodes";

export type TErrorCode = {
  code: number;
  statusCode: number;
  message: string;
};

// Error Codes
const ErrorCode: { [key: string]: TErrorCode } = {
  PRISMA_INTERNAL_SERVER_ERROR: {
    code: 1001,
    statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR, // 500
    message: "internal server error: prisma DB error",
  },
  NO_FILES_UPLOADED: {
    code: 5001,
    statusCode: HttpStatusCodes.BAD_REQUEST, //400
    message: "No files uploaded",
  },
  USER_ALREADY_EXIST: {
    code: 4001,
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: "User Already Exist",
  },
  USER_NOT_EXIST: {
    code: 4002,
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: "User Not Exist",
  },
  UNAUTHORIZED: {
    code: 4003,
    statusCode: HttpStatusCodes.UNAUTHORIZED,
    message: "Unauthorized",
  },
  TOKEN_MISSING: {
    code: 4004,
    statusCode: HttpStatusCodes.UNAUTHORIZED,
    message: "Authorization token missing",
  },
};

export default ErrorCode;
