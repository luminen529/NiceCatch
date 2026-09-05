/**
 * 항목별 최대 Byte 기준값
 *
 * 기준 연도가 바뀌면 이 파일의 데이터만 교체하면 된다.
 * (UI 컴포넌트에는 제한값을 직접 작성하지 않는다.)
 */

export const STANDARD_YEAR = 2026;

export const SOURCE = {
  label: '교육부 「학교생활기록부 기재요령(고등학교)」',
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

/**
 * @typedef {Object} NeisLimit
 * @property {string} id
 * @property {string} label
 * @property {number} maxBytes
 * @property {string} description
 * @property {string} [charHint] 글자 수 환산 안내
 */

/** @type {NeisLimit[]} */
export const NEIS_LIMITS = [
  {
    id: 'subject-detail',
    label: '교과 세특',
    maxBytes: 1500,
    description: '과목별 세부능력 및 특기사항',
    charHint: '한글 기준 약 500자',
  },
  {
    id: 'autonomy',
    label: '자율·자치활동',
    maxBytes: 1500,
    description: '창의적 체험활동 — 자율·자치활동 특기사항',
    charHint: '한글 기준 약 500자',
  },
  {
    id: 'club',
    label: '동아리활동',
    maxBytes: 1500,
    description: '창의적 체험활동 — 동아리활동 특기사항',
    charHint: '한글 기준 약 500자',
  },
  {
    id: 'career',
    label: '진로활동',
    maxBytes: 2100,
    description: '창의적 체험활동 — 진로활동 특기사항',
    charHint: '한글 기준 약 700자',
  },
  {
    id: 'individual-detail',
    label: '개인별 세특',
    maxBytes: 1500,
    description: '개인별 세부능력 및 특기사항',
    charHint: '한글 기준 약 500자',
  },
  {
    id: 'behavior',
    label: '행동특성 및 종합의견',
    maxBytes: 1500,
    description: '행동특성 및 종합의견',
    charHint: '한글 기준 약 500자',
  },
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
