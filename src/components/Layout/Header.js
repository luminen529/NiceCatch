import { STANDARD_YEAR } from '../../constants/neisLimits.js';

export function createHeader() {
  const el = document.createElement('header');
  el.className = 'site-header';
  el.innerHTML = `
    <div class="container site-header__inner">
      <a class="brand" href="./">
        <span class="brand__mark" aria-hidden="true">B</span>
        <span class="brand__name">나이스 글자수 계산기</span>
      </a>
      <span class="site-header__year">${STANDARD_YEAR}학년도 기준</span>
    </div>
  `;
  return { el };
}
