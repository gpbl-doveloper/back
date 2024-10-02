import { Router } from "express";
import paths from "../common/paths";
import diaryRoutes from "./diaryRoutes";

const apiRouter = Router();

// apiRouter.use(paths.user.base, userRouter);
apiRouter.use(paths.diary.base, diaryRoutes);

// **** Export default **** //

export default apiRouter;
