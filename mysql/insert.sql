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
	('Book of Mormon', 2, 'SA UTSA', '19:00:00', '2014-5-28', '2013-12-18'),
	('Old Testament', 2, 'SA UTSA', '19:00:00', '2014-5-28', '2013-12-18'),
	('New Testament', 2, 'SA UTSA', '19:00:00', '2014-5-28', '2013-12-18'),
	('Mission Prep', 2, 'SA UTSA', '19:00:00', '2014-5-28', '2013-12-18'),
	('Book of Mormon', 3, 'Austin', '19:00:00', '2014-5-28', '2013-12-18'),
	('Old Testament', 3, 'Austin', '19:00:00', '2014-5-28', '2013-12-18'),
	('New Testament', 3, 'Austin', '19:00:00', '2014-5-28', '2013-12-18'),
	('Mission Prep', 3, 'Austin', '19:00:00', '2014-5-28', '2013-12-18'),
	('Book of Mormon', 2, 'SA UTSA', '19:00:00', '2014-5-15', '2014-5-7'),
	('Book of Mormon', 2, 'SA UTSA', '19:00:00', '2014-5-18', '2013-5-9');

INSERT INTO user 
	(first_name, last_name, email, phone, password, access_level) VALUES
	('Matthew’, 'Murray', 'mattm.trinsic@gmail.com', '210-555-5555', ‘password’, 2),
	('Spencer', 'Carlson', 'spencercarlson@gmail.com', '210-555-5555', 'password', 2),
	('Teacher', '', 'teacher@gmail.com', '210-555-5555', 'password', 2),
	('Teacher', 'one', 'teacherone@gmail.com', '210-555-5555', 'password', 2),
	(‘Kari’, ‘Mac’, 'student@gmail.com', '210-555-5555', 'password', 1),
	('David’, ‘Blain’, 'studentone@gmail.com', '210-555-5555', 'password', 1),
	(‘Cory’, ‘Rochester’, 'studenttwo@gmail.com', '210-555-5555', 'password', 1),
	(‘Paul’, ‘DePase’, 'studentthree@gmail.com', '210-555-5555', 'password', 1),
	(‘Mandi’, ’Straight’, 'studentfour@gmail.com', '210-555-5555', 'password', 1),
	(‘Rick’, ‘James’, 'studentfive@gmail.com', '210-555-5555', 'password', 1),
	(‘David’, ‘Nash’, 'studentsix@gmail.com', '210-555-5555', 'password', 1),
	(‘Steven’, ‘Lynch’, 'studentseven@gmail.com', '210-555-5555', 'password', 1),
	(‘Blair’, ‘Waldorf’, 'studenteight@gmail.com', '210-555-5555', 'password', 1),
	(‘Calvin’, ’Phillips’, 'studentnine@gmail.com', '210-555-5555', 'password', 1),
	(‘Tanner’, ’Micheals’, 'studentten@gmail.com', '210-555-5555', 'password', 1),
	(‘James’, ‘Blake’, 'studenteleven@gmail.com', '210-555-5555', 'password', 1),
	(‘Charles’, ‘Bass’, 'studenttwelve@gmail.com', '210-555-5555', 'password', 1);

	
INSERT INTO user_enrolled_in_class
	(class_id, user_id, enrolled_date) VALUES
	(1,3, '2014-4-28'),
	(2,4, '2014-4-28'),
	(3,5, '2014-4-28'),
	(4,6, '2014-4-28'),
	(5,7, '2014-4-28'),
	(6,8, '2014-4-28'),
	(7,9, '2014-4-28'),
	(8,10, '2014-4-28'),
	(9,11, '2014-4-28'),
	(10,12, '2014-4-28'),
	(1,13, '2014-4-28'),
	(2,14, '2014-4-28'),
	(1,1, '2014-4-28'),
	(1,2, '2014-4-28'),
	(2,1, '2014-4-28'),
	(2,9, '2014-4-28');

INSERT INTO user_teaches_class
	(class_id, user_id, enrolled_date) VALUES
	(1,15, '2014-4-28'),
	(2,16, '2014-4-28'),
	(6,16, '2014-4-28'),
	(8,16, '2014-4-28');

INSERT INTO study_card 
	(frequency, prepare, seek, do, teach, block, notes, week_number, user_id, class_id, created_date) VALUES
	(1, TRUE, TRUE, TRUE, TRUE, TRUE, 'First study card', 1, 3, 1, '2014-5-28'),
	(2, TRUE, FALSE, TRUE, TRUE, TRUE, 'Second study card', 2, 4, 2, '2014-6-4’),
	(3, TRUE, TRUE, FALSE, TRUE, TRUE, 'Third study card', 3, 5, 3, '2014-6-11'),
	(4, TRUE, TRUE, TRUE, FALSE, TRUE, 'Fourth study card', 4, 6, 4, '2014–5-18'),
	(5, TRUE, TRUE, TRUE, TRUE, FALSE, 'Fifth study card', 5, 7, 5, '2014-5-25'),
	(6, FALSE, FALSE, TRUE, TRUE, TRUE, 'Sixth study card', 6, 8, 6, '2014-6-2’),
	(7, FALSE, TRUE, FALSE, TRUE, TRUE, 'Seventh study card', 7, 9, 7, '2014-6-9’),
	(1, FALSE, FALSE, FALSE, FALSE, FALSE, 'Eighth study card', 8, 10, 8, '2014-6-16'),
	(2, FALSE, FALSE, FALSE, FALSE, FALSE, 'Ninth study card', 9, 7, 9, '2014-5-18'),
	(3, FALSE, FALSE, FALSE, FALSE, FALSE, 'Tenth study card', 10, 12, 10, '2014-5-18'),
	(4, FALSE, FALSE, FALSE, FALSE, FALSE, 'Eleventh study card', 11, 13, 1, '2014-6-6’),
	(5, FALSE, FALSE, FALSE, FALSE, FALSE, 'Twelfth study card', 12, 14, 2, '2014-5-30'),
	(6, FALSE, FALSE, FALSE, FALSE, FALSE, 'Thirteenth study card', 13, 2, 1, '2014-6-7’),
	(7, FALSE, FALSE, FALSE, FALSE, FALSE, 'Fourteenth study card', 14, 9, 2, '2014-6-14');

SET FOREIGN_KEY_CHECKS = 1;




