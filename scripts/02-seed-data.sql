-- Seed sample data for ContentHub

-- Insert sample users
INSERT INTO users (id, email, name, membership_type) VALUES
('user1', 'admin@contenthub.id', 'Admin ContentHub', 'paket_c'),
('user2', 'user@example.com', 'User Demo', 'paket_a')
ON CONFLICT (id) DO NOTHING;

-- Insert sample articles
INSERT INTO articles (title, content, thumbnail, author_id, is_premium) VALUES
('Panduan Lengkap Belajar Programming', 'Artikel ini membahas langkah-langkah dasar untuk memulai belajar programming dari nol. Mulai dari memilih bahasa pemrograman yang tepat hingga tips-tips praktis untuk menjadi programmer yang handal.', '/placeholder.svg?height=200&width=300', 'user1', false),
('Tips Produktivitas untuk Developer', 'Dalam artikel ini, kita akan membahas berbagai tips dan trik untuk meningkatkan produktivitas sebagai developer. Mulai dari tools yang tepat hingga manajemen waktu yang efektif.', '/placeholder.svg?height=200&width=300', 'user1', true),
('Tren Teknologi 2024', 'Artikel premium yang membahas tren teknologi terbaru di tahun 2024. Dari AI hingga blockchain, simak prediksi dan analisis mendalam tentang masa depan teknologi.', '/placeholder.svg?height=200&width=300', 'user1', true),
('Dasar-dasar Web Development', 'Pelajari fundamental web development mulai dari HTML, CSS, hingga JavaScript. Artikel ini cocok untuk pemula yang ingin memulai karir di bidang web development.', '/placeholder.svg?height=200&width=300', 'user1', false),
('Strategi Digital Marketing Modern', 'Panduan komprehensif tentang strategi digital marketing yang efektif di era modern. Pelajari cara memanfaatkan social media, SEO, dan content marketing.', '/placeholder.svg?height=200&width=300', 'user1', true);

-- Insert sample videos
INSERT INTO videos (title, url, description, thumbnail, author_id, is_premium) VALUES
('Tutorial React.js untuk Pemula', 'https://example.com/video1', 'Video tutorial lengkap belajar React.js dari dasar. Cocok untuk pemula yang ingin memahami konsep component, state, dan props dalam React.', '/placeholder.svg?height=200&width=300', 'user1', false),
('Membangun API dengan Node.js', 'https://example.com/video2', 'Video premium yang mengajarkan cara membangun REST API menggunakan Node.js dan Express. Termasuk authentication dan database integration.', '/placeholder.svg?height=200&width=300', 'user1', true),
('Design System dengan Figma', 'https://example.com/video3', 'Pelajari cara membuat design system yang konsisten menggunakan Figma. Video ini membahas component library, color palette, dan typography.', '/placeholder.svg?height=200&width=300', 'user1', true),
('Pengenalan Database PostgreSQL', 'https://example.com/video4', 'Video tutorial dasar PostgreSQL untuk pemula. Mulai dari instalasi, query dasar, hingga relational database concepts.', '/placeholder.svg?height=200&width=300', 'user1', false),
('Advanced JavaScript Concepts', 'https://example.com/video5', 'Video premium yang membahas konsep JavaScript tingkat lanjut seperti closures, promises, async/await, dan modern ES6+ features.', '/placeholder.svg?height=200&width=300', 'user1', true);
