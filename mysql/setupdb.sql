SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `InstituteSchema` DEFAULT CHARACTER SET utf8 ;
USE `InstituteSchema` ;

-- -----------------------------------------------------
-- Table `InstituteSchema`.`teachers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `InstituteSchema`.`teachers` ;

CREATE  TABLE IF NOT EXISTS `InstituteSchema`.`teachers` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `firstname` VARCHAR(45) NULL ,
  `lastname` VARCHAR(45) NULL ,
  `email` VARCHAR(45) NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `InstituteSchema`.`class`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `InstituteSchema`.`class` ;

CREATE  TABLE IF NOT EXISTS `InstituteSchema`.`class` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(45) NOT NULL ,
  `semester` VARCHAR(45) NOT NULL ,
  `startdate` DATE NOT NULL ,
  `enddate` DATE NOT NULL ,
  `day` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `InstituteSchema`.`students`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `InstituteSchema`.`students` ;

CREATE  TABLE IF NOT EXISTS `InstituteSchema`.`students` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `firstname` VARCHAR(45) NULL ,
  `lastname` VARCHAR(45) NULL ,
  `email` VARCHAR(45) NULL ,
  `phone` VARCHAR(45) NULL ,
  `password` VARCHAR(45) NULL ,
  `class_id` INT UNSIGNED NULL ,
  `accesslvl` INT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_students_class1_idx` (`class_id` ASC) ,
  CONSTRAINT `fk_students_class1`
    FOREIGN KEY (`class_id` )
    REFERENCES `InstituteSchema`.`class` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `InstituteSchema`.`studyCard`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `InstituteSchema`.`studyCard` ;

CREATE  TABLE IF NOT EXISTS `InstituteSchema`.`studyCard` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `frequency` INT NULL ,
  `quality` INT NULL ,
  `assignedBlock` TINYINT(1) NULL ,
  `notes` VARCHAR(10000) NULL ,
  `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `weekNum` INT NOT NULL ,
  `students_id` INT UNSIGNED NOT NULL ,
  `class_id` INT UNSIGNED NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_studyCard_students1_idx` (`students_id` ASC) ,
  INDEX `fk_studyCard_class1_idx` (`class_id` ASC) ,
  CONSTRAINT `fk_studyCard_students1`
    FOREIGN KEY (`students_id` )
    REFERENCES `InstituteSchema`.`students` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_studyCard_class1`
    FOREIGN KEY (`class_id` )
    REFERENCES `InstituteSchema`.`class` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
PACK_KEYS = Default;


-- -----------------------------------------------------
-- Table `InstituteSchema`.`class_has_teachers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `InstituteSchema`.`class_has_teachers` ;

CREATE  TABLE IF NOT EXISTS `InstituteSchema`.`class_has_teachers` (
  `class_id` INT UNSIGNED NOT NULL ,
  `teachers_id` INT UNSIGNED NOT NULL ,
  PRIMARY KEY (`class_id`, `teachers_id`) ,
  INDEX `fk_class_has_teachers_teachers1_idx` (`teachers_id` ASC) ,
  INDEX `fk_class_has_teachers_class1_idx` (`class_id` ASC) ,
  CONSTRAINT `fk_class_has_teachers_class1`
    FOREIGN KEY (`class_id` )
    REFERENCES `InstituteSchema`.`class` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_class_has_teachers_teachers1`
    FOREIGN KEY (`teachers_id` )
    REFERENCES `InstituteSchema`.`teachers` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `InstituteSchema` ;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
