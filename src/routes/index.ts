import { Router } from "express";
import paths from "../common/paths";
import diaryRoutes from "./diaryRoutes";
import pictureRoutes from "./pictureRoutes";
import authRouters from "./authRoutes";

const apiRouter = Router();

// apiRouter.use(paths.user.base, userRouter);
apiRouter.use(paths.diary.base, diaryRoutes);
apiRouter.use(paths.picture.base, pictureRoutes);
apiRouter.use(paths.auth.base, authRouters);

// **** Export default **** //

export default apiRouter;