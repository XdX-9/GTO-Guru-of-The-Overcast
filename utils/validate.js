export const validateCity = (city) => {
  if (!city) return false;
  const trimmed = city.trim();

  if (trimmed.length < 1 || trimmed.length > 50) return false;
  const regex = /[^a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ\s\-\'\’]/;

  if (regex.test(trimmed)) return false;

  return trimmed;
};
