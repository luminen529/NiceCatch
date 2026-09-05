import { calculateNeisBytes } from '../../utils/calculateNeisBytes.js';
import {
  CUSTOM_LIMIT,
  CUSTOM_LIMIT_ID,
  DEFAULT_LIMIT_ID,
  findLimitById,
} from '../../constants/neisLimits.js';
import { createStorageEntry, debounce, storageAvailable } from '../../hooks/useLocalStorage.js';
import { createLimitSelector } from './LimitSelector.js';
import { createTextInput } from './TextInput.js';
import { createResultPanel } from './ResultPanel.js';

const store = {
  text: createStorageEntry('text', ''),
  limitId: createStorageEntry('limitId', DEFAULT_LIMIT_ID),
  customBytes: createStorageEntry('customBytes', CUSTOM_LIMIT.defaultBytes),
  autoSave: createStorageEntry('autoSave', true),
};

/** 계산기 전체를 구성한다. 상태는 이 모듈이 단독으로 소유한다. */
export function createCounter() {
  const state = {
    text: '',
    selectedId: normalizeLimitId(store.limitId.read()),
    customBytes: normalizeCustomBytes(store.customBytes.read()),
    autoSave: storageAvailable ? store.autoSave.read() !== false : false,
    lastSavedAt: null,
    restoredFromStorage: false,
    result: null,
  };

  if (state.autoSave) {
    const saved = store.text.read();
    state.text = typeof saved === 'string' ? saved : '';
    if (state.text) state.restoredFromStorage = true;
  }

  const el = document.createElement('div');
  el.className = 'counter';

  const limitSelector = createLimitSelector({
    selectedId: state.selectedId,
    customBytes: state.customBytes,
    onSelect: (id) => {
      state.selectedId = id;
      store.limitId.write(id);
      render();
    },
    onCustomBytesChange: (bytes) => {
      state.customBytes = bytes;
      store.customBytes.write(bytes);
      render();
    },
  });

  const textInput = createTextInput({
    value: state.text,
    onInput: (value) => {
      state.text = value;
      render();
      scheduleSave();
    },
    onClear: () => {
      state.text = '';
      render();
      saveNow();
    },
  });

  const resultPanel = createResultPanel();
  const autoSaveBar = createAutoSaveBar({
    onToggle: (enabled) => {
      state.autoSave = enabled;
      store.autoSave.write(enabled);
      if (enabled) {
        saveNow();
      } else {
        scheduleSave.cancel();
        store.text.remove();
        state.lastSavedAt = null;
        state.restoredFromStorage = false;
      }
      render();
    },
    onDelete: () => {
      scheduleSave.cancel();
      store.text.remove();
      state.lastSavedAt = null;
      state.restoredFromStorage = false;
      render();
    },
  });

  el.append(limitSelector.el, textInput.el, resultPanel.el, autoSaveBar.el);

  const saveNow = () => {
    if (!state.autoSave) return;
    if (store.text.write(state.text)) {
      state.lastSavedAt = new Date();
      state.restoredFromStorage = false;
      autoSaveBar.update(state);
    }
  };

  const scheduleSave = debounce(saveNow, 500);

  // 탭을 닫거나 백그라운드로 보낼 때 마지막 입력을 잃지 않도록 한다.
  window.addEventListener('pagehide', () => scheduleSave.flush());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') scheduleSave.flush();
  });

  function getMaxBytes() {
    if (state.selectedId === CUSTOM_LIMIT_ID) return state.customBytes;
    return findLimitById(state.selectedId).maxBytes;
  }

  function render() {
    state.result = calculateNeisBytes(state.text, getMaxBytes());
    limitSelector.update(state);
    textInput.update(state);
    resultPanel.update(state);
    autoSaveBar.update(state);
  }

  render();

  return { el, focus: textInput.focus };
}

function normalizeLimitId(id) {
  return findLimitById(typeof id === 'string' ? id : DEFAULT_LIMIT_ID).id;
}

function normalizeCustomBytes(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return CUSTOM_LIMIT.defaultBytes;
  return Math.min(Math.max(Math.trunc(num), CUSTOM_LIMIT.min), CUSTOM_LIMIT.max);
}

/** 자동 저장 상태 표시 + ON/OFF + 저장 내용 삭제 */
function createAutoSaveBar({ onToggle, onDelete }) {
  const el = document.createElement('section');
  el.className = 'autosave';
  el.innerHTML = `
    <label class="autosave__toggle">
      <input type="checkbox" data-role="toggle" />
      <span>브라우저에 자동 저장</span>
    </label>
    <p class="autosave__status" data-role="status"></p>
    <button type="button" class="btn btn--ghost btn--sm" data-role="delete">저장된 내용 삭제</button>
  `;

  const toggle = el.querySelector('[data-role="toggle"]');
  const statusEl = el.querySelector('[data-role="status"]');
  const deleteBtn = el.querySelector('[data-role="delete"]');

  toggle.addEventListener('change', () => onToggle(toggle.checked));
  deleteBtn.addEventListener('click', () => onDelete());

  if (!storageAvailable) {
    toggle.disabled = true;
    deleteBtn.disabled = true;
  }

  function update(state) {
    toggle.checked = state.autoSave;
    deleteBtn.disabled = !storageAvailable || !state.autoSave;

    if (!storageAvailable) {
      statusEl.textContent = '이 브라우저에서는 자동 저장을 사용할 수 없습니다.';
      return;
    }
    if (!state.autoSave) {
      statusEl.textContent = '자동 저장이 꺼져 있습니다. 새로고침하면 내용이 사라집니다.';
      return;
    }
    if (state.lastSavedAt) {
      statusEl.textContent = `마지막 저장 ${formatTime(
        state.lastSavedAt
      )} · 이 브라우저에만 저장됩니다.`;
    } else if (state.restoredFromStorage) {
      statusEl.textContent = '이전에 저장된 내용을 불러왔습니다. 이 브라우저에만 저장됩니다.';
    } else {
      statusEl.textContent = '입력하면 이 브라우저에만 자동으로 저장됩니다.';
    }
  }

  return { el, update };
}

function formatTime(date) {
  return new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit' }).format(date);
}
