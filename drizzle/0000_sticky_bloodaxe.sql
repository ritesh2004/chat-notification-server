CREATE TABLE `notification_table` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`token` varchar(255) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`receipt_ids` json NOT NULL DEFAULT ('[]'),
	CONSTRAINT `notification_table_id` PRIMARY KEY(`id`),
	CONSTRAINT `notification_table_token_unique` UNIQUE(`token`),
	CONSTRAINT `notification_table_user_id_unique` UNIQUE(`user_id`)
);
