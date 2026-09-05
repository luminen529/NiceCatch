/**
 * NEIS Byte 계산 규칙
 *
 * - 한글 1자      : 3Byte
 * - 영문/숫자/기호 : 1Byte
 * - 줄바꿈(Enter) : 1Byte
 * - 공백          : 1Byte
 *
 * NEIS는 입력값을 UTF-8로 다루므로, ASCII 이외의 문자는
 * 실제 UTF-8 인코딩 길이(한글·한자 3Byte, 이모지 4Byte)를 그대로 사용한다.
 * 계산 규칙이 바뀌면 이 파일만 수정하면 된다.
 */

/** 입력 문자열을 NEIS가 저장하는 형태로 정규화한다. (CRLF -> LF) */
export function normalizeText(text) {
  return String(text ?? '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/** 문자 하나의 Byte 수를 반환한다. */
export function byteLengthOfChar(char) {
  const code = char.codePointAt(0);
  if (code < 0x80) return 1; // 영문·숫자·기호·공백·줄바꿈
  if (code < 0x800) return 2;
  if (code < 0x10000) return 3; // 한글·한자·전각기호
  return 4; // 이모지 등 보조 평면
}

/** 문자열 전체의 Byte 수를 반환한다. */
export function getByteLength(text) {
  const normalized = normalizeText(text);
  let bytes = 0;
  for (const char of normalized) {
    bytes += byteLengthOfChar(char);
  }
  return bytes;
}

/** 공백(스페이스·탭·줄바꿈)을 제외한 글자 수 */
export function getCharCountWithoutSpaces(text) {
  return [...normalizeText(text).replace(/\s/g, '')].length;
}

/** 공백을 포함한 글자 수 */
export function getCharCount(text) {
  return [...normalizeText(text)].length;
}

/** 줄 수 */
export function getLineCount(text) {
  const normalized = normalizeText(text);
  if (normalized.length === 0) return 0;
  return normalized.split('\n').length;
}

/**
 * 계산기 화면에 필요한 값을 한 번에 계산한다.
 * @param {string} text
 * @param {number} maxBytes
 */
export function calculateNeisBytes(text, maxBytes) {
  const bytes = getByteLength(text);
  const limit = Number(maxBytes) > 0 ? Number(maxBytes) : 0;

  const remainingBytes = limit > 0 ? Math.max(limit - bytes, 0) : 0;
  const overBytes = limit > 0 ? Math.max(bytes - limit, 0) : 0;
  const usageRate = limit > 0 ? (bytes / limit) * 100 : 0;

  return {
    bytes,
    maxBytes: limit,
    remainingBytes,
    overBytes,
    usageRate,
    status: getUsageStatus(usageRate, overBytes),
    charCount: getCharCount(text),
    charCountWithoutSpaces: getCharCountWithoutSpaces(text),
    lineCount: getLineCount(text),
  };
}

/** 사용률에 따른 상태: 'ok' | 'warning' | 'over' */
export function getUsageStatus(usageRate, overBytes) {
  if (overBytes > 0) return 'over';
  if (usageRate >= 90) return 'warning';
  return 'ok';
}
