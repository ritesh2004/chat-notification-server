import Router from "express";
import notificationRoutes from "./notification.routes";

const router = Router();

router.use("/api/v1/notifications", notificationRoutes);

export default router;
