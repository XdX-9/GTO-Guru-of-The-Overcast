import { t } from "../utils/i18n.js";

export const handleStart = (bot, userData) => (msg) => {
  const chatId = msg.chat.id;
  userData.set(chatId, { step: "choose_lang" });

  bot.sendMessage(chatId, t("choose_lang"), {
    reply_markup: {
      keyboard: [["🇺🇦 Українська"], ["🇷🇺 Русский"], ["🇺🇸 English"]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
};
