-- Update articles with real thumbnail images
UPDATE articles SET thumbnail = '/images/thumbnails/programming-guide.jpg' 
WHERE title = 'Panduan Lengkap Belajar Programming';

UPDATE articles SET thumbnail = '/images/thumbnails/productivity-tips.jpg' 
WHERE title = 'Tips Produktivitas untuk Developer';

UPDATE articles SET thumbnail = '/images/thumbnails/tech-trends-2024.jpg' 
WHERE title = 'Tren Teknologi 2024';

UPDATE articles SET thumbnail = '/images/thumbnails/web-development.jpg' 
WHERE title = 'Dasar-dasar Web Development';

UPDATE articles SET thumbnail = '/images/thumbnails/digital-marketing.jpg' 
WHERE title = 'Strategi Digital Marketing Modern';

-- Update videos with real thumbnail images
UPDATE videos SET thumbnail = '/images/thumbnails/react-tutorial.jpg' 
WHERE title = 'Tutorial React.js untuk Pemula';

UPDATE videos SET thumbnail = '/images/thumbnails/nodejs-api.jpg' 
WHERE title = 'Membangun API dengan Node.js';

UPDATE videos SET thumbnail = '/images/thumbnails/figma-design.jpg' 
WHERE title = 'Design System dengan Figma';

UPDATE videos SET thumbnail = '/images/thumbnails/postgresql-db.jpg' 
WHERE title = 'Pengenalan Database PostgreSQL';

UPDATE videos SET thumbnail = '/images/thumbnails/javascript-advanced.jpg' 
WHERE title = 'Advanced JavaScript Concepts';
