const fs = require('fs');
const https = require('https');
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');


const app = express();
const PORT = 3001; 

// تنظیمات ربات
const token = '7602359629:AAHejF-qIjcvPmYQrUotawjEsa9ykFgT6uk';
const bot = new TelegramBot(token, { 
  webHook: { 
    port: PORT // تغییر پورت وب‌هوک
  } 
});

// URL وب‌هوک (بدون نیاز به پورت اگر از 80/443 استفاده می‌کنید)
const WEBHOOK_URL = 'https://bot.zhixgame.com:3001'; // فرض می‌کنیم از پروکسی معکوس استفاده می‌کنید

// تنظیم وب‌هوک
bot.setWebHook(`${WEBHOOK_URL}/bot${token}`);

// پردازش درخواست‌های تلگرام
app.use(express.json());
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// SSL (اختیاری - فقط اگر می‌خواهید مستقیماً از HTTPS استفاده کنید)
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/bot.zhixgame.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/bot.zhixgame.com/fullchain.pem')
};

// راه‌اندازی سرور
https.createServer(options, app).listen(PORT, () => {
  console.log(`Bot running on port ${PORT}`);
});

// هندل کردن خطاهای unhandled
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});