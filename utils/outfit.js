import { i18n } from "./i18n.js";

const getRandomAdvice = (key, lang) => {
  const data = i18n[lang]?.[key] || i18n.en[key];

  if (Array.isArray(data)) {
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  }
  return data || key;
};

export const getOutfit = (feels, lang) => {
  if (feels < 0) return `${getRandomAdvice("outfit_cold", lang)}`;
  if (feels < 10) return `${getRandomAdvice("outfit_chilly", lang)}`;
  if (feels < 20) return `${getRandomAdvice("outfit_mild", lang)}`;
  return `${getRandomAdvice("outfit_hot", lang)}`;
};
