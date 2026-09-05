/**
 * 입력창과 입력 도구(복사 / 지우기).
 *
 * @param {{ value: string, onInput: (value: string) => void, onClear: () => void }} props
 */
export function createTextInput({ value, onInput, onClear }) {
  const el = document.createElement('section');
  el.className = 'editor';
  el.innerHTML = `
    <div class="editor__head">
      <label class="editor__label" for="neis-text">내용 입력</label>
      <div class="editor__tools">
        <button type="button" class="btn btn--ghost" data-role="copy">전체 복사</button>
        <button type="button" class="btn btn--ghost" data-role="clear">전체 지우기</button>
      </div>
    </div>
    <textarea id="neis-text" class="editor__textarea" spellcheck="false"
      placeholder="여기에 생기부 내용을 입력하거나 붙여넣으세요. 입력하는 즉시 Byte가 계산됩니다."></textarea>
    <p class="editor__feedback" data-role="feedback" role="status" aria-live="polite"></p>
  `;

  const textarea = el.querySelector('#neis-text');
  const copyBtn = el.querySelector('[data-role="copy"]');
  const clearBtn = el.querySelector('[data-role="clear"]');
  const feedbackEl = el.querySelector('[data-role="feedback"]');

  textarea.value = value;

  let feedbackTimer = null;
  function showFeedback(message) {
    feedbackEl.textContent = message;
    if (feedbackTimer) clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => {
      feedbackEl.textContent = '';
    }, 2000);
  }

  textarea.addEventListener('input', () => onInput(textarea.value));

  copyBtn.addEventListener('click', async () => {
    const text = textarea.value;
    if (!text) {
      showFeedback('복사할 내용이 없습니다.');
      return;
    }
    const copied = await copyToClipboard(text, textarea);
    showFeedback(copied ? '내용을 복사했습니다.' : '복사에 실패했습니다. 직접 선택해 복사해 주세요.');
  });

  // 실수로 지우는 것을 막기 위해 두 번 눌러야 지워지도록 한다. (모달 대신 인라인 확인)
  let clearArmed = false;
  let clearTimer = null;

  function resetClearButton() {
    clearArmed = false;
    if (clearTimer) clearTimeout(clearTimer);
    clearTimer = null;
    clearBtn.textContent = '전체 지우기';
    clearBtn.classList.remove('btn--danger');
  }

  clearBtn.addEventListener('click', () => {
    if (!textarea.value) {
      showFeedback('지울 내용이 없습니다.');
      return;
    }
    if (!clearArmed) {
      clearArmed = true;
      clearBtn.textContent = '정말 지울까요?';
      clearBtn.classList.add('btn--danger');
      clearTimer = setTimeout(resetClearButton, 4000);
      return;
    }
    resetClearButton();
    onClear();
    textarea.focus();
    showFeedback('입력 내용을 지웠습니다.');
  });

  function update(state) {
    if (textarea.value !== state.text) {
      textarea.value = state.text;
    }
    if (clearArmed && !state.text) resetClearButton();
    textarea.classList.toggle('editor__textarea--over', state.result.status === 'over');
  }

  return { el, update, focus: () => textarea.focus() };
}

/** 클립보드 복사. navigator.clipboard가 없으면 선택 방식으로 대체한다. */
async function copyToClipboard(text, textarea) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* 아래 대체 경로로 진행 */
  }
  try {
    textarea.select();
    const ok = document.execCommand('copy');
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    return ok;
  } catch {
    return false;
  }
}
