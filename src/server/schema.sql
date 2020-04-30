DROP DATABASE IF EXISTS radioidb;
CREATE DATABASE radioidb;
USE radioidb;

CREATE TABLE `User` (
  `id` varchar(256) NOT NULL,
  `name` varchar(128) DEFAULT NULL,
  `email` varchar(128) DEFAULT NULL,
  `country` varchar(128) DEFAULT NULL,
  `premium` bit DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Stream` (
  `hash` varchar(256) NOT NULL,
  `user_id` varchar(256) DEFAULT NULL,
  `is_active` bit DEFAULT 0,
  `song_id` varchar(256) DEFAULT NULL,
  `timestamp_ms` int(11) DEFAULT 0,
  PRIMARY KEY (`hash`),
  FOREIGN KEY `FK_Stream_User` (`user_id`) REFERENCES `User` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `StreamQueue` (
  `hash` varchar(256) NOT NULL,
  `song_id` varchar(256) DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  PRIMARY KEY (`hash`,`song_id`),
  FOREIGN KEY `FK_StreamQueue_Steam` (`hash`) REFERENCES `Stream` (`hash`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Subscriptions` (
  `stream_hash` varchar(256) NOT NULL,
  `user_id` varchar(256) DEFAULT NULL,
  `ws` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`stream_hash`,`user_id`),
  FOREIGN KEY `FK_Subscriptions_Steam` (`stream_hash`) REFERENCES `Stream` (`hash`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;