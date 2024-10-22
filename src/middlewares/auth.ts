import * as admin from "firebase-admin";
import { asyncWrapper } from "./async";
import { CustomError } from "../lib/error/customError";
import ErrorCode from "../lib/error/errorCode";

/**
 * verify firebase token
 */
const auth = asyncWrapper(async (req: any, res: any, next: any) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  // FIXME fix error handling strategy
  if (!idToken) {
    res.status(401).send("Authorization token missing"); // TODO make error code, throw error
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized"); // TODO make error code, throw error
  }
});

export default auth;
