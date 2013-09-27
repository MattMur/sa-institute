USE InstituteSchema;
/* Teachers Teaching Which Classes */
SELECT 
	t.firstname,
	t.lastname,
	c.name,
	c.semester,
	c.startdate,
	c.enddate
FROM 
	teachers t
JOIN class_has_teachers cht ON t.id = cht.teachers_id 
JOIN class c ON c.id = cht.class_id;

/* Class roster */
SELECT
	c.name,
	t.firstname,
	t.lastname,
	c.semester,
	c.startdate,
	c.enddate,
	s.firstname,
	s.lastname
	
FROM
	students s

LEFT JOIN class c on s.class_id = c.id
LEFT JOIN (class_has_teachers cht, teachers t) ON (cht.teachers_id = t.id AND c.id = cht.class_id);

