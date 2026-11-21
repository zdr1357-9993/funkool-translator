import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {messages} from './public/logic.mjs';
const assets={'/portrait.jpg':'portrait.jpg','/':'index.html','/app.mjs':'app.mjs','/logic.mjs':'logic.mjs'};
http.createServer(async(req,res)=>{
  const json=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(data))};
  try{
    if(req.method==='GET' && Object.hasOwn(assets,req.url)){
      const file=assets[req.url];res.setHeader('Content-Type',file.endsWith('jpg')?'image/jpeg':file.endsWith('html')?'text/html; charset=utf-8':'text/javascript');res.end(await readFile(new URL('./public/'+file,import.meta.url)));return;
    }
    if(req.url!=='/api/deck'||req.method!=='POST')return json(404,{error:'이 실행본에서는 AI DECK 모델을 선택해 주세요.'});
    if(req.headers['content-type']!=='application/json')return json(415,{error:'JSON required'});
    let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>6000)return json(413,{error:'입력이 너무 깁니다.'})}
    const {input,lang}=JSON.parse(raw);
    if(typeof input!=='string'||!input.trim()||input.length>800||!['한국어','日本語','English'].includes(lang))return json(400,{error:'입력을 확인해 주세요.'});
    const r=await fetch(new URL('/api/chat',process.env.OLLAMA_HOST_URL||'http://127.0.0.1:11434'),{method:'POST',body:JSON.stringify({model:'qwen3.5:9b',messages:messages(input,lang),think:false,stream:false,options:{num_predict:160}}),signal:AbortSignal.timeout(175000)});
    if(!r.ok)throw Error();json(200,{text:(await r.json()).message.content});
  }catch{json(502,{error:'Ollama 연결과 qwen3.5:9b 설치 상태를 확인해 주세요.'})}
}).listen(Number(process.env.PORT||8787),'127.0.0.1');
