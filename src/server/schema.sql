DROP DATABASE IF EXISTS radioidb;
CREATE DATABASE radioidb;
USE radioidb;

CREATE TABLE `User` (
  `id` varchar(256) NOT NULL,
  `name` varchar(128) DEFAULT NULL,
  `email` varchar(128) DEFAULT NULL,
  `country` varchar(128) DEFAULT NULL,
  `premium` TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Radio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hash` varchar(256) NOT NULL,
  `user_id` varchar(256) DEFAULT NULL,
  `name` varchar(35) DEFAULT NULL,
  `is_public` TINYINT(1) DEFAULT 0,
  `song_id` varchar(256) DEFAULT NULL,
  `timestamp_ms` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY `FK_Radio_User` (`user_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `RadioQueue` (
  `radio_id` int(11) NOT NULL,
  `song_id` varchar(256) DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  PRIMARY KEY (`radio_id`,`song_id`),
  FOREIGN KEY `FK_RadioQueue_Steam` (`radio_id`) REFERENCES `Radio` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Subscriptions` (
  `radio_id` int(11) NOT NULL,
  `user_id` varchar(256) DEFAULT NULL,
  `ws` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`radio_id`,`user_id`),
  FOREIGN KEY `FK_Subscriptions_Steam` (`radio_id`) REFERENCES `Radio` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;