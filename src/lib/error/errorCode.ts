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
};

export default ErrorCode;
