DROP SCHEMA IF EXISTS art;

CREATE DATABASE art;

USE art;

CREATE TABLE `painting` (
  `ID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `artist` VARCHAR(50) NOT NULL,
  `movement` VARCHAR(50) NOT NULL,
  `museumName` VARCHAR(100) NOT NULL,
  `museumLocation` VARCHAR(50) NOT NULL,
  `yearCreated` CHAR(4) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC))ENGINE=InnoDB;

INSERT INTO `art`.`painting` (`name`, `artist`, `movement`, `museumName`, `museumLocation`, `yearCreated`) VALUES ('The Scream', 'Edvard Munch', 'expressionism', 'National Gallery', 'Oslo', '1893');
INSERT INTO `art`.`painting` (`name`, `artist`, `movement`, `museumName`, `museumLocation`, `yearCreated`) VALUES ('Girl with a Pearl Earring', 'Johannes Vermeer', 'baroque', 'Mauritshuis', 'The Hague', '1665');
INSERT INTO `art`.`painting` (`name`, `artist`, `movement`, `museumName`, `museumLocation`, `yearCreated`) VALUES ('Guernica', 'Pablo Picasso', 'surrealism', 'Museo Nacional Centro de Arte Reina Sofía', 'Madrid', '1937');
INSERT INTO `art`.`painting` (`name`, `artist`, `movement`, `museumName`, `museumLocation`, `yearCreated`) VALUES ('The Last Supper', 'Leonardo da Vinci', 'renaissance', 'Santa Maria delle Grazie', 'Milan', '1495');
INSERT INTO `art`.`painting` (`name`, `artist`, `movement`, `museumName`, `museumLocation`, `yearCreated`) VALUES ('The Mona Lisa', 'Leonardo da Vinci', 'renaissance', 'The Louvre', 'Paris', '1503');
INSERT INTO `art`.`painting` (`name`, `artist`, `movement`, `museumName`, `museumLocation`, `yearCreated`) VALUES ('The Starry Night', 'Vincent van Gogh', 'post-impressionism', 'Museum of Modern Art', 'New York', '1889');


CREATE VIEW `groupbycity` AS

SELECT count(ID) as locationCount, museumLocation
FROM painting
GROUP BY museumLocation;

CREATE VIEW `groupbymovement` AS

SELECT count(ID) as movementCount, movement
FROM painting
GROUP BY movement;
