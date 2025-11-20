import axios from "axios";
import { WEATHER_API_KEY } from "../config/env.js";
import { getCache, setCache } from "../utils/cache.js";

const iconMap = {
  "01d": "Sunny",
  "01n": "Moon",
  "02d": "Cloudy Sun",
  "02n": "Cloudy Moon",
  "03d": "Cloud",
  "03n": "Cloud",
  "04d": "Cloud",
  "04n": "Cloud",
  "09d": "Rain",
  "09n": "Rain",
  "10d": "Rainy Sun",
  "10n": "Rainy Moon",
  "11d": "Thunderstorm",
  "11n": "Thunderstorm",
  "13d": "Snow",
  "13n": "Snow",
  "50d": "Fog",
  "50n": "Fog",
};

export const getCurrentWeather = async (city, lang) => {
  const apiLang = lang === "uk" ? "ua" : lang;
  const key = `current_${city}_${lang}`;
  const cached = getCache(key);
  if (cached) return cached;

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${WEATHER_API_KEY}&units=metric&lang=${apiLang}`;
    const res = await axios.get(url);
    const w = res.data;

    const iconCode = w.weather[0].icon;
    const iconKey = iconMap[iconCode] ? iconMap[iconCode] : "Cloud";

    const result = {
      name: w.name,
      temp: Math.round(w.main.temp),
      feels: Math.round(w.main.feels_like),
      desc: w.weather[0].description,
      humidity: w.main.humidity,
      wind: w.wind.speed,
      icon: iconKey,
    };

    setCache(key, result);
    return result;
  } catch (err) {
    console.error("WEATHER API ERROR:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
    });
    throw err;
  }
};

export const getForecast = async (city, lang, days = 3) => {
  const apiLang = lang === "uk" ? "ua" : lang;
  const key = `forecast_${city}_${lang}_${days}`;
  const cached = getCache(key);
  if (cached) return cached;

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )}&appid=${WEATHER_API_KEY}&units=metric&lang=${apiLang}`;
    const res = await axios.get(url);
    const list = res.data.list;

    const byDate = {};
    list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!byDate[date]) byDate[date] = [];
      byDate[date].push(item);
    });

    const dates = Object.keys(byDate).sort().slice(0, days);

    const result = dates.map((date) => {
      const dayData = byDate[date];
      const midday =
        dayData.find((d) => d.dt_txt.includes("12:00")) || dayData[0];

      const iconCode = midday.weather[0].icon;
      const iconKey = iconMap[iconCode] ? iconMap[iconCode] : "Cloud";

      return {
        date: new Date(date).toLocaleDateString(
          lang === "uk" ? "uk-UA" : lang === "ru" ? "ru-RU" : "en-GB",
          { day: "numeric", month: "numeric" }
        ),
        temp: Math.round(midday.main.temp),
        feels: Math.round(midday.main.feels_like),
        desc: midday.weather[0].description,
        humidity: midday.main.humidity,
        wind: midday.wind.speed,
        icon: iconKey,
      };
    });

    setCache(key, result);
    return result;
  } catch (err) {
    console.error("WEATHER API ERROR:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
    });
    throw err;
  }
};

export const getHourlyForecast = async (city, lang) => {
  const apiLang = lang === "uk" ? "ua" : lang;
  const key = `hourly_${city}_${lang}`;
  const cached = getCache(key);
  if (cached) return cached;

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )}&appid=${WEATHER_API_KEY}&units=metric&lang=${apiLang}`;
    const res = await axios.get(url);

    const list = res.data.list.slice(0, 8);

    const result = list.map((item) => {
      const dateObj = new Date(item.dt_txt);

      const time = dateObj.toLocaleTimeString(
        lang === "uk" ? "uk-UA" : lang === "ru" ? "ru-RU" : "en-GB",
        { hour: "2-digit", minute: "2-digit" }
      );

      const dateStr = dateObj.toLocaleDateString(
        lang === "uk" ? "uk-UA" : lang === "ru" ? "ru-RU" : "en-GB",
        { day: "numeric", month: "numeric" }
      );

      const iconCode = item.weather[0].icon;
      const iconKey = iconMap[iconCode] ? iconMap[iconCode] : "Cloud";

      return {
        fullDate: dateStr,
        time: time,
        temp: Math.round(item.main.temp),
        feels: Math.round(item.main.feels_like),
        desc: item.weather[0].description,
        icon: iconKey,
      };
    });

    setCache(key, result);
    return result;
  } catch (err) {
    console.error("HOURLY API ERROR:", err.message);
    throw err;
  }
};

export const getWeatherByCoords = async (lat, lon, lang) => {
  const apiLang = lang === "uk" ? "ua" : lang;
  try {
    console.log("Requesting weather for coords:", lat, lon);
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=${apiLang}`;
    const res = await axios.get(url);
    const w = res.data;

    const iconCode = w.weather[0].icon;
    const iconKey = iconMap[iconCode] ? iconMap[iconCode] : "Cloud";

    return {
      name: w.name,
      temp: Math.round(w.main.temp),
      feels: Math.round(w.main.feels_like),
      desc: w.weather[0].description,
      humidity: w.main.humidity,
      wind: w.wind.speed,
      icon: iconKey,
    };
  } catch (err) {
    console.error("WEATHER API ERROR:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message,
    });
    throw err;
  }
};
