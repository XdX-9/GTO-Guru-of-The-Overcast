const notificationSettings = new Map();

/**
 * @param {number} chatId
 * @param {string} city
 * @param {string} time
 * @param {string} lang
 */
export const setNotification = (chatId, city, time, lang) => {
  const settings = {
    city: city,
    time: time,
    lang: lang,
    status: true,
  };
  notificationSettings.set(chatId, settings);
  return settings;
};

/**
 * @param {number} chatId
 */
export const disableNotification = (chatId) => {
  if (notificationSettings.has(chatId)) {
    const settings = notificationSettings.get(chatId);
    settings.status = false;
    notificationSettings.set(chatId, settings);
    return true;
  }
  return false;
};

/**
 * @param {number} chatId
 */
export const getNotification = (chatId) => {
  return notificationSettings.get(chatId) || null;
};

export const getAllActiveNotifications = () => {
  return Array.from(notificationSettings.entries()).filter(
    ([id, s]) => s.status
  );
};
