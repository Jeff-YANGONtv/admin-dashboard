-- JAV BURMA Telegram Mini App - Complete Database Schema
-- Supabase PostgreSQL

-- 1. Customer Chats Table
CREATE TABLE IF NOT EXISTS customer_chats (
    id SERIAL PRIMARY KEY,
    chat_id BIGINT NOT NULL UNIQUE,
    username VARCHAR(255),
    customer_name VARCHAR(255),
    last_message TEXT,
    bot_source VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customer_chats_chat_id ON customer_chats(chat_id);
CREATE INDEX idx_customer_chats_bot_source ON customer_chats(bot_source);

-- 2. Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    chat_id BIGINT NOT NULL,
    sender VARCHAR(50) NOT NULL,
    message_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES customer_chats(chat_id) ON DELETE CASCADE
);

CREATE INDEX idx_chat_messages_chat_id ON chat_messages(chat_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- 3. Ads Management Table (35 channels)
CREATE TABLE IF NOT EXISTS ads_management (
    id SERIAL PRIMARY KEY,
    channel_name VARCHAR(255) NOT NULL,
    telegram_link TEXT,
    logo_url TEXT,
    ads1 VARCHAR(255) DEFAULT '',
    ads1_fees NUMERIC DEFAULT 0,
    ads1_duration VARCHAR(100) DEFAULT '',
    ads1_posts VARCHAR(100) DEFAULT '',
    ads2 VARCHAR(255) DEFAULT '',
    ads2_fees NUMERIC DEFAULT 0,
    ads2_duration VARCHAR(100) DEFAULT '',
    ads2_posts VARCHAR(100) DEFAULT '',
    payment_method VARCHAR(255) DEFAULT '',
    telegram_file_id TEXT,
    media_backup_url TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ads_management_channel_name ON ads_management(channel_name);

-- Insert 35 Channel Seed Data
INSERT INTO ads_management (channel_name, telegram_link, logo_url) VALUES
('JAV BURMA', 'https://t.me/javburma', 'https://i.ibb.co/7Ny2y0wC/IMG-20260201-115744-136.jpg'),
('JAV BURMA (2)', 'https://t.me/javburmatwo', 'https://i.ibb.co/7Ny2y0wC/IMG-20260201-115744-136.jpg'),
('JAV BURMA (3)', 'https://t.me/javburmathree', 'https://i.ibb.co/7Ny2y0wC/IMG-20260201-115744-136.jpg'),
('JAV BURMA CHANNEL', 'https://t.me/JavBurmaChannel', 'https://i.ibb.co/7Ny2y0wC/IMG-20260201-115744-136.jpg'),
('JAV BURMA (5)', 'https://t.me/javburmafive', 'https://i.ibb.co/7Ny2y0wC/IMG-20260201-115744-136.jpg'),
('JAV BURMABOARD', 'https://t.me/javburmaboard', 'https://i.ibb.co/7Ny2y0wC/IMG-20260201-115744-136.jpg'),
('JAV BURMA MILF', 'https://t.me/+gqaoDbKljvM2ZDM9', 'https://i.ibb.co/7Ny2y0wC/IMG-20260201-115744-136.jpg'),
('JAV TV', 'https://t.me/japanesemovieTv', 'https://i.ibb.co/bMnKhVJn/IMG-20260201-121820-790.jpg'),
('MMSUB JAV 01', 'https://t.me/mmsubjav01', 'https://i.ibb.co/237P3jdp/IMG-20260201-120944-428.jpg'),
('MMSUB JAV 03', 'https://t.me/mmsubjav03', 'https://i.ibb.co/BHp2dC7j/IMG-20260201-121039-966.jpg'),
('JPXTV', 'https://t.me/JPXTV', 'https://i.ibb.co/FkWPJy0y/IMG-20260201-120600-643.jpg'),
('JPXTV 2', 'https://t.me/jpxtvtwo', 'https://i.ibb.co/FkWPJy0y/IMG-20260201-120600-643.jpg'),
('JPXTV 3', 'https://t.me/JPXTV03', 'https://i.ibb.co/FkWPJy0y/IMG-20260201-120600-643.jpg'),
('JPX MOVIES', 'https://t.me/jpxmovies', 'https://i.ibb.co/FkWPJy0y/IMG-20260201-120600-643.jpg'),
('REDX TV', 'https://t.me/redxtv', 'https://i.ibb.co/Y4wG8Lgg/IMG-20260201-120726-097.jpg'),
('REDX TV (2)', 'https://t.me/redxtv02', 'https://i.ibb.co/Y4wG8Lgg/IMG-20260201-120726-097.jpg'),
('JAV MMSUBS', 'https://t.me/javmmsubs', 'https://i.ibb.co/3920ys9W/IMG-20260201-122359-795.jpg'),
('MYANMAR HD I', 'https://t.me/myanmarhdi', 'https://i.ibb.co/Q3BSRn4k/IMG-20260201-121259-210.jpg'),
('MYANMAR HD FREELINK', 'https://t.me/myanmarhdfreelink', 'https://i.ibb.co/0RmT6Fmc/IMG-20260201-121213-700.jpg'),
('XMOVIE PLUS', 'https://t.me/xmovieplusfree', 'https://i.ibb.co/Wvbnr1tn/IMG-20260201-120448-259.jpg'),
('XMOVIE PLEX', 'https://t.me/xmovieplex', 'https://i.ibb.co/ZR7QHzZK/IMG-20260201-122558-822.jpg'),
('ACTION CAR MMSUB', 'https://t.me/actioncar_mmsub', 'https://i.ibb.co/Y4XM9Pvs/IMG-20260201-121950-643.jpg'),
('JAV 959', 'https://t.me/jav959', 'https://i.ibb.co/Vcg8bbfc/IMG-20260201-122317-245.jpg'),
('MMSUB 1821', 'https://t.me/mmsub_1821', 'https://i.ibb.co/DDKBTFXL/IMG-20260201-122207-910.jpg'),
('JAV MMSUB 01', 'https://t.me/+-SXSzW5JsQ02Y2E1', 'https://i.ibb.co/7t5n93KD/IMG-20260201-123122-836.jpg'),
('JAV MMSUB 02', 'https://t.me/+r1QeigJbGTw4NWJl', 'https://i.ibb.co/7t5n93KD/IMG-20260201-123122-836.jpg'),
('JAV MMSUB 03', 'https://t.me/+jiF-7k04uLhjOGRl', 'https://i.ibb.co/7t5n93KD/IMG-20260201-123122-836.jpg'),
('JAV MMSUB 04', 'https://t.me/+Z6hP5dkg0fM5Mjg1', 'https://i.ibb.co/7t5n93KD/IMG-20260201-123122-836.jpg'),
('JAV MMSUB 05', 'https://t.me/+yWtOvdNB0NoyMTll', 'https://i.ibb.co/7t5n93KD/IMG-20260201-123122-836.jpg'),
('DARKFLIX', 'https://t.me/+knN9NUBubpI5Zjhl', 'https://i.ibb.co/wFS15SBX/IMG-20260201-122746-092.jpg'),
('VIVAMAX BURMA', 'https://t.me/vivamaxburma', 'https://i.ibb.co/9kYPQMSt/IMG-20260201-120654-600.jpg'),
('စာတန်းထိုးကားများ', 'https://t.me/c/2014477597/2979', 'https://i.ibb.co/Y4XM9Pvs/IMG-20260201-121950-643.jpg'),
('TELEMOVIE BURMA', 'https://t.me/telemovieBurma', 'https://i.ibb.co/vvspZbDZ/IMG-20260201-121440-729.jpg'),
('VELVET STREAM', 'https://t.me/+RmSstqlK8GBjNTc1', 'https://i.ibb.co/wFS15SBX/IMG-20260201-122746-092.jpg'),
('PRIME VIBE', 'https://t.me/+RpLwUz3QiGA1NmZl', 'https://i.ibb.co/wFS15SBX/IMG-20260201-122746-092.jpg');

-- Verify data insertion
SELECT COUNT(*) as total_channels FROM ads_management;
