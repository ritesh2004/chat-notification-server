import { sql } from "drizzle-orm";
import { json, mysqlTable, serial, text, varchar } from "drizzle-orm/mysql-core";

export const notificationTable = mysqlTable("notification_table", {
    id: serial("id").primaryKey(),
    token: varchar("token", {length: 255}).notNull().unique(),
    userId: varchar("user_id", {length: 36}).notNull().unique(),
    receiptIds: json("receipt_ids").$type<string[]>().notNull().default(sql`('[]')`)
});