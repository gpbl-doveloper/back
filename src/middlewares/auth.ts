import * as admin from "firebase-admin";
import { asyncWrapper } from "./async";
import { CustomError } from "../lib/error/customError";
import ErrorCode from "../lib/error/errorCode";
import { logError } from "./logger";

/**
 * verify firebase token
 */
const auth = asyncWrapper(async (req: any, res: any, next: any) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    throw new CustomError(ErrorCode.TOKEN_MISSING);
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (e) {
    const error = e as Error;
    logError(error.message);
    throw new CustomError(ErrorCode.UNAUTHORIZED);
  }
});

export default auth;
