import { User as FBUser } from "firebase/auth";
import { User as DBUser } from "@prisma/client";
declare global {
  namespace Express {
    interface Request {
      user?: FBUser;
      loginUser?: DBUser;
    }
  }
}
