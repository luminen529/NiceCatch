const STATUS_TEXT = {
  ok: '여유 있음',
  warning: '한도 임박',
  over: '초과',
};

const nf = new Intl.NumberFormat('ko-KR');

/**
 * 계산 결과 표시 영역.
 * 색상만으로 상태를 구분하지 않고 상태 텍스트를 함께 노출한다.
 */
export function createResultPanel() {
  const el = document.createElement('section');
  el.className = 'result';
  el.innerHTML = `
    <div class="result__main">
      <p class="result__bytes">
        <span class="result__current" data-role="current">0</span><span
          class="result__max" data-role="max"> / 0 Byte</span>
      </p>
      <span class="badge" data-role="badge">여유 있음</span>
    </div>

    <div class="progress" data-role="progress-wrap">
      <div class="progress__track"
           role="progressbar" aria-label="Byte 사용률"
           aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-role="track">
        <div class="progress__bar" data-role="bar" style="width:0%"></div>
      </div>
      <p class="progress__meta">
        <span data-role="remaining">0 Byte 남음</span>
        <span data-role="rate">0%</span>
      </p>
    </div>

    <dl class="stats">
      <div class="stats__item">
        <dt>공백 포함 글자수</dt>
        <dd data-role="chars">0</dd>
      </div>
      <div class="stats__item">
        <dt>공백 제외 글자수</dt>
        <dd data-role="chars-no-space">0</dd>
      </div>
      <div class="stats__item">
        <dt>줄 수</dt>
        <dd data-role="lines">0</dd>
      </div>
      <div class="stats__item">
        <dt>남은 / 초과 Byte</dt>
        <dd data-role="delta">0</dd>
      </div>
    </dl>

    <p class="result__sr" role="status" aria-live="polite" data-role="sr"></p>
  `;

  const refs = {
    current: el.querySelector('[data-role="current"]'),
    max: el.querySelector('[data-role="max"]'),
    badge: el.querySelector('[data-role="badge"]'),
    track: el.querySelector('[data-role="track"]'),
    bar: el.querySelector('[data-role="bar"]'),
    remaining: el.querySelector('[data-role="remaining"]'),
    rate: el.querySelector('[data-role="rate"]'),
    chars: el.querySelector('[data-role="chars"]'),
    charsNoSpace: el.querySelector('[data-role="chars-no-space"]'),
    lines: el.querySelector('[data-role="lines"]'),
    delta: el.querySelector('[data-role="delta"]'),
    sr: el.querySelector('[data-role="sr"]'),
  };

  function update(state) {
    const r = state.result;

    el.dataset.status = r.status;

    refs.current.textContent = nf.format(r.bytes);
    refs.max.textContent = ` / ${nf.format(r.maxBytes)} Byte`;
    refs.badge.textContent = STATUS_TEXT[r.status];

    const width = Math.min(r.usageRate, 100);
    refs.bar.style.width = `${width}%`;
    refs.track.setAttribute('aria-valuenow', String(Math.round(r.usageRate)));

    refs.rate.textContent = `${r.usageRate.toFixed(1)}%`;
    refs.remaining.textContent =
      r.status === 'over'
        ? `${nf.format(r.overBytes)} Byte 초과`
        : `${nf.format(r.remainingBytes)} Byte 남음`;

    refs.chars.textContent = `${nf.format(r.charCount)}자`;
    refs.charsNoSpace.textContent = `${nf.format(r.charCountWithoutSpaces)}자`;
    refs.lines.textContent = `${nf.format(r.lineCount)}줄`;
    refs.delta.textContent =
      r.status === 'over' ? `+${nf.format(r.overBytes)} 초과` : `${nf.format(r.remainingBytes)} 남음`;

    refs.sr.textContent =
      r.status === 'over'
        ? `최대 Byte를 ${nf.format(r.overBytes)}Byte 초과했습니다.`
        : `${nf.format(r.bytes)} / ${nf.format(r.maxBytes)} Byte, ${nf.format(
            r.remainingBytes
          )}Byte 남았습니다.`;
  }

  return { el, update };
}
