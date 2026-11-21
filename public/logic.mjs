export function expand(input) {
  const s = input.trim();
  const fact = /^(\d{1,2})!$/.exec(s);
  if (fact && +fact[1] <= 12) {
    return Array.from({length:+fact[1]}, (_, i) => +fact[1]-i).join(' × ') || '1';
  }
  const prod = /^(\d{1,4})\s*[*×x]\s*(\d{1,2})$/.exec(s);
  if (prod && +prod[2] <= 30) return Array(+prod[2]).fill(String(+prod[1])).join(' + ') || '0';
  const loop = /^for\s*\(let i = 0; i < (\d{1,3}); i\+\+\)\s*\{\s*console\.log\(i\);?\s*\}$/.exec(s);
  if (loop) return 'for (let i = 0; i < '+loop[1]+'; ) {\n  console.log(i);\n  // 한 번 증가시키기 위해 한 번 반복합니다.\n  for (let once = 0; once < 1; once++) {\n    i++;\n  }\n}';
  throw Error('예시처럼 0~12의 팩토리얼, 작은 정수 곱셈(반복 30회까지), 또는 console.log(i) 반복문을 넣어 주세요.');
}
export function messages(input,lang){
  return [{role:'system',content:'Rewrite the input as a deadpan, tautological press conference in '+lang+'. Preserve facts, negation, and uncertainty. Return only one or two sentences. Examples: 정시에 퇴근한다 → 정시에 퇴근하기 위해 정시에 퇴근할 생각입니다. / I may leave early → I may leave early, because leaving early remains a possibility. / 明日は休みです → 明日休む理由は、明日が休みだからです。'},{role:'user',content:input}];
}
