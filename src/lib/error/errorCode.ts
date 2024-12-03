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
    message: "At least one file must be uploaded.",
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
  USER_CENTER_ID_MISSING: {
    code: 6002,
    statusCode: HttpStatusCodes.FORBIDDEN,
    message: "CenterId Missing",
  },

  DOG_NOT_FOUND: {
    code: 3001,
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: "There is no such dog",
  },
  NOT_A_PARENT: {
    code: 3002,
    statusCode: HttpStatusCodes.FORBIDDEN,
    message: "Not a parent",
  },
  CENTER_NOT_FOUND: {
    code: 3003,
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: "There is no such center",
  },

  DOG_QUERY_MISSING: {
    code: 6001,
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: "Query Missing {dog}",
  },
  NO_VALID_FIELDS_PROVIDED: {
    code: 6002,
    statusCode: HttpStatusCodes.BAD_REQUEST,
    message: "No valid fields provided for update",
  },
  FILE_NOT_FOUND: {
    code: 6003,
    statusCode: HttpStatusCodes.NOT_FOUND,
    message: "No such file exists",
  },
};

export default ErrorCode;
