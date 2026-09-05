import { SOURCE } from '../../constants/neisLimits.js';

export function createFooter() {
  const el = document.createElement('footer');
  el.className = 'site-footer';
  el.innerHTML = `
    <div class="container site-footer__inner">
      <p class="site-footer__privacy">
        입력한 내용은 서버로 전송되지 않습니다.
        자동 저장 기능 사용 시 현재 브라우저의 localStorage에만 저장됩니다.
      </p>
      <p class="site-footer__disclaimer">
        이 사이트는 NEIS·교육부·KERIS의 공식 서비스가 아닌 비공식 도구입니다.
        최종 Byte는 반드시 NEIS에서 확인하세요.
      </p>
      <p class="site-footer__meta">
        기준 출처: ${SOURCE.label} · 마지막 업데이트 ${SOURCE.lastCheckedAt}
      </p>
    </div>
  `;
  return { el };
}
