/* GET THE LAST CLASS THAT THE STUDENT HAS ENROLLED IN */ 
SELECT * FROM class
	LEFT JOIN user_enrolled_in_class ON class.id = user_enrolled_in_class.class_id
	LEFT JOIN user ON user.id = user_enrolled_in_class.user_id
	WHERE user.id = ? 
	ORDER BY user_enrolled_in_class.enrolled_date DESC
	LIMIT 1;

/* GET ALL THE CLASSES A USER IS ENROLLED IN */
SELECT * FROM class
	LEFT JOIN user_enrolled_in_class ON class.id = user_enrolled_in_class.class_id
	LEFT JOIN user ON user.id = user_enrolled_in_class.user_id
	WHERE user.id = ?;

/* GET ALL THE USERS IN A GIVEN CLASS */
SELECT * FROM user 
     LEFT JOIN user_enrolled_in_class ON user.id = user_enrolled_in_class.user_id 
     LEFT JOIN class ON class.id = user_enrolled_in_class.class_id 
     WHERE class.id = ?

/* GET ALL THE CLASSES THAT A TEACHER IS TEACHING */
SELECT * FROM class
	LEFT JOIN user_teaches_class ON class.id = user_teaches_class.class_id
	LEFT JOIN user ON user.id = user_teaches_class.user_id
	WHERE user.id = ?;

/* GET ALL THE USERS IN A CLASS TAUGHT BY AN INSTRUCTOR */
