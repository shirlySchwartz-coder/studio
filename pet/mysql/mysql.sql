CREATE DATABASE  IF NOT EXISTS `pet_adoption` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pet_adoption`;
-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: pet_adoption
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adoption_requests`
--

DROP TABLE IF EXISTS `adoption_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adoption_requests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `animal_id` bigint NOT NULL,
  `message` text,
  `status_id` int NOT NULL,
  `reviewed_by_user_id` bigint DEFAULT NULL,
  `admin_notes` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `status_id` (`status_id`),
  KEY `reviewed_by_user_id` (`reviewed_by_user_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_animal_id` (`animal_id`),
  CONSTRAINT `adoption_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `adoption_requests_ibfk_2` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`id`) ON DELETE CASCADE,
  CONSTRAINT `adoption_requests_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `request_statuses` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `adoption_requests_ibfk_4` FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adoption_requests`
--

LOCK TABLES `adoption_requests` WRITE;
/*!40000 ALTER TABLE `adoption_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `adoption_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `animal_comments`
--

DROP TABLE IF EXISTS `animal_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animal_comments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `animal_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `comment_text` text NOT NULL,
  `status_id` int NOT NULL,
  `parent_comment_id` bigint DEFAULT NULL,
  `moderated_by_user_id` bigint DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `status_id` (`status_id`),
  KEY `parent_comment_id` (`parent_comment_id`),
  KEY `moderated_by_user_id` (`moderated_by_user_id`),
  KEY `idx_animal_id` (`animal_id`),
  CONSTRAINT `animal_comments_ibfk_1` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`id`) ON DELETE CASCADE,
  CONSTRAINT `animal_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `animal_comments_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `comment_statuses` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `animal_comments_ibfk_4` FOREIGN KEY (`parent_comment_id`) REFERENCES `animal_comments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `animal_comments_ibfk_5` FOREIGN KEY (`moderated_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animal_comments`
--

LOCK TABLES `animal_comments` WRITE;
/*!40000 ALTER TABLE `animal_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `animal_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `animal_medical_events`
--

DROP TABLE IF EXISTS `animal_medical_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animal_medical_events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `animal_id` bigint NOT NULL,
  `event_type` varchar(100) NOT NULL,
  `event_date` datetime DEFAULT NULL,
  `description` text,
  `needs` text,
  `limitations` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_animal_id` (`animal_id`),
  CONSTRAINT `animal_medical_events_ibfk_1` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animal_medical_events`
--

LOCK TABLES `animal_medical_events` WRITE;
/*!40000 ALTER TABLE `animal_medical_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `animal_medical_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `animal_shares`
--

DROP TABLE IF EXISTS `animal_shares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animal_shares` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `animal_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `share_platform` varchar(50) DEFAULT NULL,
  `shared_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_address` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `idx_animal_id` (`animal_id`),
  CONSTRAINT `animal_shares_ibfk_1` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`id`) ON DELETE CASCADE,
  CONSTRAINT `animal_shares_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animal_shares`
--

LOCK TABLES `animal_shares` WRITE;
/*!40000 ALTER TABLE `animal_shares` DISABLE KEYS */;
/*!40000 ALTER TABLE `animal_shares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `animal_statuses`
--

DROP TABLE IF EXISTS `animal_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animal_statuses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animal_statuses`
--

LOCK TABLES `animal_statuses` WRITE;
/*!40000 ALTER TABLE `animal_statuses` DISABLE KEYS */;
INSERT INTO `animal_statuses` VALUES (1,'Available'),(2,'Adopted');
/*!40000 ALTER TABLE `animal_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `animals`
--

DROP TABLE IF EXISTS `animals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animals` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `species_id` int NOT NULL,
  `breed` varchar(100) DEFAULT NULL,
  `gender_id` int NOT NULL,
  `age_months` int DEFAULT NULL,
  `size_id` int DEFAULT NULL,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  `status_id` int NOT NULL,
  `shelter_id` bigint NOT NULL,
  `approved_by_user_id` bigint DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `rejection_reason` text,
  `view_count` int DEFAULT '0',
  `share_count` int DEFAULT '0',
  `is_neutered` tinyint(1) DEFAULT '0',
  `is_house_trained` tinyint(1) DEFAULT '0',
  `vaccination_status` varchar(50) DEFAULT 'Unknown',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `species_id` (`species_id`),
  KEY `gender_id` (`gender_id`),
  KEY `size_id` (`size_id`),
  KEY `approved_by_user_id` (`approved_by_user_id`),
  KEY `idx_status_id` (`status_id`),
  KEY `idx_shelter_id` (`shelter_id`),
  KEY `idx_is_neutered` (`is_neutered`),
  CONSTRAINT `animals_ibfk_1` FOREIGN KEY (`species_id`) REFERENCES `species` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `animals_ibfk_2` FOREIGN KEY (`gender_id`) REFERENCES `gender_types` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `animals_ibfk_3` FOREIGN KEY (`size_id`) REFERENCES `sizes` (`id`) ON DELETE SET NULL,
  CONSTRAINT `animals_ibfk_4` FOREIGN KEY (`status_id`) REFERENCES `animal_statuses` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `animals_ibfk_5` FOREIGN KEY (`shelter_id`) REFERENCES `shelters` (`id`) ON DELETE CASCADE,
  CONSTRAINT `animals_ibfk_6` FOREIGN KEY (`approved_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animals`
--

LOCK TABLES `animals` WRITE;
/*!40000 ALTER TABLE `animals` DISABLE KEYS */;
/*!40000 ALTER TABLE `animals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment_statuses`
--

DROP TABLE IF EXISTS `comment_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment_statuses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment_statuses`
--

LOCK TABLES `comment_statuses` WRITE;
/*!40000 ALTER TABLE `comment_statuses` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gender_types`
--

DROP TABLE IF EXISTS `gender_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gender_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gender_types`
--

LOCK TABLES `gender_types` WRITE;
/*!40000 ALTER TABLE `gender_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `gender_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `moderation_queue`
--

DROP TABLE IF EXISTS `moderation_queue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `moderation_queue` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `item_type` varchar(50) NOT NULL,
  `item_id` bigint NOT NULL,
  `submitted_by_id` bigint NOT NULL,
  `status` varchar(50) NOT NULL,
  `assigned_user_id` bigint DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL,
  `action_taken` varchar(100) DEFAULT NULL,
  `admin_notes` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `submitted_by_id` (`submitted_by_id`),
  KEY `assigned_user_id` (`assigned_user_id`),
  KEY `idx_item_type_id` (`item_type`,`item_id`),
  CONSTRAINT `moderation_queue_ibfk_1` FOREIGN KEY (`submitted_by_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `moderation_queue_ibfk_2` FOREIGN KEY (`assigned_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `moderation_queue`
--

LOCK TABLES `moderation_queue` WRITE;
/*!40000 ALTER TABLE `moderation_queue` DISABLE KEYS */;
/*!40000 ALTER TABLE `moderation_queue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `request_statuses`
--

DROP TABLE IF EXISTS `request_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `request_statuses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `request_statuses`
--

LOCK TABLES `request_statuses` WRITE;
/*!40000 ALTER TABLE `request_statuses` DISABLE KEYS */;
/*!40000 ALTER TABLE `request_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_privileges`
--

DROP TABLE IF EXISTS `role_privileges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_privileges` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `can_post_animals` tinyint(1) DEFAULT '0',
  `can_submit_adoption_requests` tinyint(1) DEFAULT '0',
  `can_moderate_comments` tinyint(1) DEFAULT '0',
  `can_approve_animals` tinyint(1) DEFAULT '0',
  `can_view_reports` tinyint(1) DEFAULT '0',
  `can_comment` tinyint(1) DEFAULT '0',
  `can_share_animals` tinyint(1) DEFAULT '0',
  `can_view_public_listings` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_id` (`role_id`),
  CONSTRAINT `role_privileges_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_privileges`
--

LOCK TABLES `role_privileges` WRITE;
/*!40000 ALTER TABLE `role_privileges` DISABLE KEYS */;
INSERT INTO `role_privileges` VALUES (1,1,1,1,1,1,1,1,1,1),(2,2,1,1,0,0,0,1,1,1),(3,3,0,1,0,0,0,1,1,1),(4,4,0,0,0,0,0,0,0,1);
/*!40000 ALTER TABLE `role_privileges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin','System administrator with full access'),(2,'shelter','Shelter staff who can post and manage animals'),(3,'user','Registered adopter or foster user'),(4,'guest','Unauthenticated visitor');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shelters`
--

DROP TABLE IF EXISTS `shelters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shelters` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `address` text,
  `is_verified` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shelters`
--

LOCK TABLES `shelters` WRITE;
/*!40000 ALTER TABLE `shelters` DISABLE KEYS */;
/*!40000 ALTER TABLE `shelters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sizes`
--

DROP TABLE IF EXISTS `sizes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sizes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sizes`
--

LOCK TABLES `sizes` WRITE;
/*!40000 ALTER TABLE `sizes` DISABLE KEYS */;
/*!40000 ALTER TABLE `sizes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `species`
--

DROP TABLE IF EXISTS `species`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `species` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `species`
--

LOCK TABLES `species` WRITE;
/*!40000 ALTER TABLE `species` DISABLE KEYS */;
INSERT INTO `species` VALUES (1,'Dog'),(2,'Cat');
/*!40000 ALTER TABLE `species` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `role_id` int NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-16 12:35:35
