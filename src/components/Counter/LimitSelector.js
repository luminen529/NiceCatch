import {
  NEIS_LIMITS,
  CUSTOM_LIMIT,
  CUSTOM_LIMIT_ID,
  formatCharHint,
} from '../../constants/neisLimits.js';

/**
 * 항목 선택 UI.
 * 데스크톱·모바일 모두 가로 스크롤되는 칩 목록을 사용하고,
 * '직접 설정'을 고르면 Byte 입력란이 나타난다.
 *
 * @param {{ selectedId: string, customBytes: number,
 *           onSelect: (id: string) => void,
 *           onCustomBytesChange: (bytes: number) => void }} props
 */
export function createLimitSelector({ selectedId, customBytes, onSelect, onCustomBytesChange }) {
  const el = document.createElement('section');
  el.className = 'limit-selector';
  el.innerHTML = `
    <div class="limit-selector__head">
      <h2 class="limit-selector__title">항목 선택</h2>
      <p class="limit-selector__desc" data-role="desc"></p>
    </div>
    <div class="chips" role="radiogroup" aria-label="기록 항목 선택" data-role="chips">
      ${NEIS_LIMITS.map(
        (limit) => `
        <button type="button" class="chip" role="radio" aria-checked="false"
                data-id="${limit.id}">
          <span class="chip__label">${limit.label}</span>
          <span class="chip__bytes">${
            limit.id === CUSTOM_LIMIT_ID ? '직접 입력' : `${limit.maxBytes.toLocaleString('ko-KR')}B`
          }</span>
        </button>`
      ).join('')}
    </div>
    <p class="limit-selector__note" data-role="note" hidden></p>
    <div class="custom-limit" data-role="custom" hidden>
      <label class="custom-limit__label" for="custom-bytes">최대 Byte 직접 입력</label>
      <div class="custom-limit__field">
        <input id="custom-bytes" type="number" inputmode="numeric"
               min="${CUSTOM_LIMIT.min}" max="${CUSTOM_LIMIT.max}" step="100"
               value="${customBytes}" />
        <span class="custom-limit__unit">Byte</span>
      </div>
    </div>
  `;

  const chipsEl = el.querySelector('[data-role="chips"]');
  const descEl = el.querySelector('[data-role="desc"]');
  const noteEl = el.querySelector('[data-role="note"]');
  const customEl = el.querySelector('[data-role="custom"]');
  const customInput = el.querySelector('#custom-bytes');

  chipsEl.addEventListener('click', (event) => {
    const chip = event.target.closest('.chip');
    if (!chip) return;
    onSelect(chip.dataset.id);
  });

  customInput.addEventListener('input', () => {
    const value = Number(customInput.value);
    if (!Number.isFinite(value)) return;
    const clamped = Math.min(Math.max(Math.trunc(value), CUSTOM_LIMIT.min), CUSTOM_LIMIT.max);
    onCustomBytesChange(clamped);
  });

  function update(state) {
    const limit = NEIS_LIMITS.find((item) => item.id === state.selectedId);

    chipsEl.querySelectorAll('.chip').forEach((chip) => {
      const active = chip.dataset.id === state.selectedId;
      chip.classList.toggle('chip--active', active);
      chip.setAttribute('aria-checked', String(active));
    });

    const isCustom = state.selectedId === CUSTOM_LIMIT_ID;
    customEl.hidden = !isCustom;
    if (isCustom && Number(customInput.value) !== state.customBytes) {
      customInput.value = String(state.customBytes);
    }

    if (limit) {
      const charHint = formatCharHint(limit);
      descEl.textContent = isCustom
        ? limit.description
        : `${limit.description} · 최대 ${limit.maxBytes.toLocaleString('ko-KR')}Byte${
            charHint ? ` (${charHint})` : ''
          }`;

      noteEl.hidden = !limit.note;
      noteEl.textContent = limit.note ?? '';
    }
  }

  update({ selectedId, customBytes });

  return { el, update };
}
