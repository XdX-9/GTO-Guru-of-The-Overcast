import { validateCity } from "../utils/validate.js";
import {
  getCurrentWeather,
  getForecast,
  getHourlyForecast,
} from "../services/weather.js";
import { t, pluralRu, i18n } from "../utils/i18n.js";
import { getOutfit } from "../utils/outfit.js";

const cityMap = {
  киев: "Kyiv,UA",
  київ: "Kyiv,UA",
  kyiv: "Kyiv,UA",

  винница: "Vinnytsia,UA",
  вінниця: "Vinnytsia,UA",
  луцк: "Lutsk,UA",
  луцьк: "Lutsk,UA",
  днепр: "Dnipro,UA",
  дніпро: "Dnipro,UA",
  днепропетровск: "Dnipro,UA",
  днепропетровськ: "Dnipro,UA",
  донецк: "Donetsk,UA",
  донецьк: "Donetsk,UA",
  житомир: "Zhytomyr,UA",
  житомир: "Zhytomyr,UA",
  ужгород: "Uzhhorod,UA",
  ужгород: "Uzhhorod,UA",
  запорожье: "Zaporizhzhia,UA",
  запорожжя: "Zaporizhzhia,UA",
  "ивано-франковск": "Ivano-Frankivsk,UA",
  "івано-франківськ": "Ivano-Frankivsk,UA",
  кировоград: "Kropyvnytskyi,UA",
  кропивницький: "Kropyvnytskyi,UA",
  кировоград: "Kropyvnytskyi,UA",
  луганск: "Luhansk,UA",
  луганськ: "Luhansk,UA",
  львов: "Lviv,UA",
  львів: "Lviv,UA",
  николаев: "Mykolaiv,UA",
  миколаїв: "Mykolaiv,UA",
  одесса: "Odesa,UA",
  одеса: "Odesa,UA",
  полтава: "Poltava,UA",
  полтава: "Poltava,UA",
  ровно: "Rivne,UA",
  рівне: "Rivne,UA",
  сумы: "Sumy,UA",
  суми: "Sumy,UA",
  тернополь: "Ternopil,UA",
  тернопіль: "Ternopil,UA",
  харьков: "Kharkiv,UA",
  харків: "Kharkiv,UA",
  херсон: "Kherson,UA",
  херсон: "Kherson,UA",
  хмельницкий: "Khmelnytskyi,UA",
  хмельницький: "Khmelnytskyi,UA",
  черкассы: "Cherkasy,UA",
  черкаси: "Cherkasy,UA",
  чернигов: "Chernihiv,UA",
  чернігів: "Chernihiv,UA",
  черновцы: "Chernivtsi,UA",
  чернівці: "Chernivtsi,UA",

  "белая церковь": "Bila Tserkva,UA",
  "біла церква": "Bila Tserkva,UA",
  бровары: "Brovary,UA",
  бровари: "Brovary,UA",
  бердичев: "Berdychiv,UA",
  бердичів: "Berdychiv,UA",
  бердянск: "Berdiansk,UA",
  бердянськ: "Berdiansk,UA",
  борисполь: "Boryspil,UA",
  бориспіль: "Boryspil,UA",
  вознесенск: "Voznesensk,UA",
  вознесенськ: "Voznesensk,UA",
  горловка: "Horlivka,UA",
  горлівка: "Horlivka,UA",
  дрогобыч: "Drohobych,UA",
  дрогобич: "Drohobych,UA",
  энергодар: "Enerhodar,UA",
  енергодар: "Enerhodar,UA",
  измаил: "Izmail,UA",
  ізмаїл: "Izmail,UA",
  ирпень: "Irpin,UA",
  ірпінь: "Irpin,UA",
  "каменец-подольский": "Kamianets-Podilskyi,UA",
  "каменець-подільський": "Kamianets-Podilskyi,UA",
  конотоп: "Konotop,UA",
  конотоп: "Konotop,UA",
  краматорск: "Kramatorsk,UA",
  краматорськ: "Kramatorsk,UA",
  кременчуг: "Kremenchuk,UA",
  кременчук: "Kremenchuk,UA",
  "кривой рог": "Kryvyi Rih,UA",
  "кривий ріг": "Kryvyi Rih,UA",
  лисичанск: "Lysychansk,UA",
  лисичанськ: "Lysychansk,UA",
  мариуполь: "Mariupol,UA",
  маріуполь: "Mariupol,UA",
  мелитополь: "Melitopol,UA",
  мелітополь: "Melitopol,UA",
  никополь: "Nikopol,UA",
  нікополь: "Nikopol,UA",
  нижин: "Nizhyn,UA",
  ніжин: "Nizhyn,UA",
  павлоград: "Pavlohrad,UA",
  павлоград: "Pavlohrad,UA",
  прилуки: "Pryluky,UA",
  прилуки: "Pryluky,UA",
  славянск: "Sloviansk,UA",
  "слов’янськ": "Sloviansk,UA",
  смела: "Smila,UA",
  сміла: "Smila,UA",
  умань: "Uman,UA",
  умань: "Uman,UA",
  хмельник: "Khmelnyk,UA",
  хмільник: "Khmelnyk,UA",
  черноморск: "Chornomorsk,UA",
  чорноморськ: "Chornomorsk,UA",
  южноукраинск: "Yuzhnoukrainsk,UA",
  південноукраїнськ: "Yuzhnoukrainsk,UA",

  буча: "Bucha,UA",
  вишневое: "Vyshneve,UA",
  вишневе: "Vyshneve,UA",
  обухов: "Obukhiv,UA",
  обухів: "Obukhiv,UA",
  фастів: "Fastiv,UA",
  фастів: "Fastiv,UA",
  боярка: "Boiarka,UA",
  "вита-почтовая": "Vita-Poshtova,UA",
  "віта-поштова": "Vita-Poshtova,UA",
};

export const handleMessage = (bot, userData) => async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();
  if (!text) return;

  let user = userData.get(chatId);
  if (!user) {
    user = { step: "choose_lang" };
    userData.set(chatId, user);
  }

  if (text === "/help") {
    bot.sendMessage(chatId, t("help", user.lang || "en"), {
      parse_mode: "Markdown",
    });
    return;
  }
  if (user.step === "choose_lang") {
    if (text.match(/Українська|Украин/i)) user.lang = "uk";
    else if (text.match(/Русский|Russian/i)) user.lang = "ru";
    else if (text.match(/English/i)) user.lang = "en";
    else return; // Игнорируем лишний текст

    user.step = "enter_city";
    bot.sendMessage(chatId, t("greet", user.lang));
    bot.sendMessage(chatId, t("send_location", user.lang), {
      reply_markup: {
        keyboard: [
          [{ text: t("send_location_btn", user.lang), request_location: true }],
        ],
        resize_keyboard: true,
        one_time_keyboard: false,
      },
    });
    return;
  }

  if (user.step === "enter_city") {
    const validatedCity = validateCity(text);
    if (!validatedCity) {
      bot.sendMessage(chatId, t("invalid_city", user.lang));
      return;
    }

    const lowerCity = validatedCity.toLowerCase();
    let apiCityName = cityMap[lowerCity];

    if (!apiCityName) {
      const isCyrillic = /[а-яА-ЯіІїЇєЄ]/.test(validatedCity);
      apiCityName = isCyrillic ? `${validatedCity},UA` : validatedCity;
    }

    user.city = apiCityName;
    user.step = "choose_day";

    const opts = {
      uk: {
        today: "Сьогодні",
        tomorrow: "Завтра",
        three: "3 дні",
        hourly: "⏳ Детально (24г)",
      },
      ru: {
        today: "Сегодня",
        tomorrow: "Завтра",
        three: "3 дня",
        hourly: "⏳ Подробно (24ч)",
      },
      en: {
        today: "Today",
        tomorrow: "Tomorrow",
        three: "3 days",
        hourly: "⏳ Detailed (24h)",
      },
    }[user.lang];

    bot.sendMessage(chatId, t("choose_period", user.lang), {
      reply_markup: {
        keyboard: [
          [opts.today, opts.tomorrow],
          [opts.three, opts.hourly],
          [t("change_city", user.lang)],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
    return;
  }

  if (user.step === "choose_day") {
    const city = user.city;
    const lang = user.lang;

    if (text === t("change_city", lang)) {
      user.step = "enter_city";
      bot.sendMessage(chatId, t("change_city_msg", lang), {
        reply_markup: { remove_keyboard: true },
      });
      return;
    }

    try {
      const isToday = text === t("today", lang);
      const isTomorrow = text === t("tomorrow", lang);
      const isThreeDays = text === t("three_days", lang) || text.includes("3");
      const isHourly = text === t("hourly_btn", lang) || text.includes("24");

      if (!isToday && !isTomorrow && !isThreeDays && !isHourly) {
        bot.sendMessage(chatId, t("choose_period", lang));
        return;
      }

      if (isToday) {
        const w = await getCurrentWeather(city, lang);
        const outfit = getOutfit(w.feels, lang);
        const emoji = i18n[lang].weather_icons[w.icon] || "🌍";

        const reply =
          `*${w.name}* ${emoji}\n\n` +
          `*${w.temp}°C* — ${w.desc}\n` +
          `${t("feels", lang)}: *${w.feels}°C*\n` +
          `${t("hum", lang)}: *${w.humidity}%*\n` +
          `${t("wind", lang)}: *${w.wind.toFixed(1)} м/с*\n\n` +
          `${outfit}`;

        bot.sendMessage(chatId, reply, { parse_mode: "Markdown" });
      } else if (isHourly) {
        const hourlyData = await getHourlyForecast(city, lang);

        let message = `⏳ *${city} (24h)*:\n\n`;

        hourlyData.forEach((h) => {
          const emoji = i18n[lang].weather_icons[h.icon] || "🔹";
          message += `🕒 *${h.time}* _(${h.fullDate})_ — ${emoji} *${h.temp}°C*\n`;
          message += `╰ ${h.desc}, ${t("feels", lang)} ${h.feels}°C\n\n`;
        });

        bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
      } else {
        const requestDays = isThreeDays ? 3 : 2;
        const forecast = await getForecast(city, lang, requestDays);

        const dataToShow = isTomorrow ? [forecast[1] || forecast[0]] : forecast;

        let titleText = "";
        if (isTomorrow) {
          if (lang === "uk") titleText = "📅 Прогноз на Завтра";
          else if (lang === "ru") titleText = "📅 Прогноз на Завтра";
          else titleText = "📅 Forecast for Tomorrow";
        } else {
          let dayWord = "";
          if (lang === "ru") dayWord = pluralRu(3, "день", "дня", "дней");
          else if (lang === "uk") dayWord = "дні";
          else dayWord = "days";
          titleText = t("forecast_title", lang, { days: `3 ${dayWord}` });
        }

        let message = `*${titleText}* ${city}:\n\n`;

        dataToShow.forEach((f) => {
          if (!f) return;

          const emoji = i18n[lang].weather_icons[f.icon] || "🌍";
          const outfit = getOutfit(f.feels, lang);

          message += `🗓 *${f.date}* ${emoji}\n`;
          message += `*${f.temp}°C* — ${f.desc}\n`;
          message += `${t("feels", lang)}: *${f.feels}°C*\n`;
          message += `${t("hum", lang)}: *${f.humidity}%*\n`;
          message += `${t("wind", lang)}: *${f.wind.toFixed(1)} м/с*\n`;
          message += `${outfit}\n`;
          message += `━━━━━━━━━━━━━━━\n\n`;
        });

        bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
      }
    } catch (err) {
      console.error("Handler error:", err.message);
      if (err.response?.status === 404) {
        bot.sendMessage(chatId, t("city_not_found", lang));
        user.step = "enter_city";
      } else {
        bot.sendMessage(chatId, t("try_again", lang));
      }
    }
  }
};
