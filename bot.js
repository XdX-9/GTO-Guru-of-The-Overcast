import TelegramBot from "node-telegram-bot-api";
import { TELEGRAM_TOKEN } from "./config/env.js";

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.on("polling_error", (err) => console.error("Polling error:", err));
bot.on("error", (err) => console.error("Bot error:", err));

export default bot;
