import { getAllActiveNotifications } from "./notification.js";
import { getCurrentWeather } from "./weather.js";
import { t, i18n } from "../utils/i18n.js";
import { getOutfit } from "../utils/outfit.js";

let intervalId = null;

const sendNotificationMessage = async (bot, chatId, settings) => {
  const { city, lang } = settings;
  try {
    const w = await getCurrentWeather(city, lang);
    const outfit = getOutfit(w.feels, lang);
    const emoji = i18n[lang].weather_icons[w.icon] || "🌍";

    const reply =
      `🔔 *Ежедневный прогноз для ${w.name}* ${emoji}\n\n` +
      `*${w.temp}°C* — ${w.desc}\n` +
      `${t("feels", lang)}: *${w.feels}°C*\n` +
      `${t("hum", lang)}: *${w.humidity}%*\n` +
      `${t("wind", lang)}: *${w.wind.toFixed(1)} м/с*\n\n` +
      `${outfit}`;

    await bot.sendMessage(chatId, reply, { parse_mode: "Markdown" });
    console.log(
      `Notification sent to ${chatId} for ${city} at ${settings.time}`
    );
  } catch (err) {
    console.error(
      `Error sending notification to ${chatId} for ${city}:`,
      err.message
    );
    await bot.sendMessage(
      chatId,
      `⚠️ ${t("try_again", lang)} (Ошибка с прогнозом).`
    );
  }
};

const runScheduler = (bot) => async () => {
  const now = new Date();
  const currentTime = [
    now.getHours().toString().padStart(2, "0"),
    now.getMinutes().toString().padStart(2, "0"),
  ].join(":");

  const activeNotifications = getAllActiveNotifications();

  if (activeNotifications.length === 0) return;

  for (const [chatId, settings] of activeNotifications) {
    if (settings.time === currentTime) {
      await sendNotificationMessage(bot, chatId, settings);
    }
  }
};

export const startScheduler = (bot) => {
  if (intervalId) return;

  const schedulerFunction = runScheduler(bot);
  schedulerFunction();

  intervalId = setInterval(schedulerFunction, 60000);

  console.log("✅ Daily Notification Scheduler running.");
};

export const stopScheduler = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("❌ Daily Notification Scheduler stopped.");
  }
};
