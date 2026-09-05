import { createHeader } from './components/Layout/Header.js';
import { createFooter } from './components/Layout/Footer.js';
import { createCounter } from './components/Counter/Counter.js';
import { createByteGuide } from './components/Info/ByteGuide.js';
import { createLimitTable } from './components/Info/LimitTable.js';
import { createFAQ, FAQ_ITEMS } from './components/Info/FAQ.js';

function mount() {
  const root = document.getElementById('root');
  if (!root) return;

  const header = createHeader();

  const main = document.createElement('main');
  main.className = 'container main';
  main.innerHTML = `
    <div class="hero">
      <h1 class="hero__title">나이스 글자수 계산기</h1>
      <p class="hero__desc">
        생기부 세특·창의적 체험활동 내용을 붙여넣으면 NEIS 기준 Byte를 즉시 계산합니다.
        입력 내용은 서버로 전송되지 않습니다.
      </p>
    </div>
  `;

  const counter = createCounter();
  main.append(counter.el);

  const content = document.createElement('div');
  content.className = 'content';
  content.append(createByteGuide().el, createLimitTable().el, createFAQ().el);
  main.append(content);

  root.append(header.el, main, createFooter().el);

  injectFaqStructuredData();
}

/** 검색 결과에 FAQ가 노출되도록 구조화 데이터를 넣는다. */
function injectFaqStructuredData() {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  });
  document.head.append(script);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount, { once: true });
} else {
  mount();
}
