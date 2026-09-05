/**
 * localStorage 접근을 한곳으로 모은 모듈.
 *
 * 시크릿 모드·저장소 차단 환경에서는 접근 자체가 예외를 던지므로
 * 모든 읽기/쓰기를 try/catch로 감싸고, 실패해도 앱이 동작하도록 한다.
 */

const PREFIX = 'neis-counter:';

function isAvailable() {
  try {
    const key = `${PREFIX}__test__`;
    window.localStorage.setItem(key, '1');
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export const storageAvailable = isAvailable();

/** 저장된 값을 읽는다. 없거나 실패하면 fallback을 돌려준다. */
export function readValue(key, fallback = null) {
  if (!storageAvailable) return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/** 값을 저장한다. 성공 여부를 돌려준다. */
export function writeValue(key, value) {
  if (!storageAvailable) return false;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** 값을 삭제한다. */
export function removeValue(key) {
  if (!storageAvailable) return false;
  try {
    window.localStorage.removeItem(PREFIX + key);
    return true;
  } catch {
    return false;
  }
}

/**
 * 하나의 키에 대한 읽기/쓰기/삭제 묶음을 만든다.
 * @param {string} key
 * @param {*} fallback
 */
export function createStorageEntry(key, fallback = null) {
  return {
    available: storageAvailable,
    read: () => readValue(key, fallback),
    write: (value) => writeValue(key, value),
    remove: () => removeValue(key),
  };
}

/** 저장 호출이 잦은 경우를 위한 디바운스 헬퍼 */
export function debounce(fn, delay = 400) {
  let timer = null;
  const debounced = (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, delay);
  };
  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };
  debounced.flush = (...args) => {
    debounced.cancel();
    fn(...args);
  };
  return debounced;
}
