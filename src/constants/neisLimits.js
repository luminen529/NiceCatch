/**
 * 항목별 최대 Byte 기준값
 *
 * 출처: 「17개 시도교육청 학교생활기록부 기재요령(2026학년도, 고등학교)」
 *       [별지] 학교생활기록부 영역별 입력 가능 최대 글자수(교육정보시스템, 2026.)
 *
 * 원문 기준은 "한글 기준 글자수"이며, NEIS 입력 단위는 Byte다.
 * (한글 1자 = 3Byte이므로 maxBytes = 최대 글자수 x 3)
 *
 * 기준 연도가 바뀌면 이 파일의 데이터만 교체하면 된다.
 */

export const STANDARD_YEAR = 2026;

export const SOURCE = {
  label: '17개 시도교육청 「학교생활기록부 기재요령」(2026학년도, 고등학교)',
  detail: '[별지] 학교생활기록부 영역별 입력 가능 최대 글자수(교육정보시스템, 2026.)',
  note: '학교급·학년도에 따라 기준이 다를 수 있으므로 최신 기재요령을 함께 확인하세요.',
  lastCheckedAt: '2026-09-05',
};

/** 직접 설정 항목의 id */
export const CUSTOM_LIMIT_ID = 'custom';

/** 직접 설정 시 사용할 기본값과 허용 범위 */
export const CUSTOM_LIMIT = {
  defaultBytes: 1500,
  min: 1,
  max: 100000,
};

/** 한글 1자 = 3Byte. 기재요령의 글자수 기준을 Byte로 환산한다. */
const BYTES_PER_KOREAN_CHAR = 3;

/**
 * @typedef {Object} NeisLimit
 * @property {string} id
 * @property {string} label
 * @property {number} maxChars 기재요령상 최대 글자수(한글 기준)
 * @property {number} maxBytes NEIS 입력 기준 최대 Byte
 * @property {string} description
 * @property {string} [note] 항목별 유의사항
 */

/** 기재요령의 글자수 기준을 그대로 적고, Byte는 환산해서 채운다. */
function limit({ id, label, maxChars, description, note }) {
  return {
    id,
    label,
    maxChars,
    maxBytes: maxChars * BYTES_PER_KOREAN_CHAR,
    description,
    ...(note ? { note } : {}),
  };
}

/** @type {NeisLimit[]} */
export const NEIS_LIMITS = [
  limit({
    id: 'subject-detail',
    label: '교과 세특',
    maxChars: 500,
    description: '과목별 세부능력 및 특기사항',
    note: '과목별 기준. 2022 개정 교육과정을 적용받는 1~2학년의 공통과목(공통국어·공통수학·공통영어·통합사회·통합과학·한국사·과학탐구실험)은 1·2를 합산해 500자 이내로 기재합니다.',
  }),
  limit({
    id: 'individual-detail',
    label: '개인별 세특',
    maxChars: 500,
    description: '개인별 세부능력 및 특기사항',
  }),
  limit({
    id: 'autonomy',
    label: '자율·자치활동',
    maxChars: 500,
    description: '창의적 체험활동 — 자율·자치활동 특기사항',
    note: '3학년은 자율활동으로 기재합니다.',
  }),
  limit({
    id: 'club',
    label: '동아리활동',
    maxChars: 500,
    description: '창의적 체험활동 — 동아리활동 특기사항',
  }),
  limit({
    id: 'career',
    label: '진로활동',
    maxChars: 500,
    description: '창의적 체험활동 — 진로활동 특기사항',
    note: '2026학년도 기준으로 700자에서 500자로 축소되었습니다.',
  }),
  limit({
    id: 'daily-life',
    label: '일상생활 활동상황',
    maxChars: 1000,
    description: '일상생활 활동상황 특기사항',
    note: '2026학년도에 신설된 영역입니다.',
  }),
  limit({
    id: 'behavior',
    label: '행동특성 및 종합의견',
    maxChars: 300,
    description: '행동특성 및 종합의견',
    note: '2026학년도 기준으로 500자에서 300자로 축소되었습니다.',
  }),
  limit({
    id: 'attendance',
    label: '출결 특기사항',
    maxChars: 500,
    description: '출결상황 특기사항',
  }),
  {
    id: CUSTOM_LIMIT_ID,
    label: '직접 설정',
    maxBytes: CUSTOM_LIMIT.defaultBytes,
    description: '원하는 최대 Byte를 직접 입력합니다.',
  },
];

export const DEFAULT_LIMIT_ID = 'subject-detail';

/** id로 항목을 찾는다. 없으면 기본 항목을 돌려준다. */
export function findLimitById(id) {
  return (
    NEIS_LIMITS.find((limit) => limit.id === id) ??
    NEIS_LIMITS.find((limit) => limit.id === DEFAULT_LIMIT_ID)
  );
}

/** 최대 글자수(한글 기준) 안내 문구. 직접 설정 항목은 null. */
export function formatCharHint(limitItem) {
  if (!limitItem?.maxChars) return null;
  return `한글 기준 ${limitItem.maxChars.toLocaleString('ko-KR')}자`;
}
