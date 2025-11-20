import bot from "./bot.js";
import { handleStart } from "./handlers/start.js";
import { handleMessage } from "./handlers/message.js";
import { handleLocation } from "./handlers/location.js";
import http from "http";

const userData = new Map();

const PORT = process.env.PORT || 10000;

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Bot is running");
  })
  .listen(PORT, () => {
    console.log(`Fake server is listening on port ${PORT}`);
  });

bot.onText(/\/start/, handleStart(bot, userData));
bot.onText(/\/help/, (msg) => {
  const user = userData.get(msg.chat.id);
  bot.sendMessage(msg.chat.id, "Help message");
});
bot.on("message", handleMessage(bot, userData));
bot.on("location", handleLocation(bot, userData));

console.log("The bot is working..");
