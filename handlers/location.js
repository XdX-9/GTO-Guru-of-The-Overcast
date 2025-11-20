import { getWeatherByCoords } from "../services/weather.js";
import { t } from "../utils/i18n.js";
import { getOutfit } from "../utils/outfit.js";

export const handleLocation = (bot, userData) => async (msg) => {
  const chatId = msg.chat.id;
  const user = userData.get(chatId) || { lang: "en" };

  const { latitude, longitude } = msg.location;

  console.log(`Received location from user ${chatId} (Processing...)`);

  const safeLat = Number(latitude.toFixed(2));
  const safeLon = Number(longitude.toFixed(2));

  try {
    const weather = await getWeatherByCoords(safeLat, safeLon, user.lang);
    const outfit = getOutfit(weather.feels, user.lang);
    const emoji =
      {
        Sunny: "☀️",
        Moon: "🌙",
        "Cloudy Sun": "⛅",
        "Cloudy Moon": "🌤️",
        Cloud: "☁️",
        Rain: "🌧️",
        "Rainy Sun": "🌦️",
        Thunderstorm: "⛈️",
        Snow: "❄️",
        Fog: "🌫️",
      }[weather.icon] || "🌍";

    if (!userData.has(chatId)) userData.set(chatId, { lang: user.lang });
    const currentUser = userData.get(chatId);
    currentUser.city = weather.name;
    currentUser.step = "choose_day";

    const reply =
      `*${weather.name}* ${emoji}\n` +
      `_(📍 Геолокація оброблена анонімно)_\n\n` +
      `*${weather.temp}°C* — ${weather.desc}\n` +
      `${t("feels", user.lang)}: *${weather.feels}°C*\n` +
      `${t("hum", user.lang)}: *${weather.humidity}%*\n` +
      `${t("wind", user.lang)}: *${weather.wind.toFixed(1)} м/с*\n\n` +
      `${outfit}`;

    const opts = {
      uk: { today: "Сьогодні", tomorrow: "Завтра", three: "3 дні" },
      ru: { today: "Сегодня", tomorrow: "Завтра", three: "3 дня" },
      en: { today: "Today", tomorrow: "Tomorrow", three: "3 days" },
    }[user.lang];

    bot.sendMessage(chatId, reply, {
      parse_mode: "Markdown",
      reply_markup: {
        keyboard: [
          [opts.today],
          [opts.tomorrow],
          [opts.three],
          [t("change_city", user.lang)],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  } catch (err) {
    console.error("Location handler error:", err.message);
    bot.sendMessage(chatId, t("try_again", user.lang));
  }
};
