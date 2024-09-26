import { Router } from "express";
import paths from "../common/paths";
// import userRoutes from "./userRoutes";

const apiRouter = Router();

const userRouter = Router();

// Get all users
// userRouter.get(Paths.Users.Get, UserRoutes.getAll);
// userRouter.post(Paths.Users.Add, UserRoutes.add);
// userRouter.put(Paths.Users.Update, UserRoutes.update);
// userRouter.delete(Paths.Users.Delete, UserRoutes.delete);

// Add UserRouter
apiRouter.use(paths.users.base, userRouter);

// **** Export default **** //

export default apiRouter;
