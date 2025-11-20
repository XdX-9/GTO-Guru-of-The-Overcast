import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");
console.log("Путь к .env:", envPath);

if (!fs.existsSync(envPath)) {
  console.error("ОШИБКА: .env НЕ НАЙДЕН!");
  process.exit(1);
}

const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error("ОШИБКА чтения .env:", result.error);
  process.exit(1);
}

const { TELEGRAM_TOKEN, WEATHER_API_KEY } = process.env;

console.log("TELEGRAM_TOKEN:", TELEGRAM_TOKEN ? "OK" : "ОТСУТСТВУЕТ");
console.log(
  "WEATHER_API_KEY:",
  WEATHER_API_KEY ? `OK (длина: ${WEATHER_API_KEY.length})` : "ОТСУТСТВУЕТ"
);

if (!TELEGRAM_TOKEN || !WEATHER_API_KEY) {
  console.error("ОШИБКА: Токены не загружены");
  process.exit(1);
}

export { TELEGRAM_TOKEN, WEATHER_API_KEY };
