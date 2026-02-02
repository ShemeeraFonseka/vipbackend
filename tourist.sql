-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 08, 2025 at 10:51 AM
-- Server version: 8.0.31
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tourist`
--

-- --------------------------------------------------------

--
-- Table structure for table `about`
--

DROP TABLE IF EXISTS `about`;
CREATE TABLE IF NOT EXISTS `about` (
  `aboutId` int NOT NULL AUTO_INCREMENT,
  `para1` text NOT NULL,
  `para2` text NOT NULL,
  `line1` text NOT NULL,
  `line2` text NOT NULL,
  `line3` text NOT NULL,
  `line4` text NOT NULL,
  `line5` text NOT NULL,
  `line6` text NOT NULL,
  PRIMARY KEY (`aboutId`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `about`
--

INSERT INTO `about` (`aboutId`, `para1`, `para2`, `line1`, `line2`, `line3`, `line4`, `line5`, `line6`) VALUES
(1, 'Tempor elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit.', 'Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet', 'First Class Flights', 'Handpicked Hotels', '5 Star Accommodations', 'Latest Model Vehicles', '150 Premium City Tours', '24/7 Service');

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
CREATE TABLE IF NOT EXISTS `booking` (
  `bookingID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `bookingdatetime` datetime NOT NULL,
  `destination` varchar(100) NOT NULL,
  `request` text NOT NULL,
  `datetime` datetime NOT NULL,
  `status` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`bookingID`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`bookingID`, `name`, `email`, `bookingdatetime`, `destination`, `request`, `datetime`, `status`) VALUES
(2, 'Gihan', 'shemeerafonseka@gmail.com', '2025-09-11 13:30:00', 'Yala', 'jjj', '2025-09-26 06:00:56', 'confirmed'),
(3, 'test', 'shemeerafonseka@gmail.com', '2025-09-18 14:46:00', 'Galle', 'test', '2025-09-26 06:16:31', 'confirmed');

-- --------------------------------------------------------

--
-- Table structure for table `bookingsteps`
--

DROP TABLE IF EXISTS `bookingsteps`;
CREATE TABLE IF NOT EXISTS `bookingsteps` (
  `stepId` int NOT NULL AUTO_INCREMENT,
  `topic` varchar(50) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`stepId`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `bookingsteps`
--

INSERT INTO `bookingsteps` (`stepId`, `topic`, `description`) VALUES
(1, 'Choose A Destination', 'Tempor erat elitr rebum clita dolor diam ipsum sit diam amet diam eos erat ipsum et lorem et sit sed stet lorem sit'),
(2, 'Pay Online', 'Tempor erat elitr rebum clita dolor diam ipsum sit diam amet diam eos erat ipsum et lorem et sit sed stet lorem sit'),
(3, 'Begin Today', 'Tempor erat elitr rebum clita dolor diam ipsum sit diam amet diam eos erat ipsum et lorem et sit sed stet lorem sit');

-- --------------------------------------------------------

--
-- Table structure for table `contact_info`
--

DROP TABLE IF EXISTS `contact_info`;
CREATE TABLE IF NOT EXISTS `contact_info` (
  `infoId` int NOT NULL AUTO_INCREMENT,
  `office` varchar(255) NOT NULL,
  `mobile` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mapUrl` text NOT NULL,
  `description` text,
  `datetime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`infoId`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `contact_info`
--

INSERT INTO `contact_info` (`infoId`, `office`, `mobile`, `email`, `mapUrl`, `description`, `datetime`) VALUES
(2, 'Colombo, Sri Lanka', '+012 345 67890', 'tourist@travel.com', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8984642150344!2d79.8662366758861!3d6.902744718638233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2597c71921dab%3A0x8fe1cd648229bc6e!2sArcade%20Independence%20Square!5e0!3m2!1sen!2slk!4v1759167210221!5m2!1sen!2slk\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade', 'Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos', '2025-09-29 17:34:40');

-- --------------------------------------------------------

--
-- Table structure for table `guides`
--

DROP TABLE IF EXISTS `guides`;
CREATE TABLE IF NOT EXISTS `guides` (
  `guideID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `designation` varchar(100) NOT NULL,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`guideID`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `guides`
--

INSERT INTO `guides` (`guideID`, `name`, `designation`, `image`) VALUES
(2, 'Nadeesha Fernando', 'Eco-Tourism & Conservation Guide', '1758884581151.jpg'),
(3, 'Sunil Jayawardena', 'National Park Ranger Guide', '1758884609565.jpg'),
(4, 'Kavindu Abeysekara', 'Heritage & History Guide', '1758884639301.jpg'),
(5, 'Shenali Wijesinghe', 'Wildlife & Birdwatching Specialist', '1758884682715.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

DROP TABLE IF EXISTS `packages`;
CREATE TABLE IF NOT EXISTS `packages` (
  `packageID` int NOT NULL AUTO_INCREMENT,
  `place` varchar(100) DEFAULT NULL,
  `days` int DEFAULT NULL,
  `persons` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `stars` int DEFAULT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`packageID`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `packages`
--

INSERT INTO `packages` (`packageID`, `place`, `days`, `persons`, `price`, `stars`, `description`, `image`) VALUES
(4, 'Yala', 3, 3, '35000.00', 5, 'Yala is most known for the second largest national park in Sri Lanka. Yala National Park is a lush forest of greenery and wildlife interspersed with ruins from ancient civilisations to give you a truly unique experience of human history and nature, to create a one of a kind experience. Embark on a scenic safari to spot the wildlife endemic in the area and discover the ruins of ancient civilisations. The wild side of Sri Lanka awaits.', '1758717583967.jpg'),
(5, 'Sigiriya', 5, 6, '17000.00', 4, 'Sigiriya known as Lion Rock pronounced see-gi-ri-yə. The ancient rock fortress is located in the Central Province of Sri Lanka, in the town of Dambulla. A site of historical and archaeological significance that is dominated by a massive column of rock approximately 180 m or 590 ft in high. Moreover, Dambulla is directly accessible through private transport, or by train and bus from Colombo.', '1758735186331.jpg'),
(3, 'Galle', 5, 5, '23000.00', 5, 'Built by the Portuguese and later fortified by the Dutch and British, the Galle Fort is a UNESCO World Heritage Site offering travellers a plethora of things to explore from a bygone era. Visit historic monuments as you stroll along the ancient ramparts of the fort. This old, culturally harmonious town resembles a quaint European village with cobblestoned streets lined with cafes, bistros, restaurants, boutique retail outlets and more.', '1758717457081.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `serviceId` int NOT NULL AUTO_INCREMENT,
  `topic` varchar(50) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`serviceId`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`serviceId`, `topic`, `description`) VALUES
(1, 'WorldWide Tours', 'Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam'),
(2, 'Hotel Reservation', 'Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam'),
(3, 'Travel Guides', 'Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam'),
(4, 'Travel Management', 'Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','editor','agent','user') DEFAULT 'user',
  `status` enum('active','inactive') DEFAULT 'active',
  `lastLogin` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `name`, `email`, `password`, `role`, `status`, `lastLogin`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin User', 'admin@yalasafari.com', '1234', 'admin', 'active', '2023-06-10 14:30:00', '2025-09-30 14:16:00', '2025-10-08 15:44:18'),
(2, 'Content Manager', 'content@yalasafari.com', '$2b$10$examplehashedpassword2', 'editor', 'active', '2023-06-09 10:15:00', '2025-09-30 14:16:00', '2025-09-30 14:16:00'),
(3, 'Booking Agent', 'bookings@yalasafari.com', '$2b$10$examplehashedpassword3', 'agent', 'active', '2023-06-08 16:45:00', '2025-09-30 14:16:00', '2025-09-30 14:16:00'),
(6, 'Admin', 'admim@gmail.com', '$2b$10$Fcnx.wrtGb3ZYZCU1C494eGa8wqthhpBEcGb0vHmtADOjBOQQH4w.', 'admin', 'active', '2025-10-08 16:05:27', '2025-10-08 16:05:09', '2025-10-08 16:15:19');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
