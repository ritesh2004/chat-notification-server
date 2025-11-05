import { Router } from "express";
import { uploadTokenController, sendNotificationController, disableNotificationController } from "../controllers/notification.controllers";

const router = Router();

router.post("/upload-token", uploadTokenController);
router.post("/delete-token", disableNotificationController);
router.post("/send-notification", sendNotificationController);

export default router;