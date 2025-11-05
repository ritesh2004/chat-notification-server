import db from "../db/connect";
import { Request, Response } from "express";
import { notificationTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { Expo } from "expo-server-sdk";

export const uploadTokenController = async (req: Request, res: Response) => {
    try {
        const { token, userId } = req.body;
        
        if (!token || !userId) {
            return res.status(400).json({ message: "Token and userId are required" });
        }

        const existingUser = await db.select().from(notificationTable).where(eq(notificationTable.userId, userId));

        if (existingUser.length > 0) {
            await db.update(notificationTable).set({ token }).where(eq(notificationTable.userId, userId));
            return res.status(200).json({ message: "Token updated successfully" });
        }

        const existedToken = await db.select().from(notificationTable).where(eq(notificationTable.token, token));
        if (existedToken.length > 0) {
            await db.update(notificationTable).set({ userId }).where(eq(notificationTable.token, token));
            return res.status(200).json({ message: "Token updated successfully" });
        }

        await db.insert(notificationTable).values({ token, userId });

        return res.status(200).json({ message: "Token uploaded successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const disableNotificationController = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const notification = await db.select().from(notificationTable).where(eq(notificationTable.userId, userId));

        if (notification.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        await db.delete(notificationTable).where(eq(notificationTable.userId, userId));

        return res.status(200).json({ message: "Notification disabled successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const sendNotificationController = async (req: Request, res: Response) => {
    try {
        const { userId, title, body } = req.body;
        console.log("Triggered")
        
        if (!userId || !title || !body) {
            return res.status(400).json({ message: "userId, title and body are required" });
        }

        const notification = await db.select().from(notificationTable).where(eq(notificationTable.userId, userId));

        if (notification.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const payload = {
            to: notification[0].token,
            title: title,
            body: body,
            sound: "default",
            badge: 1,
            ttl: 3600,
            android: {
                channelId: "messages",
                imageUrl: "https://res.cloudinary.com/drctt42py/image/upload/v1728644229/chatapp-avatars/9_ogo64q.png", // must be https://
                smallIcon: "ic_notification", // optional custom app icon
            },
        }

        const expo = new Expo();

        const response = await expo.sendPushNotificationsAsync([payload]);

        console.log(response);

        if (response[0].status === "error") {
            return res.status(400).json({ message: "Notification failed" });
        }

        await db.update(notificationTable).set({ receiptIds: [...notification[0].receiptIds, response[0].id] }).where(eq(notificationTable.userId, userId));

        return res.status(200).json({ message: "Notification sent successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}