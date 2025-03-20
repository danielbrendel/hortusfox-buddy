CREATE TABLE `guilds` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `guild_id` varchar(512) NOT NULL,
  `api_key` varchar(512) DEFAULT NULL,
  `chan_recognition` varchar(512) DEFAULT NULL,
  `chan_catchgame` varchar(512) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
