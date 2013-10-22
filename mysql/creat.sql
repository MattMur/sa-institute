/* 
* MYSQL CREATE TABLES FOR SA-INSTATUTE APP
*	Naming conventions: 
*		Normal entity tables are singluar, lowercase and underscore delimited (class, user, teacher)
*		Objects in tables are lowercase and underscore delimited 		
*/

/* Run this insert to controll what days are allowed.
* INSERT INTO allowed_days(id, day) VALUES
	(0, 'Monday'), (1, 'Tuesday'), (2, 'Wednesday'),
	(3, 'Thursday'),(4, 'Friday'),(5, 'Saturday');
*/
CREATE TABLE allowed_days (
  id TINYINT UNSIGNED NOT NULL,
  day VARCHAR(15) NOT NULL,
  PRIMARY KEY (id)
) ENGINE = InnoDB;

CREATE TABLE class (
	id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	name VARCHAR(45) NOT NULL,
	day	TINYINT UNSIGNED NOT NULL,
	location VARCHAR(45) NOT NULL,
	time TIME NOT NULL,
	start_date DATE NOT NULL,
	end_date DATE NOT NULL,
	/*  KEYS & CONSTRAINTS */
	PRIMARY KEY (id),
	FOREIGN KEY (day) REFERENCES allowed_days(id)
) ENGINE=INNODB;

CREATE TABLE study_card (
    id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    frequency INT(11) NOT NULL,
    prepare BOOLEAN NOT NULL DEFAULT 0,
    seek BOOLEAN NOT NULL DEFAULT 0,
    do BOOLEAN NOT NULL DEFAULT 0,
    teach BOOLEAN NOT NULL DEFAULT 0,
    block BOOLEAN NOT NULL DEFAULT 0,
    notes VARCHAR(10000) NULL,
    week_number INT(11) NOT NULL,
    user_id INT(10) UNSIGNED NOT NULL,
    class_id INT(10) UNSIGNED NOT NULL,
    /*  KEYS & CONSTRAINTS */
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (class_id) REFERENCES class(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=INNODB;

CREATE TABLE user (
	id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	first_name VARCHAR(45) NOT NULL,
	last_name VARCHAR(45) NOT NULL,
	email VARCHAR(45) NOT NULL,
	phone VARCHAR(45) NOT NULL,
	password VARCHAR(45) NOT NULL,
	access_level INT(11) NOT NULL DEFAULT 1, /* 1 is normal user 2 is admin */
	class_id INT(10) UNSIGNED,
	/*  KEYS & CONSTRAINTS */
	PRIMARY KEY (id),
	FOREIGN KEY (class_id) REFERENCES class(id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=INNODB;


