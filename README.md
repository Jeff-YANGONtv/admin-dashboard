# JAV BURMA Telegram Mini App

A comprehensive Telegram Mini App serving as a Central Hub for an Ad Network and Live Chat Router across 3 separate Telegram bots.

## 🎯 Features

### Live Chat Hub
- **Multi-Bot Support**: Handles incoming messages from 3 Telegram bot tokens
- **Client & Group Routing**: Automatically separates private chats from group conversations
- **Real-time Messaging**: Admin can send replies directly through the mini app
- **Message History**: Complete conversation logs stored in Supabase

### Admin Dashboard
- **Password Protected**: Secure access with `JB2026@ADMIN` password
- **Wallet Balance**: Automatically calculates total revenue from all active ads
- **Revenue Audit History**: Detailed ledger of all channel earnings
- **Channel Management**: 4×3 grid layout with 3 paginated pages (35 channels total)
- **Google Sheet Style Editor**: Inline editable spreadsheet for bulk data management
- **Media Upload**: Upload channel logos and ad banners via Telegram CDN

### Technical Architecture
- **Frontend**: Single Page Application (SPA) with Telegram WebApp SDK
- **Backend**: Node.js + Express with multi-bot webhook engine
- **Database**: Supabase PostgreSQL with real-time sync
- **Media Storage**: Telegram Channel CDN for image hosting

---

## 📋 Prerequisites

1. **Telegram Account** with 3 bot tokens from @BotFather
2. **Supabase Project** (free tier available at supabase.com)
3. **Node.js** 18.x or higher
4. **Vercel Account** for deployment (or any Node.js hosting)

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Setup Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your **Project URL** and **Publishable Key**
3. Go to **SQL Editor** → **New Query**
4. Copy the entire content from `schema.sql` and run it
5. Verify all 3 tables are created and 35 channels are seeded

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your Supabase credentials:
   ```bash
   SUPABASE_URL=your-project-url
   SUPABASE_KEY=your-publishable-key
   ```
3. Add your 3 Telegram bot tokens:
   ```bash
   BOT_TOKEN_1=your-bot-token-1
   BOT_TOKEN_2=your-bot-token-2
   BOT_TOKEN_3=your-bot-token-3
   ```
4. Set your Telegram Channel ID (for media storage):
   ```bash
   TELEGRAM_CHANNEL_ID=-100XXXXXXXXX
   ```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Test Locally

```bash
npm start
```

Server will run on `http://localhost:3000`

### Step 5: Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Follow the prompts and your app will be live at `https://your-project.vercel.app`

---

## 🔧 Configuration

### Telegram Webhook Setup

After deployment, configure webhooks for each bot:

```bash
# Bot 1
curl -X POST https://api.telegram.org/bot<BOT_TOKEN_1>/setWebhook \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-deployed-url.vercel.app/webhook?bot=bot1"}'

# Bot 2
curl -X POST https://api.telegram.org/bot<BOT_TOKEN_2>/setWebhook \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-deployed-url.vercel.app/webhook?bot=bot2"}'

# Bot 3
curl -X POST https://api.telegram.org/bot<BOT_TOKEN_3>/setWebhook \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-deployed-url.vercel.app/webhook?bot=bot3"}'
```

### Set Menu Button for Mini App

For each bot, use @BotFather to set the menu button:

1. Send `/setmenubutton` to @BotFather
2. Select your bot
3. Choose "Web App"
4. Enter your deployed URL: `https://your-deployed-url.vercel.app`
5. Set button text: `📊 Dashboard`

---

## 📁 Project Structure

```
jav-burma-telegram-app/
├── index.html              # Frontend SPA (Telegram WebApp SDK)
├── server.js               # Express backend with webhooks
├── schema.sql              # Supabase database schema
├── package.json            # Node.js dependencies
├── .env.example            # Environment variables template
└── README.md               # This file
```

---

## 🔐 Admin Dashboard Access

**Password**: `JB2026@ADMIN`

### Dashboard Features

1. **Wallet Balance Card**
   - Shows total revenue from all active ads
   - Auto-calculated from `ads1_fees` + `ads2_fees` for all channels

2. **Revenue Audit History**
   - Click "View History" to see detailed ledger
   - Shows each channel's earnings with timestamps

3. **Channel Grid (4×3 Layout)**
   - 35 channels across 3 pages
   - Click any card to view channel details
   - Shows channel logo, ad info, and direct link

4. **Spreadsheet Editor**
   - Click "To Add Data" to open inline editor
   - Edit all channel fields in real-time
   - Upload media files directly
   - All changes auto-sync to Supabase

---

## 🌐 API Endpoints

### Chat Management
- `GET /api/chats` - Get all customer chats
- `GET /api/messages/:chatId` - Get messages for a chat
- `POST /api/send-reply` - Send admin reply

### Admin Dashboard
- `GET /api/channels` - Get all channels
- `GET /api/wallet-balance` - Get total revenue
- `GET /api/revenue-history` - Get audit history
- `POST /api/update-cell` - Update channel data
- `POST /api/upload-media` - Upload media to Telegram CDN
- `GET /api/get-media-url/:fileId` - Resolve Telegram file_id to URL

### Webhooks
- `POST /webhook?bot=bot1|bot2|bot3` - Telegram webhook endpoint

---

## 🎨 Customization

### Change Admin Password
Edit `server.js` line 22:
```javascript
const ADMIN_PASSWORD = 'YOUR_NEW_PASSWORD';
```

### Modify Channel Grid Layout
Edit `index.html` line 330:
```javascript
const itemsPerPage = 12; // Change to desired number
```

### Update Colors & Styling
All Tailwind CSS classes are in `index.html`. Modify the `<style>` section for custom theming.

---

## 🐛 Troubleshooting

### Webhook Not Receiving Messages
- Verify bot tokens are correct
- Check webhook URL is publicly accessible
- Test with: `curl https://api.telegram.org/bot<TOKEN>/getMe`

### Database Connection Error
- Verify Supabase URL and key in `.env`
- Check if tables exist in Supabase SQL Editor
- Ensure RLS policies allow public access (if needed)

### Media Upload Fails
- Verify Telegram Channel ID is correct (starts with `-100`)
- Check bot token has permission to post in channel
- Ensure file size is under 20MB

### Admin Dashboard Password Not Working
- Clear browser cache and localStorage
- Verify password matches exactly (case-sensitive)
- Check browser console for JavaScript errors

---

## 📊 Database Schema

### customer_chats
- `id` - Primary key
- `chat_id` - Telegram chat ID (unique)
- `username` - Telegram username
- `customer_name` - User's display name
- `last_message` - Latest message text
- `bot_source` - Which bot received the message
- `updated_at` - Last update timestamp

### chat_messages
- `id` - Primary key
- `chat_id` - Reference to customer_chats
- `sender` - 'customer' or 'admin'
- `message_text` - Message content
- `created_at` - Message timestamp

### ads_management (35 Channels)
- `id` - Primary key
- `channel_name` - Channel display name
- `telegram_link` - Direct link to channel
- `logo_url` - Channel logo image URL
- `ads1` - First ad name
- `ads1_fees` - First ad fees (MMK)
- `ads1_duration` - First ad duration
- `ads1_posts` - First ad post count
- `ads2` - Second ad name
- `ads2_fees` - Second ad fees (MMK)
- `ads2_duration` - Second ad duration
- `ads2_posts` - Second ad post count
- `payment_method` - Payment method used
- `telegram_file_id` - Telegram CDN file ID
- `media_backup_url` - Direct CDN URL
- `updated_at` - Last update timestamp

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review Telegram Bot API docs: https://core.telegram.org/bots
3. Check Supabase docs: https://supabase.com/docs
4. Review Express.js docs: https://expressjs.com

---

## 📄 License

This project is provided for JAV BURMA organization.

---

## ✨ Version

**v1.0.0** - Production Ready ✅

**Last Updated**: June 2026

**Status**: Fully Functional
