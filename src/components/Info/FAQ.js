export const FAQ_ITEMS = [
  {
    question: '줄바꿈(Enter)도 Byte에 포함되나요?',
    answer:
      '포함됩니다. 줄바꿈 1회는 1Byte로 계산합니다. 문단을 자주 나누면 그만큼 Byte가 늘어나므로, 한도가 빠듯할 때는 줄바꿈 수도 함께 확인하세요.',
  },
  {
    question: '공백(띄어쓰기)도 Byte를 차지하나요?',
    answer: '네, 스페이스 1칸은 1Byte입니다. 이 계산기는 공백 포함 글자수와 제외 글자수를 함께 보여줍니다.',
  },
  {
    question: '세특 1,500Byte는 몇 글자인가요?',
    answer:
      '한글만 사용하면 약 500자입니다. 한글 1자가 3Byte이기 때문입니다. 영문·숫자·기호는 1Byte라서 이들이 섞이면 500자보다 더 많이 쓸 수 있습니다.',
  },
  {
    question: '계산 결과가 NEIS와 조금 다를 수 있나요?',
    answer:
      'NEIS 화면·브라우저 설정에 따라 줄바꿈 처리 등에서 1~2Byte 차이가 날 수 있습니다. 한도에 아주 근접한 경우에는 여유를 조금 두고 작성한 뒤 NEIS에서 최종 확인하는 것을 권장합니다.',
  },
  {
    question: '입력한 내용이 서버로 전송되나요?',
    answer:
      '전송되지 않습니다. 모든 계산은 브라우저 안에서만 이루어집니다. 자동 저장을 켠 경우에도 내용은 현재 브라우저의 localStorage에만 저장되며, 자동 저장을 끄거나 "저장된 내용 삭제"를 누르면 즉시 지워집니다.',
  },
  {
    question: '항목별 한도가 바뀌면 어떻게 하나요?',
    answer:
      '학년도·학교급에 따라 기준이 달라질 수 있습니다. 표에 표시된 마지막 확인 날짜와 출처를 함께 확인하고, 다른 값이 필요하면 "직접 설정"으로 최대 Byte를 직접 입력해 사용하세요.',
  },
];

/** 자주 묻는 질문 */
export function createFAQ() {
  const el = document.createElement('section');
  el.className = 'card';
  el.id = 'faq';
  el.innerHTML = `
    <h2 class="card__title">자주 묻는 질문</h2>
    <div class="faq">
      ${FAQ_ITEMS.map(
        (item) => `
        <details class="faq__item">
          <summary class="faq__q">${item.question}</summary>
          <p class="faq__a">${item.answer}</p>
        </details>`
      ).join('')}
    </div>
  `;
  return { el };
}
