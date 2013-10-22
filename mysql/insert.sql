USE institute;
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE allowed_days;
TRUNCATE TABLE class;
TRUNCATE TABLE user;
TRUNCATE TABLE user_enrolled_in_class;
TRUNCATE TABLE user_teaches_class;
TRUNCATE TABLE study_card;


INSERT INTO allowed_days(id, day) VALUES
	(0, 'Monday'), (1, 'Tuesday'), (2, 'Wednesday'),
	(3, 'Thursday'),(4, 'Friday'),(5, 'Saturday');

INSERT INTO class 
	(name, day, location, time, start_date, end_date) VALUES
	('Book of Mormon', 2, 'SA UTSA', '19:00:00', '2013-8-28', '2013-12-18'),
	('Old Testament', 2, 'SA UTSA', '19:00:00', '2013-8-28', '2013-12-18'),
	('New Testament', 2, 'SA UTSA', '19:00:00', '2013-8-28', '2013-12-18'),
	('Mission Prep', 2, 'SA UTSA', '19:00:00', '2013-8-28', '2013-12-18'),
	('Book of Mormon', 3, 'Austin', '19:00:00', '2013-8-28', '2013-12-18'),
	('Old Testament', 3, 'Austin', '19:00:00', '2013-8-28', '2013-12-18'),
	('New Testament', 3, 'Austin', '19:00:00', '2013-8-28', '2013-12-18'),
	('Mission Prep', 3, 'Austin', '19:00:00', '2013-8-28', '2013-12-18'),
	('Book of Mormon', 2, 'SA UTSA', '19:00:00', '2014-1-15', '2014-5-7'),
	('Book of Mormon', 2, 'SA UTSA', '19:00:00', '2012-1-18', '2013-5-9');

INSERT INTO user 
	(first_name, last_name, email, phone, password, access_level) VALUES
	('Matt', 'Murray', 'mattmurray@gmail.com', '210-555-5555', 'password', 2),
	('Spencer', 'Carlson', 'spencercarlson@gmail.com', '210-555-5555', 'password', 2),
	('Teacher', '', 'teacher@gmail.com', '210-555-5555', 'password', 2),
	('Teacher', 'one', 'teacherone@gmail.com', '210-555-5555', 'password', 2),
	('Student', '', 'student@gmail.com', '210-555-5555', 'password', 1),
	('Student', 'one', 'studentone@gmail.com', '210-555-5555', 'password', 1),
	('Student', 'two', 'studenttwo@gmail.com', '210-555-5555', 'password', 1),
	('Student', 'three', 'studentthree@gmail.com', '210-555-5555', 'password', 1),
	('Student', 'four', 'studentfour@gmail.com', '210-555-5555', 'password', 1),
	('Student', 'five', 'studentfive@gmail.com', '210-555-5555', 'password', 1),
	('Student', 'six', 'studentsix@gmail.com', '210-555-5555', 'password', 1),
	('Student', 'seven', 'studentseven@gmail.com', '210-555-5555', 'password', 1),
	('Student', 'eight', 'studenteight@gmail.com', '210-555-5555', 'password', 1),
	('Student', 'nine', 'studentnine@gmail.com', '210-555-5555', 'password', 1),
	('Student', 'ten', 'studentten@gmail.com', '210-555-5555', 'password', 1),
	('Student', 'eleven', 'studenteleven@gmail.com', '210-555-5555', 'password', 1),
	('Student', 'twleve', 'studenttwelve@gmail.com', '210-555-5555', 'password', 1);

	
INSERT INTO user_enrolled_in_class
	(class_id, user_id, enrolled_date) VALUES
	(1,3, '2013-12-18'),
	(2,4, '2013-12-18'),
	(3,5, '2013-12-18'),
	(4,6, '2013-12-18'),
	(5,7, '2013-12-18'),
	(6,8, '2013-12-18'),
	(7,9, '2013-12-18'),
	(8,10, '2013-12-18'),
	(9,11, '2013-12-18'),
	(10,12, '2013-12-18'),
	(1,13, '2013-12-18'),
	(2,14, '2013-12-18'),
	(1,1, '2013-12-18'),
	(1,2, '2013-12-18'),
	(2,1, '2013-12-19'),
	(2,9, '2013-12-18');

INSERT INTO user_teaches_class
	(class_id, user_id, enrolled_date) VALUES
	(1,15, '2013-12-18'),
	(2,16, '2013-12-18'),
	(6,16, '2013-12-18'),
	(8,16, '2013-12-18');

INSERT INTO study_card 
	(frequency, prepare, seek, do, teach, block, notes, week_number, user_id, class_id, created_date) VALUES
	(1, TRUE, TRUE, TRUE, TRUE, TRUE, 'First study card', 1, 3, 1, '2013-8-28'),
	(2, TRUE, FALSE, TRUE, TRUE, TRUE, 'Second study card', 2, 4, 2, '2013-9-4'),
	(3, TRUE, TRUE, FALSE, TRUE, TRUE, 'Third study card', 3, 5, 3, '2013-9-11'),
	(4, TRUE, TRUE, TRUE, FALSE, TRUE, 'Fourth study card', 4, 6, 4, '2013-9-18'),
	(5, TRUE, TRUE, TRUE, TRUE, FALSE, 'Fith study card', 5, 7, 5, '2013-9-25'),
	(6, FALSE, FALSE, TRUE, TRUE, TRUE, 'Sixth study card', 6, 8, 6, '2013-10-2'),
	(7, FALSE, TRUE, FALSE, TRUE, TRUE, 'Seventh study card', 7, 9, 7, '2013-10-9'),
	(1, FALSE, FALSE, FALSE, FALSE, FALSE, 'Eighth study card', 8, 10, 8, '2013-10-16'),
	(2, FALSE, FALSE, FALSE, FALSE, FALSE, 'Nineth study card', 9, 7, 9, '2012-1-18'),
	(3, FALSE, FALSE, FALSE, FALSE, FALSE, 'Tenth study card', 10, 12, 10, '2012-1-18'),
	(4, FALSE, FALSE, FALSE, FALSE, FALSE, 'Eleventh study card', 11, 13, 1, '2013-10-6'),
	(5, FALSE, FALSE, FALSE, FALSE, FALSE, 'Twelveth study card', 12, 14, 2, '2013-10-30'),
	(6, FALSE, FALSE, FALSE, FALSE, FALSE, 'Thirteenth study card', 13, 2, 1, '2013-11-7'),
	(7, FALSE, FALSE, FALSE, FALSE, FALSE, 'Fourteenth study card', 14, 9, 2, '2013-11-14');

SET FOREIGN_KEY_CHECKS = 1;




