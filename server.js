const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const app = express();

// تنظیمات ربات
const token = process.env.BOT_TOKEN || '7602359629:AAHejF-qIjcvPmYQrUotawjEsa9ykFgT6uk';
const bot = new TelegramBot(token, {polling: false});

// پورت از متغیر محیطی یا پیش‌فرض 3000
const PORT = process.env.PORT || 3000;

// URL وب‌هوک (در Koyeb به صورت خودکار ساخته می‌شود)
const WEBHOOK_URL = process.env.KOYEB_APP_URL 
                   ? `https://${process.env.KOYEB_APP_URL}.koyeb.app/bot` 
                   : 'https://bot.zhixgame.com/bot';

// راه‌اندازی سرور
app.use(express.json());
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// فقط برای HTTP (در Koyeb نیازی به HTTPS نیست)
app.listen(PORT, async () => {
  console.log(`Bot running on port ${PORT}`);
  
  try {
    await bot.setWebHook(`${WEBHOOK_URL}${token}`);
    console.log('Webhook set successfully:', WEBHOOK_URL);
  } catch (error) {
    console.error('Failed to set webhook:', error);
  }
});