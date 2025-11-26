INSERT INTO `shelters` (`name`, `email`, `password_hash`,`role_id`, `phone`, `city`, `address`, `is_verified`, `is_active`) VALUES
('חברים של חיות', 'friends@animals.co.il', '$2b$10$XJv4HPu/xzDU3AiAluOQcexIQ6cAM/nvG1ImLIJryUXQZeeLf.1JK',2, '0545678901', 'תל אביב', 'רחוב הירקון 123', 1, 1),
('מחסה חיפה', 'shelter@haifa.org.il', '$2b$10$XJv4HPu/xzDU3AiAluOQcexIQ6cAM/nvG1ImLIJryUXQZeeLf.1JK',2, '0546789012', 'חיפה', 'דרך הים 45', 1, 1),
('לב של כלב', 'lev@kelev.org.il', '$2b$10$XJv4HPu/xzDU3AiAluOQcexIQ6cAM/nvG1ImLIJryUXQZeeLf.1JK',2, '0547890123', 'ירושלים', 'עמק רפאים 78', 1, 1);

INSERT INTO `animals` (`name`, `species_id`, `breed_id`, `gender_id`, `size_id`, `shelter_id`, `age`, `description`, `image_url`, `status_id`, `created_by_user_id`, `view_count`, `share_count`, `is_neutered`, `is_house_trained`, `vaccination_status`) VALUES
-- Dogs
('מקס', 1, 8, 1, 4, 1, 3, 'רועה גרמני אנרגטי ואוהב לשחק. מתאים למשפחות עם ילדים. זקוק להרבה פעילות וחצר גדולה.', 'http://localhost:8080/uploads/animals/max.jpg', 1, 1, 45, 12, 1, 1, 'מחוסן במלואו'),
('לונה', 1, 2, 2, 2, 2, 2, 'פודל חמודה ומפנקת. מושלמת לדירה. נעימה וידידותית מאוד.', 'http://localhost:8080/uploads/animals/luna.jpg', 1, 1, 67, 8, 1, 1, 'מחוסן במלואו'),
('רוקי', 1, 9, 1, 3, 3, 5, 'בולדוג חברותי ורגוע. אוהב להתרפס וטוב עם ילדים. לא דורש הרבה פעילות.', 'http://localhost:8080/uploads/animals/rocky.jpg', 1, 1, 23, 5, 1, 0, 'מחוסן חלקית'),
('בלה', 1, 1, 2, 3, 1, 4, 'גולדן רטריבר מתוקה ואוהבת. נהדרת למשפחות, סובלנית וחכמה.', 'http://localhost:8080/uploads/animals/bella.jpg', 1, 1, 89, 15, 1, 1, 'מחוסן במלואו'),
('צ\'רלי', 1, 10, 1, 1, 2, 1, 'צ\'יוואווה קטן וחמוד. מושלם לדירה קטנה. קצת ביישן בהתחלה אבל מתחמם מהר.', 'http://localhost:8080/uploads/animals/charlie.jpg', 1, 1, 34, 7, 0, 1, 'מחוסן במלואו'),
('דיוק', 1, 11, 1, 5, 3, 6, 'האסקי יפיפה עם עיניים כחולות. זקוק לבעלים מנוסים והרבה פעילות.', 'http://localhost:8080/uploads/animals/duke.jpg', 1, 1, 156, 28, 1, 0, 'מחוסן במלואו'),
('דייזי', 1, 3, 2, 2, 1, 3, 'ביגל חמודה ושובבה. אוהבת לרוץ ולחקור. מצוינת למשפחות פעילות.', 'http://localhost:8080/uploads/animals/daisy.jpg', 3, 1, 45, 9, 1, 1, 'מחוסן במלואו'),
('טדי', 1, 13, 1, 2, 2, 7, 'כלב מעורב חמוד ונאמן. מתאים לכל סוג של בית. מאד חברותי.', 'http://localhost:8080/uploads/animals/teddy.jpg', 1, 1, 28, 4, 1, 1, 'מחוסן במלואו'),

-- Cats
('מיקי', 2, 14, 1, 1, 1, 2, 'חתול פרסי יפהפה עם פרווה ארוכה. רגוע ואוהב להתפנק. מתאים למי שיכול לטפל בפרווה.', 'http://localhost:8080/uploads/animals/miki.jpg', 1, 1, 52, 11, 1, 1, 'מחוסן במלואו'),
('סימבה', 2, 13, 1, 2, 2, 1, 'חתול מעורב חמוד ומשחק. טוב עם ילדים ובעלי חיים אחרים.', 'http://localhost:8080/uploads/animals/simba.jpg', 1, 1, 71, 13, 1, 1, 'מחוסן במלואו'),
('נאלה', 2, 15, 2, 1, 3, 4, 'חתולה סיאמית יפה עם עיניים כחולות. דוברת הרבה ואוהבת תשומת לב.', 'http://localhost:8080/uploads/animals/nala.jpg', 1, 1, 38, 6, 1, 1, 'מחוסן במלואו'),
('פלאפי', 2, 16, 2, 3, 1, 3, 'מיין קון גדולה ומרשימה. עדינה וידידותית למרות הגודל. מצוינת למשפחות.', 'http://localhost:8080/uploads/animals/fluffy.jpg', 1, 1, 94, 17, 1, 1, 'מחוסן במלואו'),
('לוקי', 2, 13, 1, 1, 2, 5, 'חתול מעורב שחור ולבן. עצמאי אבל חברותי. מושלם לבית שקט.', 'http://localhost:8080/uploads/animals/loki.jpg', 2, 1, 45, 8, 1, 1, 'מחוסן במלואו'),
('סופי', 2, 14, 2, 1, 3, 2, 'חתולה פרסית רכה ושקטה. אוהבת להתרפס ולשבת בחיק.', 'http://localhost:8080/uploads/animals/sophie.jpg', 1, 1, 63, 10, 1, 1, 'מחוסן במלואו');
