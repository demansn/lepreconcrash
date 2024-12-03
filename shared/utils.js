/**
 * Проверяет, является ли строка валидным email.
 * @param {string} email - Email для проверки.
 * @returns {boolean} - Возвращает true, если email валиден, иначе false.
 */
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Проверяет, является ли строка валидным номером телефона.
 * @param {string} phoneNumber - Номер телефона для проверки.
 * @returns {boolean} - Возвращает true, если номер телефона валиден, иначе false.
 */
export function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 формат
    return phoneRegex.test(phoneNumber);
}


/**
 * Проверяет, является ли строка валидным именем пользователя Twitter.
 * @param {string} username - Имя пользователя Twitter для проверки.
 * @returns {boolean} - Возвращает true, если имя пользователя валидно, иначе false.
 */
export function validateTwitterAccount(username) {
    const twitterRegex = /^@?(\w){1,15}$/;
    return twitterRegex.test(username);
}
