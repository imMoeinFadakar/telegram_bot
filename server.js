const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const app = express();

// تنظیمات ربات
const token = process.env.BOT_TOKEN || '7602359629:AAHejF-qIjcvPmYQrUotawjEsa9ykFgT6uk';
const bot = new TelegramBot(token, {polling: false});

const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.KOYEB_APP_URL 
                   ? `https://${process.env.KOYEB_APP_URL}.koyeb.app/bot` 
                   : 'https://bot.zhixgame.com/bot';

// Middleware
app.use(express.json());

// Route
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// پردازش دستور /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'کاربر';
  
  bot.sendMessage(chatId, `سلام ${userName}! 👋\nبه ربات خوش آمدید!`);
});

// Start server
app.listen(PORT, async () => {
  console.log(`\n🤖 ربات در حال راه‌اندازی...`);
  
  try {
    await bot.setWebHook(`${WEBHOOK_URL}${token}`);
    console.log('✅ وب‌هوک با موفقیت تنظیم شد');
  } catch (error) {
    console.error('❌ خطا در تنظیم وب‌هوک:', error);
  }
});