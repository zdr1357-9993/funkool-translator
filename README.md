# 펀쿨섹 번역소
Node 22 이상에서 node server.mjs 실행 후 http://127.0.0.1:8787 접속. 문장 모드 기본값은 브라우저에서 실행되는 무료 Qwen 0.5B다. 첫 실행에는 인터넷이 필요하다. 코드·수식 모드는 브라우저 규칙만 사용한다.
## GitHub Pages
public 폴더 내용을 Pages 배포 루트에 올린다. 무료 브라우저 모델과 코드 모드를 지원한다.
## Cloudflare 무료 모델
Workers Free 계정에서 npx wrangler login 후 이 디렉터리에서 npx wrangler deploy 실행. 배포 주소에서 Cloudflare AI 선택. 무료 할당량은 계정 단위다.
## AI DECK
Ollama가 맥에서 접근 가능한 경우 node server.mjs를 실행하고 AI DECK 모드를 고른다. 원격 서버의 Ollama가 루프백에서 실행 중이면 별도 터미널에서 ssh -N -L 11434:127.0.0.1:11434 서버별칭 으로 연결한다. Windows 호스트와 WSL의 루프백이 분리된 환경에서는 SSH 포워딩 대상에 WSL에서 접근 가능한 Ollama 주소를 사용한다. OLLAMA_HOST_URL로 로컬 프록시의 목적지도 설정할 수 있다.
