import crypto from 'node:crypto';

export function validateSignature(telegramInitData, botToken) {
    const initData = new URLSearchParams(telegramInitData);
    const hash = initData.get('hash');
    initData.delete('hash');

    const dataToCheck = [...initData.entries()]
        .map(([key, value]) => `${key}=${decodeURIComponent(value)}`)
        .sort()
        .join('\n');

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const computedHash = crypto.createHmac('sha256', secretKey).update(dataToCheck).digest('hex');

    return computedHash === hash ? initDataToObj(initData) : null;
}

function initDataToObj(initData) {
    const data = Object.fromEntries(new URLSearchParams(initData));

    data.user = JSON.parse(data.user);

    return data;
}

export function toFixed(value) {
    return Number(value.toPrecision(10));
}
