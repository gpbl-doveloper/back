import { asyncWrapper } from "./async";
import { CustomError } from "../lib/error/customError";
import ErrorCode from "../lib/error/errorCode";
import { logError } from "./logger";
import prisma from "../lib/prisma";

/**
 * verify db user
 */
const loginUser = asyncWrapper(async (req: any, res: any, next: any) => {
  if (!req.user) {
    throw new CustomError(ErrorCode.TOKEN_MISSING);
  }

  try {
    const userDB = await prisma.user.findFirst({
      where: { uid: req.user.uid },
    });
    req.loginUser = userDB;
    next();
  } catch (e) {
    const error = e as Error;
    logError(error.message);
    throw new CustomError(ErrorCode.UNAUTHORIZED);
  }
});

export default loginUser;
