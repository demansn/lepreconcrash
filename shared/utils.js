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

export function initDataToObj(initData) {
    const data = Object.fromEntries(new URLSearchParams(initData));

    data.user = JSON.parse(data.user);

    return data;
}

export function initDataToString(initData) {
    const data = new URLSearchParams();

    for (const [key, value] of Object.entries(initData)) {
        if (key === 'user') {
            data.append(key, JSON.stringify(value));
        } else {
            data.append(key, value);
        }
    }

    return data.toString();
}

export function nextMidnight() {
    const now = new Date();

    return  new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
}

/**
 * Устанавливает таймер для выполнения функции в заданное время.
 * @param {Function} callback - Функция, которую нужно вызвать.
 * @param {string} targetTime - Время в формате UTC ISO, когда нужно вызвать функцию.
 * @returns {number} - Возвращает идентификатор таймера.
 */
export function scheduleAtTime(callback, targetTime) {
    const now = new Date();
    const targetDate = new Date(targetTime);

    const timeDifference = targetDate - now;

    if (timeDifference <= 0) {
        console.log("Target time has already passed.");
        return null;
    }

    return setTimeout(() =>callback(), timeDifference);
}
