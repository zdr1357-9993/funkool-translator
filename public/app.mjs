import {expand,messages} from './logic.mjs';
const el = id => document.getElementById(id);
const examples={words:['오늘은 야근을 안 할 수도 있어.','Tomorrow might be sunny.','明日は休みです。'],code:['3!','3 × 3','for (let i = 0; i < 10; i++) { console.log(i); }']};
let mode='words', index=0, pipe;
const hint=()=>{el('status').textContent=mode==='code'?'수식과 예시 형식의 JavaScript 반복문을 지원합니다.':({browser:'첫 번역 시 모델 파일을 다운로드합니다. 기기에 따라 시간이 걸립니다.',cloud:'Cloudflare Worker 배포본에서 사용할 수 있습니다.',deck:'AI DECK 로컬 실행본 또는 SSH 터널에서 사용할 수 있습니다.'})[el('engine').value]};
for(const key of ['words','code']) el(key).onclick=()=>{
  mode=key; index=0; el('input').value=examples[key][0]; el('output').textContent=key==='code'?'“3 × 3 = 3 + 3 + 3”':'“정시에 퇴근하려면, 정시에 퇴근하는 것이 중요합니다.”';
  for(const id of ['words','code']) el(id).setAttribute('aria-pressed',String(key===id));
  for(const id of ['engine','lang']) el(id).hidden=key==='code';
  hint();
};
el('example').onclick=()=>{index=(index+1)%examples[mode].length;el('input').value=examples[mode][index]};
el('engine').onchange=hint;
el('run').onclick=async()=>{
  const input=el('input').value.trim(), engine=el('engine').value;
  if(!input){el('status').textContent='원문을 입력해 주세요.';return}
  const controls=document.querySelectorAll('button,select,textarea');
  controls.forEach(x=>x.disabled=true);
  const start=performance.now();el('output').textContent='';el('status').textContent='발언 준비 중…';
  try{
    let result;
    if(mode==='code') result=expand(input);
    else if(engine==='browser'){
      const {pipeline,env}=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2/dist/transformers.min.js');
      env.allowLocalModels=false;
      pipe??=await pipeline('text-generation','onnx-community/Qwen2.5-0.5B-Instruct',{dtype:'q4',device:'wasm',progress_callback:p=>{if(p.file)el('status').textContent='모델 준비 중 · '+p.file}});
      el('status').textContent='발언 생성 중…';
      const [out]=await pipe(messages(input,el('lang').value),{max_new_tokens:128,return_full_text:false,do_sample:false});
      result=Array.isArray(out.generated_text)?out.generated_text.at(-1).content:out.generated_text;
    } else {
      const r=await fetch('./api/'+engine,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({input,lang:el('lang').value}),signal:AbortSignal.timeout(180000)});
      if(!r.headers.get('content-type')?.includes('application/json'))throw Error('이 실행본에 선택한 모델이 연결되지 않았습니다.');
      const data=await r.json();if(!r.ok)throw Error(data.error);result=data.text;
    }
    if(!result?.trim())throw Error('모델이 빈 답변을 반환했습니다.');
    const clean=result.trim().replace(/^[“"]([\s\S]*)[”"]$/, '$1');
    el('output').textContent='“'+clean+'”';
    el('output').scrollIntoView({block:'nearest'});el('status').textContent='완료 · '+((performance.now()-start)/1000).toFixed(1)+'초';
  }catch(e){el('status').textContent='변환 실패 · '+e.message}finally{controls.forEach(x=>x.disabled=false)}
};

