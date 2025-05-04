const fs = require('fs');
const https = require('https');
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = 3001;

// تنظیمات ربات - بدون تعیین port در webHook
const token = '7602359629:AAHejF-qIjcvPmYQrUotawjEsa9ykFgT6uk';
const bot = new TelegramBot(token, {polling: false}); // polling غیرفعال

// URL وب‌هوک
const WEBHOOK_URL = 'https://bot.zhixgame.com/bot'; // بدون پورت اگر از پروکسی استفاده می‌کنید

// SSL options
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/bot.zhixgame.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/bot.zhixgame.com/fullchain.pem')
};

// راه‌اندازی سرور
const server = https.createServer(options, app).listen(PORT, () => {
  console.log(`Bot running on port ${PORT}`);
});

// تنظیم وب‌هوک بعد از راه‌اندازی سرور
server.on('listening', () => {
  bot.setWebHook(`${WEBHOOK_URL}${token}`, {
    certificate: fs.readFileSync('/etc/letsencrypt/live/bot.zhixgame.com/fullchain.pem')
  }).then(() => {
    console.log('Webhook set successfully');
  });
});

// پردازش درخواست‌های تلگرام
app.use(express.json());
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// هندل کردن خطاها
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});