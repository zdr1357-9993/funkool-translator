import {messages} from './public/logic.mjs';
export default {async fetch(req,env){
  const path=new URL(req.url).pathname;
  if(!path.startsWith('/api/'))return env.ASSETS.fetch(req);
  if(path!='/api/cloud'||req.method!=='POST')return Response.json({error:'이 배포본에서는 Cloudflare AI를 선택해 주세요.'},{status:404});
  try{
    const {input,lang}=await req.json();
    if(typeof input!=='string'||!input.trim()||input.length>800||!['한국어','日本語','English'].includes(lang))return Response.json({error:'입력을 확인해 주세요.'},{status:400});
    const out=await env.AI.run('@cf/meta/llama-3.1-8b-instruct-fp8-fast',{messages:messages(input,lang),max_tokens:160});
    return Response.json({text:out.response});
  }catch{return Response.json({error:'AI 요청 실패. 무료 한도와 모델 연결을 확인해 주세요.'},{status:503})}
}};
