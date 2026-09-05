import { NEIS_LIMITS, CUSTOM_LIMIT_ID, SOURCE, STANDARD_YEAR } from '../../constants/neisLimits.js';

const nf = new Intl.NumberFormat('ko-KR');

/** 항목별 최대 Byte 안내 표 (constants 데이터를 그대로 렌더링) */
export function createLimitTable() {
  const rows = NEIS_LIMITS.filter((limit) => limit.id !== CUSTOM_LIMIT_ID);

  const el = document.createElement('section');
  el.className = 'card';
  el.id = 'limit-table';
  el.innerHTML = `
    <h2 class="card__title">항목별 최대 Byte (${STANDARD_YEAR}학년도 기준)</h2>
    <div class="table-wrap">
      <table class="table">
        <caption class="sr-only">학교생활기록부 항목별 최대 Byte</caption>
        <thead>
          <tr>
            <th scope="col">항목</th>
            <th scope="col">최대 Byte</th>
            <th scope="col">한글 환산</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (limit) => `
            <tr>
              <th scope="row">
                ${limit.label}
                <span class="table__sub">${limit.description}</span>
              </th>
              <td class="table__num">${nf.format(limit.maxBytes)}Byte</td>
              <td>${limit.charHint ?? '-'}</td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>
    <p class="card__note">
      출처: ${SOURCE.label} · 마지막 확인 ${SOURCE.lastCheckedAt}<br />
      ${SOURCE.note}
    </p>
  `;
  return { el };
}
