/** NEIS Byte 계산 기준 안내 */
export function createByteGuide() {
  const el = document.createElement('section');
  el.className = 'card';
  el.id = 'byte-guide';
  el.innerHTML = `
    <h2 class="card__title">NEIS Byte 계산 기준</h2>
    <p class="card__lead">
      NEIS는 글자 수가 아니라 Byte로 입력 한도를 계산합니다.
      같은 500자라도 한글과 영문이 차지하는 Byte가 다릅니다.
    </p>
    <div class="table-wrap">
      <table class="table">
        <caption class="sr-only">문자 종류별 Byte</caption>
        <thead>
          <tr><th scope="col">문자 종류</th><th scope="col">Byte</th><th scope="col">예시</th></tr>
        </thead>
        <tbody>
          <tr><td>한글</td><td>3Byte</td><td>가, 나, 다</td></tr>
          <tr><td>영문</td><td>1Byte</td><td>a, B, z</td></tr>
          <tr><td>숫자</td><td>1Byte</td><td>0, 1, 9</td></tr>
          <tr><td>기호·문장부호</td><td>1Byte</td><td>. , ! ( )</td></tr>
          <tr><td>공백(스페이스)</td><td>1Byte</td><td>&nbsp;</td></tr>
          <tr><td>줄바꿈(Enter)</td><td>1Byte</td><td>↵</td></tr>
          <tr><td>한자·전각기호</td><td>3Byte</td><td>學, ￦</td></tr>
        </tbody>
      </table>
    </div>
    <p class="card__note">
      한글만 1,500Byte를 채우면 약 500자입니다.
      영문·숫자가 섞이면 같은 1,500Byte에 더 많은 글자를 담을 수 있습니다.
    </p>
  `;
  return { el };
}
