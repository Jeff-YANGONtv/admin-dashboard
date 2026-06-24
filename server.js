// JAV BURMA Telegram Mini App - Backend Server
// Node.js + Express + Supabase

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Environment Variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://unjnemhzwliwghukyzhf.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_PQFj9avS9t2ZDcly-jccmg_iqBjpslB';
const BOT_TOKEN_1 = process.env.BOT_TOKEN_1 || '8176597882:AAH1Z4jJmmrV672XgGlk-c8ec0uqHUbq7ts';
const BOT_TOKEN_2 = process.env.BOT_TOKEN_2 || '8591414011:AAFRqwiSdgHS9t-uqFkJF0PkwtV5kXHR7aU';
const BOT_TOKEN_3 = process.env.BOT_TOKEN_3 || '8889918436:AAEGySvLCVCaZorWeVb4qT6kttd0yomiLyY';
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '-1002014477597';
const ADMIN_PASSWORD = 'JB2026@ADMIN';

// Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Bot Token Mapping
const botTokens = {
  bot1: BOT_TOKEN_1,
  bot2: BOT_TOKEN_2,
  bot3: BOT_TOKEN_3
};

// ============================================
// WEBHOOK ENDPOINTS - Multi-Bot Handler
// ============================================

app.post('/webhook', async (req, res) => {
  const { bot } = req.query;
  const botToken = botTokens[bot] || BOT_TOKEN_1;
  
  try {
    const update = req.body;

    if (update.message) {
      const message = update.message;
      const chatId = message.chat.id;
      const username = message.from.username || 'Anonymous';
      const customerName = `${message.from.first_name || ''} ${message.from.last_name || ''}`.trim();
      const messageText = message.text || '';

      // Determine if Private Chat or Group
      const isGroup = chatId < 0;

      // Save/Update customer chat
      const { data: existingChat } = await supabase
        .from('customer_chats')
        .select('*')
        .eq('chat_id', chatId)
        .single();

      if (!existingChat) {
        await supabase.from('customer_chats').insert({
          chat_id: chatId,
          username,
          customer_name: customerName,
          last_message: messageText,
          bot_source: bot
        });
      } else {
        await supabase
          .from('customer_chats')
          .update({ last_message: messageText, updated_at: new Date() })
          .eq('chat_id', chatId);
      }

      // Save message to chat_messages
      await supabase.from('chat_messages').insert({
        chat_id: chatId,
        sender: 'customer',
        message_text: messageText
      });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// API ENDPOINTS
// ============================================

// Get all customer chats
app.get('/api/chats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('customer_chats')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chat messages for a specific chat
app.get('/api/messages/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', parseInt(chatId))
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send admin reply via Telegram
app.post('/api/send-reply', async (req, res) => {
  try {
    const { chatId, messageText, botSource } = req.body;
    const botToken = botTokens[botSource] || BOT_TOKEN_1;

    // Send message via Telegram API
    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        chat_id: chatId,
        text: messageText
      }
    );

    // Save admin reply to database
    await supabase.from('chat_messages').insert({
      chat_id: parseInt(chatId),
      sender: 'admin',
      message_text: messageText
    });

    res.json({ ok: true, messageId: response.data.result.message_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ADMIN DASHBOARD ENDPOINTS
// ============================================

// Get all channels with ads
app.get('/api/channels', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ads_management')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get total wallet balance
app.get('/api/wallet-balance', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ads_management')
      .select('ads1_fees, ads2_fees');

    if (error) throw error;

    const totalBalance = data.reduce((sum, row) => {
      return sum + (parseFloat(row.ads1_fees) || 0) + (parseFloat(row.ads2_fees) || 0);
    }, 0);

    res.json({ totalBalance: totalBalance.toLocaleString('en-US') });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get revenue audit history
app.get('/api/revenue-history', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ads_management')
      .select('id, channel_name, ads1, ads1_fees, ads2, ads2_fees, updated_at')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    const history = data.map(row => ({
      id: row.id,
      channel: row.channel_name,
      ad1: row.ads1,
      ad1_fees: row.ads1_fees,
      ad2: row.ads2,
      ad2_fees: row.ads2_fees,
      timestamp: row.updated_at
    }));

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update cell in ads_management table
app.post('/api/update-cell', async (req, res) => {
  try {
    const { id, field, value } = req.body;

    const { data, error } = await supabase
      .from('ads_management')
      .update({ [field]: value, updated_at: new Date() })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json({ ok: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload media to Telegram channel and save file_id
app.post('/api/upload-media', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.body;
    const filePath = req.file.path;

    // Read file and create form data
    const fileStream = fs.createReadStream(filePath);
    const form = new FormData();
    form.append('chat_id', TELEGRAM_CHANNEL_ID);
    form.append('photo', fileStream);

    // Send to Telegram
    const response = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN_1}/sendPhoto`,
      form,
      { headers: form.getHeaders() }
    );

    const fileId = response.data.result.photo[0].file_id;
    const messageId = response.data.result.message_id;

    // Get file path for CDN
    const fileResponse = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN_1}/getFile?file_id=${fileId}`
    );

    const filePath_url = fileResponse.data.result.file_path;

    // Update database
    const { data, error } = await supabase
      .from('ads_management')
      .update({
        telegram_file_id: fileId,
        media_backup_url: `https://api.telegram.org/file/bot${BOT_TOKEN_1}/${filePath_url}`,
        updated_at: new Date()
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({ ok: true, fileId, mediaUrl: data[0].media_backup_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get media URL from Telegram file_id
app.get('/api/get-media-url/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;

    const response = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN_1}/getFile?file_id=${fileId}`
    );

    const filePath = response.data.result.file_path;
    const mediaUrl = `https://api.telegram.org/file/bot${BOT_TOKEN_1}/${filePath}`;

    res.json({ mediaUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 JAV BURMA Telegram Mini App Server running on port ${PORT}`);
  console.log(`📡 Webhook URL: /webhook?bot=bot1|bot2|bot3`);
  console.log(`💾 Supabase connected: ${SUPABASE_URL}`);
});

module.exports = app;
