import { Router } from "express";
import paths from "../common/paths";
import diaryRoutes from "./diaryRoutes";
import pictureRoutes from "./pictureRoutes";
import authRouters from "./authRoutes";
import dogRouters from "./dogRoutes";
import centerRouters from "./centerRoutes";
import reservationRouters from "./reservationRoutes";

const apiRouter = Router();

// apiRouter.use(paths.user.base, userRouter);
apiRouter.use(paths.diary.base, diaryRoutes);
apiRouter.use(paths.picture.base, pictureRoutes);
apiRouter.use(paths.auth.base, authRouters);
apiRouter.use(paths.dog.base, dogRouters);
apiRouter.use(paths.center.base, centerRouters);
apiRouter.use(paths.reservation.base, reservationRouters);

// **** Export default **** //
export default apiRouter;
