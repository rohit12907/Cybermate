/* ── THEME SWITCHER LOGIC ── */
function setTheme(theme) {
  document.body.className = '';
  document.body.classList.add('theme-' + theme);
  document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector('.theme-btn-' + theme);
  if (activeBtn) activeBtn.classList.add('active');
  localStorage.setItem('cybermate-theme', theme);
}
// Load saved theme on boot
(()=>{
  const savedTheme = localStorage.getItem('cybermate-theme') || 'cyberpunk';
  setTheme(savedTheme);
})();

/* ── BG PARTICLES ── */
(()=>{
  const c=document.getElementById('bgc'),x=c.getContext('2d');
  let W,H,ps=[];
  const rz=()=>{W=c.width=innerWidth;H=c.height=innerHeight;};
  rz();addEventListener('resize',rz);
  for(let i=0;i<70;i++)ps.push({x:Math.random()*1920,y:Math.random()*1080,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.1+.3,a:Math.random()*.4+.08});
  const lp=()=>{
    x.clearRect(0,0,W,H);
    for(const p of ps){
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      x.beginPath();x.arc(p.x,p.y,p.r,0,Math.PI*2);x.fillStyle=`rgba(0,212,255,${p.a})`;x.fill();
    }
    for(let i=0;i<ps.length;i++)for(let j=i+1;j<ps.length;j++){
      const d=Math.hypot(ps[i].x-ps[j].x,ps[i].y-ps[j].y);
      if(d<90){x.beginPath();x.moveTo(ps[i].x,ps[i].y);x.lineTo(ps[j].x,ps[j].y);x.strokeStyle=`rgba(0,212,255,${.06*(1-d/90)})`;x.lineWidth=.4;x.stroke();}
    }
    requestAnimationFrame(lp);
  };lp();
})();

/* ── INTRO PARTICLES ── */
(()=>{
  const c=document.getElementById('ptc'),x=c.getContext('2d');
  let W,H;
  const rz=()=>{W=c.width=innerWidth;H=c.height=innerHeight;};
  rz();addEventListener('resize',rz);
  const ps=[];
  for(let i=0;i<35;i++)ps.push({x:Math.random()*1920,y:Math.random()*1080,vx:(Math.random()-.5)*.7,vy:(Math.random()-.5)*.7,r:Math.random()*1.8+.4,a:Math.random()*.25+.08,col:Math.random()>.5?'0,212,255':'0,255,136'});
  const lp=()=>{
    x.clearRect(0,0,W,H);
    for(const p of ps){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;x.beginPath();x.arc(p.x,p.y,p.r,0,Math.PI*2);x.fillStyle=`rgba(${p.col},${p.a})`;x.fill();}
    requestAnimationFrame(lp);
  };lp();
})();

/* ── INTRO SEQUENCE ── */
function __cmIntroSequence(){
  setTimeout(()=>{document.getElementById('cmt').classList.add('rv');document.getElementById('ctag').style.opacity='1';},500);
  ['w1','w2','w3','w4'].forEach((id,i)=>setTimeout(()=>document.getElementById(id).classList.add('sh'),1700+i*380));
  setTimeout(()=>{
    const sl=document.getElementById('sl');sl.style.opacity='1';
    sl.animate([{top:'-4px'},{top:'100vh'}],{duration:1300,easing:'ease-in',fill:'forwards'}).onfinish=()=>sl.style.opacity='0';
  },3500);
  setTimeout(()=>document.getElementById('ssbtn').classList.add('sh'),4100);
}
/* React mounts this script after the document (and usually the window 'load'
   event) has already fired, so we run immediately if we missed it, and still
   listen for 'load' as a fallback for the rare case we didn't. */
if (document.readyState === 'complete') {
  __cmIntroSequence();
} else {
  addEventListener('load', __cmIntroSequence, { once: true });
}

/* ── SCREENS ── */
function showScr(id){document.querySelectorAll('.screen').forEach(s=>s.classList.add('hidden'));const el=document.getElementById(id);el.classList.remove('hidden');if(id==='nlscr')runNL();}
function goMenu(){showScr('menu');}
function goNL(){showScr('nlscr');}

/* ── NORMAL LOG ── */
function runNL(){
  const bar=document.getElementById('sbi'),log=document.getElementById('slg'),res=document.getElementById('sr');
  bar.style.width='0';log.innerHTML='';res.style.display='none';
  const msgs=[
    [280,'<span class="ok">[OK]</span> Initializing CyberMate log scanner...'],
    [680,'<span class="ok">[OK]</span> Loading /var/log/auth.log...'],
    [1050,'<span class="ok">[OK]</span> Loading /var/log/syslog...'],
    [1430,'<span class="ok">[OK]</span> Checking fail2ban status...'],
    [1820,'<span class="ok">[OK]</span> Analyzing SSH attempts (last 24h)...'],
    [2300,'<span class="ok">[OK]</span> Cross-referencing AbuseIPDB feed...'],
    [2750,'<span class="ok">[OK]</span> Querying AlienVault OTX for IOCs...'],
    [3200,'<span class="ok">[OK]</span> Running anomaly detection models...'],
    [3700,'<span class="ok">[OK]</span> Verifying firewall rules integrity...'],
    [4100,'<span class="ok">[OK]</span> Scan complete — no threats detected.'],
  ];
  let p=0;const iv=setInterval(()=>{p=Math.min(p+2,100);bar.style.width=p+'%';if(p>=100)clearInterval(iv);},38);
  msgs.forEach(([t,m])=>setTimeout(()=>{log.innerHTML+=m+'<br>';},t));
  setTimeout(()=>{res.style.display='block';},4700);
}

/* ── PIPELINE NODES DEFINITION ── */
// Layout: horizontal flow across laptop screen
// Positions are percentages of screen (x%, y%)
const NODES=[
  {id:'n0',label:'ATTACK DETECTION',sub:'ENGINE',x:.12,y:.42,col:'#ff3366'},
  {id:'n1',label:'WATCHER',sub:'AGENT',x:.25,y:.22,col:'#ff9500'},
  {id:'n2',label:'THREAT',sub:'INTELLIGENCE',x:.25,y:.65,col:'#a855f7'},
  {id:'n3',label:'RISK',sub:'ANALYZER',x:.38,y:.42,col:'#ffd700'},
  {id:'n4',label:'AGENT 1',sub:'DETECTION',x:.51,y:.14,col:'#00d4ff'},
  {id:'n5',label:'AGENT 2',sub:'CORRELATION',x:.51,y:.38,col:'#00bfff'},
  {id:'n6',label:'AGENT 3',sub:'RESPONSE',x:.51,y:.62,col:'#00ff88'},
  {id:'n7',label:'AGENT 4',sub:'NOTIFY',x:.51,y:.84,col:'#a855f7'},
  {id:'n8',label:'BACKEND',sub:'ENGINE',x:.67,y:.30,col:'#00d4ff'},
  {id:'n9',label:'COMMS',sub:'CENTER',x:.67,y:.68,col:'#00ff88'},
];
const CONNECTIONS=[[0,1],[0,2],[1,3],[2,3],[3,4],[3,5],[3,6],[3,7],[4,8],[5,8],[6,8],[7,9],[8,9]];

/* ── NODE SVG LOGOS ── */
function nodeSVG(i,col,size=64){
  const s=size,h=s/2;
  const svgs=[
    // 0 Attack Detection - shield + lightning bolt
    `<svg width="${s}" height="${s}" viewBox="0 0 64 64"><defs><filter id="f0"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="32" cy="32" r="30" stroke="${col}" stroke-width="1" opacity=".2" fill="none"/><path d="M32 4L54 15L54 36C54 49 44 59 32 63C20 59 10 49 10 36L10 15Z" stroke="${col}" stroke-width="1.8" fill="${col}12"/><path d="M32 16L27 30H34L26 48L46 28H37L41 16Z" fill="${col}"/><circle cx="32" cy="32" r="4" fill="${col}" opacity=".25"><animate attributeName="r" values="4;12;4" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values=".25;0;.25" dur="2s" repeatCount="indefinite"/></circle></svg>`,
    // 1 Watcher - eye
    `<svg width="${s}" height="${s}" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" stroke="${col}" stroke-width="1" opacity=".2" fill="none"/><ellipse cx="32" cy="32" rx="22" ry="13" stroke="${col}" stroke-width="2" fill="${col}10"/><circle cx="32" cy="32" r="9" stroke="${col}" stroke-width="2" fill="${col}1a"/><circle cx="32" cy="32" r="4" fill="${col}"/><circle cx="34" cy="30" r="1.5" fill="white" opacity=".7"/><path d="M10 32 C18 20 46 20 54 32" stroke="${col}" stroke-width=".8" opacity=".3" stroke-dasharray="3,3"/><circle cx="32" cy="32" r="14" stroke="${col}" stroke-width=".5" opacity=".2" fill="none"><animate attributeName="r" values="14;20;14" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values=".2;0;.2" dur="3s" repeatCount="indefinite"/></circle></svg>`,
    // 2 Threat Intel - network constellation
    `<svg width="${s}" height="${s}" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" stroke="${col}" stroke-width="1" opacity=".2" fill="none"/><circle cx="32" cy="32" r="5" fill="${col}"/><circle cx="14" cy="18" r="3.5" fill="${col}" opacity=".7"/><circle cx="50" cy="18" r="3.5" fill="${col}" opacity=".7"/><circle cx="14" cy="46" r="3.5" fill="${col}" opacity=".7"/><circle cx="50" cy="46" r="3.5" fill="${col}" opacity=".7"/><circle cx="32" cy="8" r="3" fill="${col}" opacity=".5"/><circle cx="32" cy="56" r="3" fill="${col}" opacity=".5"/><line x1="32" y1="32" x2="14" y2="18" stroke="${col}" stroke-width="1.2" opacity=".6"/><line x1="32" y1="32" x2="50" y2="18" stroke="${col}" stroke-width="1.2" opacity=".6"/><line x1="32" y1="32" x2="14" y2="46" stroke="${col}" stroke-width="1.2" opacity=".6"/><line x1="32" y1="32" x2="50" y2="46" stroke="${col}" stroke-width="1.2" opacity=".6"/><line x1="32" y1="32" x2="32" y2="8" stroke="${col}" stroke-width="1" opacity=".4"/><line x1="32" y1="32" x2="32" y2="56" stroke="${col}" stroke-width="1" opacity=".4"/><line x1="14" y1="18" x2="50" y2="46" stroke="${col}" stroke-width=".6" opacity=".2"/><line x1="50" y1="18" x2="14" y2="46" stroke="${col}" stroke-width=".6" opacity=".2"/></svg>`,
    // 3 Risk Analyzer - gauge
    `<svg width="${s}" height="${s}" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" stroke="${col}" stroke-width="1" opacity=".2" fill="none"/><path d="M10 40 A22 22 0 0 1 54 40" stroke="#1a3a4a" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M10 40 A22 22 0 0 1 54 40" stroke="${col}" stroke-width="7" stroke-linecap="round" fill="none" stroke-dasharray="55 70" opacity=".9"/><defs><linearGradient id="rg3"><stop offset="0%" stop-color="#00ff88"/><stop offset="60%" stop-color="#ffd700"/><stop offset="100%" stop-color="#ff3366"/></linearGradient></defs><line x1="32" y1="40" x2="46" y2="22" stroke="${col}" stroke-width="2.2" stroke-linecap="round"/><circle cx="32" cy="40" r="4" fill="${col}"/><text x="32" y="54" text-anchor="middle" font-family="Orbitron,monospace" font-size="7" fill="${col}" opacity=".8">RISK</text></svg>`,
    // 4 Agent 1 - magnifier
    `<svg width="${s}" height="${s}" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" stroke="${col}" stroke-width="1" opacity=".2" fill="none"/><circle cx="27" cy="27" r="14" stroke="${col}" stroke-width="2.5" fill="${col}12"/><circle cx="27" cy="27" r="8" stroke="${col}" stroke-width="1" opacity=".4" fill="none"/><line x1="37" y1="37" x2="52" y2="52" stroke="${col}" stroke-width="3.5" stroke-linecap="round"/><line x1="23" y1="27" x2="31" y2="27" stroke="${col}" stroke-width="1.5" opacity=".7"/><line x1="27" y1="23" x2="27" y2="31" stroke="${col}" stroke-width="1.5" opacity=".7"/></svg>`,
    // 5 Agent 2 - merge/converge
    `<svg width="${s}" height="${s}" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" stroke="${col}" stroke-width="1" opacity=".2" fill="none"/><circle cx="14" cy="16" r="4" fill="${col}" opacity=".7"/><circle cx="14" cy="32" r="4" fill="${col}" opacity=".7"/><circle cx="14" cy="48" r="4" fill="${col}" opacity=".7"/><path d="M18 16 Q32 16 32 32 Q32 48 18 48" stroke="${col}" stroke-width="1.5" fill="none" opacity=".6"/><line x1="32" y1="32" x2="50" y2="32" stroke="${col}" stroke-width="2.5" stroke-linecap="round"/><circle cx="50" cy="32" r="6" fill="${col}" opacity=".85"/><circle cx="50" cy="32" r="11" stroke="${col}" stroke-width="1" opacity=".25" fill="none"/></svg>`,
    // 6 Agent 3 - firewall/block
    `<svg width="${s}" height="${s}" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" stroke="${col}" stroke-width="1" opacity=".2" fill="none"/><rect x="9" y="22" width="46" height="20" rx="4" stroke="${col}" stroke-width="1.8" fill="${col}10"/><rect x="13" y="26" width="9" height="12" rx="2" fill="${col}" opacity=".75"/><rect x="27" y="26" width="9" height="12" rx="2" fill="${col}" opacity=".5"/><rect x="41" y="26" width="9" height="12" rx="2" fill="${col}" opacity=".3"/><line x1="32" y1="9" x2="32" y2="22" stroke="${col}" stroke-width="1.5" stroke-dasharray="3,2" opacity=".7"/><polygon points="28,9 36,9 32,3" fill="${col}" opacity=".8"/><path d="M32 42 L32 55" stroke="${col}" stroke-width="1.8" stroke-dasharray="3,2" opacity=".4"/><circle cx="32" cy="57" r="3" fill="${col}" opacity=".5"><animate attributeName="r" values="3;6;3" dur=".9s" repeatCount="indefinite"/><animate attributeName="opacity" values=".5;0;.5" dur=".9s" repeatCount="indefinite"/></circle></svg>`,
    // 7 Agent 4 - notification bell
    `<svg width="${s}" height="${s}" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" stroke="${col}" stroke-width="1" opacity=".2" fill="none"/><path d="M32 10C24 10 18 17 18 28L18 40L13 46L51 46L46 40L46 28C46 17 40 10 32 10Z" stroke="${col}" stroke-width="2" fill="${col}18"/><path d="M27 46C27 49 29 51 32 51C35 51 37 49 37 46" stroke="${col}" stroke-width="2" fill="none"/><circle cx="32" cy="10" r="3" fill="${col}"/><circle cx="52" cy="20" r="2.5" stroke="${col}" stroke-width="1.5" fill="none"><animate attributeName="r" values="2.5;7;2.5" dur="1.4s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0;1" dur="1.4s" repeatCount="indefinite"/></circle></svg>`,
    // 8 Backend - server rack
    `<svg width="${s}" height="${s}" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" stroke="${col}" stroke-width="1" opacity=".2" fill="none"/><rect x="11" y="13" width="42" height="11" rx="2.5" stroke="${col}" stroke-width="1.5" fill="${col}0d"/><rect x="11" y="27" width="42" height="11" rx="2.5" stroke="${col}" stroke-width="1.5" fill="${col}0d"/><rect x="11" y="41" width="42" height="11" rx="2.5" stroke="${col}" stroke-width="1.5" fill="${col}0d"/><circle cx="44" cy="18" r="2.2" fill="${col}" opacity=".9"/><circle cx="44" cy="32" r="2.2" fill="${col}" opacity=".7"/><circle cx="44" cy="46" r="2.2" fill="${col}" opacity=".5"/><rect x="14" y="15" width="22" height="7" rx="1" fill="${col}" opacity=".18"/><rect x="14" y="29" width="22" height="7" rx="1" fill="${col}" opacity=".18"/><rect x="14" y="43" width="22" height="7" rx="1" fill="${col}" opacity=".18"/></svg>`,
    // 9 Comms - broadcast tower
    `<svg width="${s}" height="${s}" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" stroke="${col}" stroke-width="1" opacity=".2" fill="none"/><line x1="32" y1="10" x2="32" y2="54" stroke="${col}" stroke-width="2.8" stroke-linecap="round"/><path d="M22 22 A14 14 0 0 0 42 22" stroke="${col}" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M15 15 A22 22 0 0 0 49 15" stroke="${col}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".6"/><path d="M8 8 A30 30 0 0 0 56 8" stroke="${col}" stroke-width="1" fill="none" stroke-linecap="round" opacity=".3"/><circle cx="32" cy="10" r="3.5" fill="${col}"><animate attributeName="r" values="3.5;7;3.5" dur="1.1s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;.2;1" dur="1.1s" repeatCount="indefinite"/></circle><polygon points="25,50 39,50 32,58" fill="${col}" opacity=".6"/></svg>`,
    // 10 SMS - message bubble
    `<svg width="${s}" height="${s}" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" stroke="${col}" stroke-width="1" opacity=".2" fill="none"/><rect x="10" y="18" width="44" height="28" rx="5" stroke="${col}" stroke-width="1.6" fill="${col}12"/><path d="M10 24 L22 30 L32 26 L42 30 L54 24" stroke="${col}" stroke-width="1.2" fill="none"/><line x1="18" y1="34" x2="32" y2="34" stroke="${col}" stroke-width="1" opacity=".4"/><line x1="18" y1="39" x2="46" y2="39" stroke="${col}" stroke-width="1" opacity=".25"/></svg>`,
    // 11 WhatsApp - speech bubble
    `<svg width="${s}" height="${s}" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" stroke="${col}" stroke-width="1" opacity=".2" fill="none"/><path d="M48 22 C48 16 42 12 32 12 C22 12 16 16 16 22 C16 26 20 30 24 32 L22 40 L30 36 C32 36 34 35 36 34 C41 34 46 30 48 26 Z" stroke="${col}" stroke-width="1.6" fill="${col}12"/><line x1="22" y1="24" x2="36" y2="24" stroke="${col}" stroke-width="1.2" opacity=".5" stroke-linecap="round"/><line x1="22" y1="29" x2="42" y2="29" stroke="${col}" stroke-width="1.2" opacity=".3" stroke-linecap="round"/></svg>`,
    // 12 Telegram - paper plane
    `<svg width="${s}" height="${s}" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" stroke="${col}" stroke-width="1" opacity=".2" fill="none"/><path d="M14 34 L28 40 L30 52 L38 32 L50 18 L14 34 L30 40 Z" stroke="${col}" stroke-width="1.5" fill="${col}18" stroke-linejoin="round"/><path d="M30 40 L38 32" stroke="${col}" stroke-width="1.5"/></svg>`,
    // 13 Email - envelope
    `<svg width="${s}" height="${s}" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" stroke="${col}" stroke-width="1" opacity=".2" fill="none"/><rect x="10" y="20" width="44" height="28" rx="4" stroke="${col}" stroke-width="1.6" fill="${col}12"/><path d="M10 24 L32 38 L54 24" stroke="${col}" stroke-width="1.3" fill="none" stroke-linejoin="round"/><line x1="10" y1="36" x2="22" y2="38" stroke="${col}" stroke-width=".8" opacity=".3"/><line x1="54" y1="36" x2="42" y2="38" stroke="${col}" stroke-width=".8" opacity=".3"/></svg>`,
  ];
  return svgs[i]||svgs[0];
}

/* ── PIPELINE CANVAS ── */
let pipeCanvas,pipeCtx,pipeW,pipeH;
const placedNodes=new Set();
const drawnConns=new Set();

function initPipeCanvas(){
  pipeCanvas=document.getElementById('pipe-canvas');
  pipeCtx=pipeCanvas.getContext('2d');
  pipeW=pipeCanvas.width=innerWidth;
  pipeH=pipeCanvas.height=innerHeight;
  animPipe();
}

function nodePos(i){return{x:NODES[i].x*pipeW,y:NODES[i].y*pipeH - 32};}

let pipeAnim=0;
function animPipe(){
  requestAnimationFrame(animPipe);
  if(!pipeCtx)return;
  pipeCtx.clearRect(0,0,pipeW,pipeH);
  pipeAnim+=0.5;
  // Node radius for edge detection (64px icon = 32px radius + padding)
  const pr=33;
  for(const key of drawnConns){
    const [fi,ti]=key.split('-').map(Number);
    const f=nodePos(fi),t=nodePos(ti);
    const col=NODES[ti].col;
    // Edge-to-edge
    const ep=edgePoints(f.x,f.y,t.x,t.y,pr);
    const fx=ep.sx,fy=ep.sy,tx=ep.ex,ty=ep.ey;
    // Glow layer
    pipeCtx.save();
    pipeCtx.beginPath();pipeCtx.moveTo(fx,fy);pipeCtx.lineTo(tx,ty);
    pipeCtx.strokeStyle=col+'18';pipeCtx.lineWidth=6;
    pipeCtx.stroke();
    // Dashed arrow
    pipeCtx.beginPath();pipeCtx.moveTo(fx,fy);pipeCtx.lineTo(tx,ty);
    pipeCtx.strokeStyle=col+'bb';pipeCtx.lineWidth=1.8;
    pipeCtx.setLineDash([7,5]);pipeCtx.lineDashOffset=-pipeAnim;
    pipeCtx.stroke();
    // Arrowhead
    const ang=Math.atan2(ty-fy,tx-fx);
    pipeCtx.setLineDash([]);
    pipeCtx.beginPath();
    pipeCtx.moveTo(tx,ty);
    pipeCtx.lineTo(tx-11*Math.cos(ang-0.4),ty-11*Math.sin(ang-0.4));
    pipeCtx.lineTo(tx-11*Math.cos(ang+0.4),ty-11*Math.sin(ang+0.4));
    pipeCtx.closePath();pipeCtx.fillStyle=col;pipeCtx.fill();
    // Data packet
    const pct=((pipeAnim/2)%60)/60;
    const bx=fx+pct*(tx-fx);
    const by=fy+pct*(ty-fy);
    pipeCtx.beginPath();pipeCtx.arc(bx,by,3.5,0,Math.PI*2);
    pipeCtx.fillStyle=col;pipeCtx.shadowBlur=14;pipeCtx.shadowColor=col;pipeCtx.fill();
    pipeCtx.shadowBlur=0;
    pipeCtx.restore();
  }
}

function placeNodeEl(idx){
  if(placedNodes.has(idx))return;
  placedNodes.add(idx);
  const n=NODES[idx];
  const sim=document.getElementById('sim');
  const el=document.createElement('div');
  el.className='pnode';el.id='pn'+idx;
  el.style.left=(n.x*pipeW-80)+'px';
  el.style.top=(n.y*pipeH-64)+'px';
  el.innerHTML=`
    <div class="pnode-logo" style="color:${n.col}">
      <div class="pnode-glow" style="background:${n.col}"></div>
      ${nodeSVG(idx,n.col)}
    </div>
    <div class="pnode-label" style="color:${n.col}">${n.label}</div>
    <div class="pnode-status" style="color:${n.col}">${n.sub}</div>
  `;
  sim.appendChild(el);
  requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('placed')));
  // Draw connections from previous placed nodes
  for(const [fi,ti] of CONNECTIONS){
    if(ti===idx && placedNodes.has(fi)){
      drawnConns.add(`${fi}-${ti}`);
    }
    if(fi===idx && placedNodes.has(ti)){
      drawnConns.add(`${fi}-${ti}`);
    }
  }
}

/* ── STAGE CONTENT ── */
function smsIco(s=24){return`<svg width="${s}" height="${s}" viewBox="0 0 36 36"><rect width="36" height="36" rx="9" fill="#3b82f6"/><rect x="7" y="11" width="22" height="14" rx="3" stroke="white" stroke-width="1.5" fill="none"/><path d="M7 16 L13 20 L18 17 L23 20 L29 16" stroke="white" stroke-width="1.2" fill="none"/></svg>`;}
function waIco(s=24){return`<svg width="${s}" height="${s}" viewBox="0 0 36 36"><rect width="36" height="36" rx="9" fill="#25d366"/><path d="M18 7C12 7 7 12 7 18C7 20 7.5 22 8.5 23.7L7 29L12.5 27.5C14.2 28.5 16 29 18 29C24 29 29 24 29 18C29 12 24 7 18 7ZM18 27C16.4 27 14.9 26.6 13.5 25.8L13.2 25.6L10.3 26.4L11.1 23.6L10.8 23.3C9.9 21.8 9.4 20.1 9.4 18.3C9.4 13.2 13.2 9.3 18 9.3C22.8 9.3 26.6 13.2 26.6 18C26.6 22.8 22.8 27 18 27Z" fill="white"/><path d="M14.5 13.5C14.3 13.5 14 13.6 13.7 14C13.3 14.4 12.2 15.5 12.2 17.8C12.2 20.1 13.8 22.3 14 22.6C14.2 22.8 17 27 21.2 25.1C23.6 24.1 24.5 22.1 24.6 21.8C24.7 21.5 24.7 20.6 24.3 20.3L23 19.6C22.8 19.5 22.5 19.4 22.2 19.8L21.3 20.9C21.1 21.1 20.9 21.2 20.6 21.1C20 20.8 18.5 20.2 17.2 18.8C15.8 17.3 15.4 16.5 15.3 16.3L16.3 15.3C16.5 15.1 16.5 14.8 16.5 14.6C16.4 14.3 15.7 12.9 15.5 12.6C15.2 12.3 15 12.2 14.8 12.2L14.5 13.5Z" fill="white"/></svg>`;}
function tgIco(s=24){return`<svg width="${s}" height="${s}" viewBox="0 0 36 36"><rect width="36" height="36" rx="9" fill="#2ca5e0"/><path d="M8 18C8 18 15 14.8 18.5 13.5C22 12.2 26.5 10.5 26.5 10.5L26 16C26 16 24 17 22 18.5C20 20 18 22 18 22L16 20L14 25L11 21L8 18Z" fill="white" opacity=".85"/><path d="M18 22L20 20L26 16L18 22Z" fill="white" opacity=".5"/><path d="M14 25L16 20L18 22L14 25Z" fill="white" opacity=".6"/></svg>`;}
function emIco(s=24){return`<svg width="${s}" height="${s}" viewBox="0 0 36 36"><rect width="36" height="36" rx="9" fill="#ea4335"/><rect x="7" y="11" width="22" height="15" rx="2" stroke="white" stroke-width="1.5" fill="none"/><path d="M7 13L18 21L29 13" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>`;}

const STAGES=[
  // 0 Attack Detection
  {col:'#ff3366',label:'ATTACK DETECTION ENGINE',sub:'PRIMARY THREAT DETECTION LAYER',
   html:()=>`
   <div class="sca" style="border-color:#ff336640"><h3>INCOMING ATTACK STREAM</h3>
     <div class="cnt" id="ac">0</div>
     <div class="svb"><div class="svf" id="svf" style="width:0%"></div></div>
     <div style="text-align:center;margin-top:10px"><span class="tag2 cr">BRUTE FORCE DETECTED</span></div>
   </div>
   <div class="sr2">
     <div class="sca" style="border-color:#ff336640"><h3>ATTACK METADATA</h3>
       <div class="dl"><span class="dk">Source IP</span><span class="dv r">185.220.101.47</span></div>
       <div class="dl"><span class="dk">Target User</span><span class="dv c">admin@domain.com</span></div>
       <div class="dl"><span class="dk">Protocol</span><span class="dv o">SSH / Port 22</span></div>
       <div class="dl"><span class="dk">Attack Type</span><span class="dv r">Credential Stuffing</span></div>
       <div class="dl"><span class="dk">Severity</span><span class="dv r">CRITICAL</span></div>
       <div class="dl"><span class="dk">ASN</span><span class="dv o">TOR Exit Node</span></div>
     </div>
     <div class="sca" style="border-color:#ff336640"><h3>DETECTION EVIDENCE</h3>
       <ul class="el">
         <li>1,247 failed auth attempts in 60s</li>
         <li>Sequential password dictionary patterns</li>
         <li>Geo-anomaly: Russia (baseline: India)</li>
         <li>IP flagged in AbuseIPDB (score 98%)</li>
         <li>Known TOR exit node range confirmed</li>
         <li>Attempt rate: 20.7/sec (normal: 0.1)</li>
       </ul>
     </div>
   </div>
   <div class="sca" style="border-color:#ff336640"><h3>ENGINE DECISION</h3>
     <p class="stx">The Attack Detection Engine flagged <strong>1,247 failed SSH attempts</strong> from <span style="color:var(--r)">185.220.101.47</span> — a TOR exit node — in 60 seconds at <strong>20.7× the anomaly threshold</strong>. Output: <span class="tag2 cr">ESCALATE</span> to Watcher Agent.</p>
   </div>`
  },
  // 1 Watcher Agent
  {col:'#ff9500',label:'WATCHER AGENT',sub:'CONTINUOUS SYSTEM MONITORING',
   html:()=>`
   <div class="sca" style="border-color:#ff950040"><h3>MONITORING SCOPE</h3>
     <div class="sr2">
       ${['Auth Logs','SSH Sessions','Network Traffic','Kernel Events','Fail2ban','Process Tree'].map(m=>`<div class="dl"><span class="dk">${m}</span><span class="dv g">● ACTIVE</span></div>`).join('')}
     </div>
   </div>
   <div class="sr2">
     <div class="sca" style="border-color:#ff950040"><h3>OBSERVED ANOMALIES</h3>
       <ul class="el">
         <li>sudo attempts: 3 in 2 min</li>
         <li>SSH spawned 1,247 threads</li>
         <li>CPU spike 94% on auth daemon</li>
         <li>auth.log write rate: 47 MB/s</li>
         <li>340 ECONNREFUSED kernel events</li>
       </ul>
     </div>
     <div class="sca" style="border-color:#ff950040"><h3>ESCALATION TRIGGERS</h3>
       <ul class="el">
         <li>Log write rate 470× baseline</li>
         <li>TOR exit node confirmed</li>
         <li>Multi-vector pattern detected</li>
         <li>Load average: 14.7 (threshold: 2.0)</li>
       </ul>
     </div>
   </div>
   <div class="sca" style="border-color:#ff950040"><h3>WATCHER DECISION</h3>
     <p class="stx">Confirmed active brute-force. Collected <strong>14 behavioral indicators</strong> spanning auth daemon, network layer, and kernel space. Evidence forwarded to <strong>Threat Intelligence</strong> and <strong>Risk Analyzer</strong> simultaneously.</p>
   </div>`
  },
  // 2 Threat Intelligence
  {col:'#a855f7',label:'THREAT INTELLIGENCE',sub:'GLOBAL THREAT FEED CORRELATION',
   html:()=>`
   <div class="sr2">
     <div class="sca" style="border-color:#a855f740"><h3>FEED RESULTS</h3>
       <div class="dl"><span class="dk">AbuseIPDB</span><span class="dv r">MATCH — Score 98</span></div>
       <div class="dl"><span class="dk">AlienVault OTX</span><span class="dv r">12 pulses</span></div>
       <div class="dl"><span class="dk">Shodan</span><span class="dv o">Ports: 22,80,443</span></div>
       <div class="dl"><span class="dk">TOR Exit List</span><span class="dv r">CONFIRMED</span></div>
       <div class="dl"><span class="dk">NVD CVE Match</span><span class="dv o">CVE-2023-38408</span></div>
     </div>
     <div class="sca" style="border-color:#a855f740"><h3>CLASSIFICATION</h3>
       <div class="dl"><span class="dk">Category</span><span class="dv p">APT Credential Attack</span></div>
       <div class="dl"><span class="dk">Confidence</span><span class="dv r">97.4%</span></div>
       <div class="dl"><span class="dk">MITRE ATT&CK</span><span class="dv o">T1110.001</span></div>
       <div class="dl"><span class="dk">Campaign</span><span class="dv p">SSH Brute Cluster #44</span></div>
       <div class="dl"><span class="dk">Threat Actor</span><span class="dv r">APT-DARK-SSH</span></div>
     </div>
   </div>
   <div class="sca" style="border-color:#a855f740"><h3>INTELLIGENCE SUMMARY</h3>
     <p class="stx">IP <span style="color:var(--r)">185.220.101.47</span> matches <strong>12 published OTX pulses</strong>. Last seen targeting 3,400+ global systems. MITRE: <strong style="color:var(--p)">T1110.001 — Password Guessing</strong>. Forwarded with <span class="tag2 cr">CRITICAL</span> tag.</p>
   </div>`
  },
  // 3 Risk Analyzer
  {col:'#ffd700',label:'RISK ANALYZER',sub:'COMPOSITE RISK SCORING ENGINE',
   html:()=>`
   <div class="sca" style="border-color:#ffd70040"><h3>RISK SCORE GAUGE</h3>
     <svg viewBox="0 0 220 120" style="width:240px;margin:0 auto;display:block">
       <path d="M24 96 A88 88 0 0 1 196 96" stroke="#1a3a4a" stroke-width="18" stroke-linecap="round" fill="none"/>
       <path d="M24 96 A88 88 0 0 1 196 96" stroke="url(#rgg)" stroke-width="16" stroke-linecap="round" fill="none" stroke-dasharray="240" stroke-dashoffset="240" id="gp" style="transition:stroke-dashoffset 2.2s ease"/>
       <defs><linearGradient id="rgg" x1="0%" y1="0%" x2="100%"><stop offset="0%" stop-color="#00ff88"/><stop offset="50%" stop-color="#ffd700"/><stop offset="100%" stop-color="#ff3366"/></linearGradient></defs>
       <text x="110" y="92" text-anchor="middle" font-family="Orbitron,monospace" font-size="32" font-weight="900" fill="#ffd700" id="gn">0</text>
       <text x="110" y="112" text-anchor="middle" font-family="Share Tech Mono,monospace" font-size="10" fill="#4a7a96">RISK SCORE / 100</text>
       <text x="26" y="114" font-family="Share Tech Mono,monospace" font-size="8" fill="#4a7a96">LOW</text>
       <text x="180" y="114" font-family="Share Tech Mono,monospace" font-size="8" fill="#ff3366">CRITICAL</text>
     </svg>
   </div>
   <div class="sr2">
     <div class="sca" style="border-color:#ffd70040"><h3>SCORING FACTORS</h3>
       <div class="dl"><span class="dk">Attempt Rate</span><span class="dv r">+35 pts</span></div>
       <div class="dl"><span class="dk">TOR Exit Node</span><span class="dv r">+25 pts</span></div>
       <div class="dl"><span class="dk">TI Confidence</span><span class="dv r">+20 pts</span></div>
       <div class="dl"><span class="dk">Geo Anomaly</span><span class="dv o">+12 pts</span></div>
       <div class="dl"><span class="dk">System Load</span><span class="dv o">+8 pts</span></div>
     </div>
     <div class="sca" style="border-color:#ffd70040"><h3>OUTPUT</h3>
       <div class="dl"><span class="dk">Final Score</span><span class="dv r">94 / 100</span></div>
       <div class="dl"><span class="dk">Tier</span><span class="dv r">CRITICAL</span></div>
       <div class="dl"><span class="dk">Auto-Respond</span><span class="dv g">AUTHORIZED</span></div>
       <div class="dl"><span class="dk">Human Review</span><span class="dv c">PARALLEL</span></div>
     </div>
   </div>`
  },
  // 4 Agent 1
  {col:'#00d4ff',label:'AGENT 1 — DETECTION',sub:'AUTONOMOUS EVIDENCE COLLECTOR',
   html:()=>`
   <div class="sr2">
     <div class="sca" style="border-color:#00d4ff40"><h3>COLLECTED ARTIFACTS</h3>
       <ul class="el">
         <li>auth.log snapshot — 1,247 entries</li>
         <li>SSH session dump (all threads)</li>
         <li>Network pcap — 60s window</li>
         <li>Kernel audit log (aureport)</li>
         <li>Process tree snapshot</li>
         <li>Memory map of sshd</li>
       </ul>
     </div>
     <div class="sca" style="border-color:#00d4ff40"><h3>IOC EXTRACTED</h3>
       <div class="dl"><span class="dk">Malicious IP</span><span class="dv r">185.220.101.47</span></div>
       <div class="dl"><span class="dk">Usernames</span><span class="dv o">admin, root, ubuntu</span></div>
       <div class="dl"><span class="dk">Wordlist</span><span class="dv p">rockyou-top1k</span></div>
       <div class="dl"><span class="dk">Time Window</span><span class="dv c">23:14:02—23:15:02</span></div>
       <div class="dl"><span class="dk">Total Packets</span><span class="dv r">4,921</span></div>
     </div>
   </div>
   <div class="sca" style="border-color:#00d4ff40"><h3>AGENT OUTPUT</h3>
     <p class="stx">Collected <strong>6 forensic artifacts</strong>, extracted <strong>5 unique IOCs</strong>. Evidence bundle packaged and forwarded to <strong>Agent 2 (Correlation)</strong>.</p>
   </div>`
  },
  // 5 Agent 2
  {col:'#00bfff',label:'AGENT 2 — CORRELATION',sub:'MULTI-LOG PATTERN ANALYSIS',
   html:()=>`
   <div class="sca" style="border-color:#00bfff40"><h3>LOG STREAMS MERGED</h3>
     <div class="dl"><span class="dk">auth.log</span><span class="dv g">✓ 1,247 events</span></div>
     <div class="dl"><span class="dk">syslog</span><span class="dv g">✓ 3,402 events</span></div>
     <div class="dl"><span class="dk">kern.log</span><span class="dv g">✓ 892 events</span></div>
     <div class="dl"><span class="dk">network flow</span><span class="dv g">✓ 4,921 packets</span></div>
     <div class="dl"><span class="dk">audit.log</span><span class="dv g">✓ 340 events</span></div>
   </div>
   <div class="sr2">
     <div class="sca" style="border-color:#00bfff40"><h3>CORRELATION</h3>
       <ul class="el">
         <li>IP in ALL 5 log streams</li>
         <li>Attack start: 23:14:02.117 UTC</li>
         <li>Peak rate: 32 req/sec at 23:14:34</li>
         <li>Lateral movement: NOT detected</li>
         <li>Breach success: 0 / 1,247</li>
       </ul>
     </div>
     <div class="sca" style="border-color:#00bfff40"><h3>PATTERN</h3>
       <div class="dl"><span class="dk">Type</span><span class="dv p">Dictionary Brute</span></div>
       <div class="dl"><span class="dk">Tool sig</span><span class="dv o">Hydra v9.4</span></div>
       <div class="dl"><span class="dk">Breach</span><span class="dv g">CONTAINED</span></div>
       <div class="dl"><span class="dk">Confidence</span><span class="dv c">99.1%</span></div>
     </div>
   </div>`
  },
  // 6 Agent 3
  {col:'#00ff88',label:'AGENT 3 — RESPONSE',sub:'AUTONOMOUS THREAT NEUTRALIZATION',
   html:()=>`
   <div class="sca" style="border-color:#00ff8840"><h3>FIREWALL RULE INJECTION</h3>
     <div class="fw" id="fwg"></div>
     <div style="display:flex;gap:14px;margin-top:10px;font-family:Share Tech Mono,monospace;font-size:9px;color:var(--dm)"><span><span style="color:var(--r)">■</span> ATTACK</span><span><span style="color:var(--g)">■</span> BLOCKED</span></div>
   </div>
   <div class="sr2">
     <div class="sca" style="border-color:#00ff8840"><h3>ACTIONS</h3>
       <ul class="el">
         <li>iptables DROP: 185.220.101.47</li>
         <li>fail2ban jail activated (SSH)</li>
         <li>Rate limit: 3 auth/min enforced</li>
         <li>Port 22 geo-blocked (RU/CN/KP)</li>
         <li>1,247 active sessions terminated</li>
       </ul>
     </div>
     <div class="sca" style="border-color:#00ff8840"><h3>STATUS</h3>
       <div class="dl"><span class="dk">IP Blocked</span><span class="dv g">✓ DONE</span></div>
       <div class="dl"><span class="dk">Firewall</span><span class="dv g">✓ ACTIVE</span></div>
       <div class="dl"><span class="dk">Sessions</span><span class="dv g">✓ KILLED</span></div>
       <div class="dl"><span class="dk">Response Time</span><span class="dv c">2.1 sec</span></div>
       <div class="dl"><span class="dk">Attack Status</span><span class="dv g">NEUTRALIZED</span></div>
     </div>
   </div>`
  },
  // 7 Agent 4
  {col:'#a855f7',label:'AGENT 4 — NOTIFICATION',sub:'MULTI-CHANNEL ALERT DISPATCH',
   html:()=>`
   <div class="sca" style="border-color:#a855f740"><h3>ALERT DISPATCHED — ALL CHANNELS</h3>
      <div id="ntl" style="display:flex;flex-direction:column;gap:10px;margin-top:6px">
        <div id="na0" style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(59,130,246,.1);border:1px solid #3b82f640;border-radius:8px;opacity:0;transform:translateX(-16px);transition:all .5s"><div style="position:relative;flex-shrink:0">${smsIco(28)}<div style="position:absolute;inset:-4px;border-radius:50%;background:var(--r);animation:naPulse 1s ease-out infinite"></div></div><div><div style="font-family:Orbitron,monospace;font-size:10px;letter-spacing:.18em;color:var(--dm);margin-bottom:2px">SMS ALERT</div><div style="font-family:Share Tech Mono,monospace;font-size:11px;color:var(--tx)">🚨 CYBERMATE: Brute-force 185.220.101.47 — 1,247 attempts — IP BLOCKED</div></div></div>
        <div id="na1" style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(37,211,102,.08);border:1px solid #25d36640;border-radius:8px;opacity:0;transform:translateX(-16px);transition:all .5s .5s"><div style="position:relative;flex-shrink:0">${waIco(28)}<div style="position:absolute;inset:-4px;border-radius:50%;background:#25d366;animation:naPulse 1s ease-out infinite .3s"></div></div><div><div style="font-family:Orbitron,monospace;font-size:10px;letter-spacing:.18em;color:var(--dm);margin-bottom:2px">WHATSAPP</div><div style="font-family:Share Tech Mono,monospace;font-size:11px;color:var(--tx)">🛡 Attack neutralized · IP blocked · Risk: CRITICAL</div></div></div>
        <div id="na2" style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(44,165,224,.08);border:1px solid #2ca5e040;border-radius:8px;opacity:0;transform:translateX(-16px);transition:all .5s 1s"><div style="position:relative;flex-shrink:0">${tgIco(28)}<div style="position:absolute;inset:-4px;border-radius:50%;background:#2ca5e0;animation:naPulse 1s ease-out infinite .6s"></div></div><div><div style="font-family:Orbitron,monospace;font-size:10px;letter-spacing:.18em;color:var(--dm);margin-bottom:2px">TELEGRAM</div><div style="font-family:Share Tech Mono,monospace;font-size:11px;color:var(--tx)">🤖 [CRITICAL] Brute-force neutralized · 23:14:02 UTC · Auto-response: DONE</div></div></div>
        <div id="na3" style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(234,67,53,.08);border:1px solid #ea433540;border-radius:8px;opacity:0;transform:translateX(-16px);transition:all .5s 1.5s"><div style="position:relative;flex-shrink:0">${emIco(28)}<div style="position:absolute;inset:-4px;border-radius:50%;background:#ea4335;animation:naPulse 1s ease-out infinite .9s"></div></div><div><div style="font-family:Orbitron,monospace;font-size:10px;letter-spacing:.18em;color:var(--dm);margin-bottom:2px">EMAIL</div><div style="font-family:Share Tech Mono,monospace;font-size:11px;color:var(--tx)">📧 Incident INC-2024-1247 dispatched to admin@domain.com</div></div></div>
     </div>
   </div>`
  },
  // 8 Backend
  {col:'#00d4ff',label:'BACKEND ENGINE',sub:'INCIDENT MANAGEMENT & PERSISTENCE',
   html:()=>`
   <div class="sr2">
     <div class="sca" style="border-color:#00d4ff40"><h3>DATABASE OPS</h3>
       <div class="dl"><span class="dk">Incident Created</span><span class="dv g">✓ INC-2024-1247</span></div>
       <div class="dl"><span class="dk">Events Stored</span><span class="dv g">✓ 10,802 rows</span></div>
       <div class="dl"><span class="dk">PCAP Saved</span><span class="dv g">✓ 4.7 MB</span></div>
       <div class="dl"><span class="dk">DB Sync</span><span class="dv g">✓ SQLite + Supabase</span></div>
       <div class="dl"><span class="dk">Audit Trail</span><span class="dv g">✓ Immutable</span></div>
     </div>
     <div class="sca" style="border-color:#00d4ff40"><h3>INCIDENT RECORD</h3>
       <div class="dl"><span class="dk">Incident ID</span><span class="dv c">INC-2024-1247</span></div>
       <div class="dl"><span class="dk">Severity</span><span class="dv r">CRITICAL</span></div>
       <div class="dl"><span class="dk">Detection</span><span class="dv c">0.8s</span></div>
       <div class="dl"><span class="dk">Containment</span><span class="dv c">2.1s</span></div>
       <div class="dl"><span class="dk">Total TTR</span><span class="dv g">4.6s</span></div>
     </div>
   </div>
   <div class="sca" style="border-color:#00d4ff40"><h3>AUDIT TRAIL</h3>
     <ul class="el">
       <li>23:14:02 — Attack detected by ADE</li>
       <li>23:14:03 — Watcher Agent escalated</li>
       <li>23:14:04 — TI queried · Risk Score: 94</li>
       <li>23:14:05 — Agents 1–4 dispatched in parallel</li>
       <li>23:14:07 — IP blocked · Sessions terminated</li>
       <li>23:14:08 — Notifications sent · Incident logged</li>
     </ul>
   </div>`
  },
  // 9 Comms Center
  {col:'#00ff88',label:'COMMUNICATION CENTER',sub:'MULTI-PLATFORM NOTIFICATION DELIVERY',
   html:()=>`
   <div class="sca" style="border-color:#00ff8840"><h3>DEVICE NOTIFICATIONS</h3>
     <div class="pw">
       <div>
         <div class="ph sms-ph">
           <div class="ph-n"></div>
           <div class="ph-sc" style="background:#0f0f0f">
             <div class="ph-st"><span>9:14 PM</span><span>▌▌▌ 📶</span></div>
             <div class="ph-ah"><div style="width:26px;height:26px;background:#3b82f6;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px">💬</div><span class="ph-an" style="color:#aaa;font-size:10px">Messages</span></div>
             <div class="ph-mb" style="background:#3b82f6;color:#fff;border-radius:10px 10px 3px 10px;margin:0 9px 9px;padding:9px;font-size:9px">🚨 <strong>CYBERMATE ALERT</strong><br>Brute-force: 185.220.101.47<br>1,247 attempts detected<br>✅ IP BLOCKED · CRITICAL</div>
           </div>
         </div>
         <div class="ph-lbl">SMS</div>
       </div>
       <div>
         <div class="ph wa-ph">
           <div class="ph-n"></div>
           <div class="ph-sc">
             <div class="ph-st" style="color:#555"><span>9:14 PM</span><span>▌▌▌</span></div>
             <div class="ph-ah" style="background:#075e54"><div style="width:28px;height:28px;background:white;border-radius:50%;display:flex;align-items:center;justify-content:center">${waIco(24)}</div><span class="ph-an" style="color:white;font-size:10px">CyberMate SOC</span></div>
             <div class="ph-mb rc" style="background:#1f2c34;color:#e8e8e8;font-size:9px">🛡 <strong>Alert</strong><br>Type: Brute Force<br>IP: 185.220.101.47<br>Attempts: 1,247<br>Status: ✅ Blocked<br>Risk: 🔴 CRITICAL</div>
           </div>
         </div>
         <div class="ph-lbl">WHATSAPP</div>
       </div>
       <div>
         <div class="ph tg-ph">
           <div class="ph-n"></div>
           <div class="ph-sc">
             <div class="ph-st" style="color:#555"><span>9:14 PM</span><span>▌▌▌</span></div>
             <div class="ph-ah" style="background:#2ca5e0"><div style="width:28px;height:28px;background:white;border-radius:50%;display:flex;align-items:center;justify-content:center">${tgIco(24)}</div><span class="ph-an" style="color:white;font-size:10px">CyberMate Channel</span></div>
             <div class="ph-mb rc" style="background:#182533;color:#ddd;font-size:9px">🤖 <strong>[CRITICAL]</strong><br>Attack neutralized<br>📍 185.220.101.47<br>🕐 23:14:02 UTC<br>✅ Auto-response: DONE</div>
           </div>
         </div>
         <div class="ph-lbl">TELEGRAM</div>
       </div>
     </div>
   </div>
   <div class="sep"></div>
   <div class="em-cl">
     <div class="em-tb"><div class="em-dt em-d1"></div><div class="em-dt em-d2"></div><div class="em-dt em-d3"></div><div class="em-ad">security@cybermate.ai → admin@domain.com</div></div>
     <div class="em-bd">
       <div class="em-su">🚨 [CRITICAL] Security Incident INC-2024-1247 — Brute Force Attack Neutralized</div>
       <div class="em-mt">From: CyberMate SOC · 23:14:08 UTC · To: admin@domain.com</div>
       <div class="em-tx">
         <span class="f">Incident ID:</span> <span class="v">INC-2024-1247</span><br>
         <span class="f">Attack Type:</span> <span class="v">SSH Brute Force (T1110.001)</span><br>
         <span class="f">Source IP:</span> <span class="v">185.220.101.47 (TOR Exit)</span><br>
         <span class="f">Attempts:</span> <span class="v">1,247 in 60 seconds</span><br>
         <span class="f">Detection Time:</span> <span class="v">0.8 seconds</span><br>
         <span class="f">Response Time:</span> <span class="v">2.1 seconds</span><br>
         <span class="f">Status:</span> <span style="color:var(--g)">✅ FULLY CONTAINED — NO BREACH</span><br><br>
         CyberMate's 4-agent pipeline detected, correlated, blocked and notified within <strong>4.6 seconds</strong> — zero human intervention.
       </div>
     </div>
   </div>`
  },
];

/* ── SIMULATION LOGIC ── */
let curStage=0,autoTmr=null,countTmr=null,TOTAL=10;

function startSim(mode){
  curStage=0;
  placedNodes.clear();drawnConns.clear();
  document.querySelectorAll('.pnode').forEach(e=>e.remove());
  showScr('sim');
  pipeW=innerWidth;pipeH=innerHeight;
  if(pipeCanvas){pipeCanvas.width=pipeW;pipeCanvas.height=pipeH;}
  else initPipeCanvas();
  document.getElementById('prog').style.display='flex';
  document.getElementById('abar').style.display='block';
  document.getElementById('next-bar').style.display='flex';
  setTimeout(()=>showStage(0),400);
}

function nextStage(){
  if(autoTmr)clearTimeout(autoTmr);
  if(countTmr)clearInterval(countTmr);
  dismissStage(curStage);
}

function showStage(idx){
  document.getElementById('pgn').textContent=idx+1;
  const s=STAGES[idx];
  const panel=document.getElementById('stage-panel');
  const si=document.getElementById('si');
  si.innerHTML=`
    <div class="sn">STAGE ${idx+1} / ${TOTAL}</div>
    <div class="shd">
      <div class="slo">${nodeSVG(idx,s.col,80)}</div>
      <div class="sht"><h2 style="color:${s.col}">${s.label}</h2><p>${s.sub}</p></div>
    </div>
    <div class="sb2">${s.html()}</div>
  `;
  panel.style.display='flex';
  panel.style.opacity='0';
  requestAnimationFrame(()=>{panel.style.transition='opacity .4s';panel.style.opacity='1';});
  // Animations per stage
  setTimeout(()=>stageAnim(idx),500);
  // Auto-advance countdown — 15 seconds
  const bar=document.getElementById('abf');
  bar.style.transition='none';bar.style.width='0';
  requestAnimationFrame(()=>requestAnimationFrame(()=>{bar.style.transition='width 15s linear';bar.style.width='100%';}));
  clearTimeout(autoTmr);clearInterval(countTmr);
  let cnt=15;document.getElementById('next-count').textContent='15';
  countTmr=setInterval(()=>{cnt--;if(cnt<1)cnt=0;document.getElementById('next-count').textContent=cnt;},1000);
  autoTmr=setTimeout(()=>dismissStage(idx),15000);
  // Push notification overlay for notification stages
  if(idx===7){
    setTimeout(()=>showNotifAlerts(),600);
  }
}

function stageAnim(idx){
  if(idx===0){
    let n=0;const iv=setInterval(()=>{n+=21;if(n>1247){n=1247;clearInterval(iv);}const el=document.getElementById('ac');if(el)el.textContent=n.toLocaleString();},40);
    setTimeout(()=>{const b=document.getElementById('svf');if(b)b.style.width='94%';},300);
  }
  if(idx===3){
    setTimeout(()=>{
      const p=document.getElementById('gp');if(p)p.style.strokeDashoffset='14';
      let n=0;const iv=setInterval(()=>{n+=2;if(n>=94){n=94;clearInterval(iv);}const el=document.getElementById('gn');if(el)el.textContent=n;},25);
    },400);
  }
  if(idx===6){
    const g=document.getElementById('fwg');
    if(g){for(let i=0;i<40;i++){const c=document.createElement('div');c.className='fwc';g.appendChild(c);}
    let j=0;const iv=setInterval(()=>{const cs=g.querySelectorAll('.fwc');if(j<cs.length){cs[j].classList.add('a');setTimeout(()=>{cs[j].classList.remove('a');cs[j].classList.add('b');},300);j++;}else clearInterval(iv);},70);}
  }
  if(idx===7){
    [0,1,2,3].forEach((i,n)=>setTimeout(()=>{const el=document.getElementById('na'+i);if(el){el.style.opacity='1';el.style.transform='translateX(0)';}},n*550));
  }
}

function dismissStage(idx){
  clearTimeout(autoTmr);clearInterval(countTmr);
  const panel=document.getElementById('stage-panel');
  panel.style.transition='opacity .45s';panel.style.opacity='0';
  setTimeout(()=>{
    panel.style.display='none';
    placeNodeEl(idx);
    if(idx+1<TOTAL){
      curStage=idx+1;
      setTimeout(()=>showStage(idx+1),350);
    }else{
      setTimeout(()=>showSuccess2(),1200);
    }
  },460);
}

/* ── NOTIFICATION OVERLAY ALERTS ── */
function showNotifAlerts(){
  const ov=document.getElementById('notif-overlay');
  const alerts=[
    {cls:'sms-a',icon:smsIco(),pulse:'r',platform:'SMS',msg:'🚨 CYBERMATE: Brute-force from 185.220.101.47 BLOCKED'},
    {cls:'wa-a',icon:waIco(),pulse:'g',platform:'WHATSAPP',msg:'🛡 Attack neutralized · IP blocked · No breach · CRITICAL'},
    {cls:'tg-a',icon:tgIco(),pulse:'b',platform:'TELEGRAM CHANNEL',msg:'🤖 [CRITICAL] Auto-response completed · @CyberMateSOC'},
    {cls:'em-a',icon:emIco(),pulse:'e',platform:'EMAIL',msg:'📧 INC-2024-1247 report dispatched to admin@domain.com'},
  ];
  ov.innerHTML='';
  alerts.forEach((a,i)=>{
    const div=document.createElement('div');
    div.className='nalert '+a.cls;
    div.innerHTML=`
      <div class="na-icon" style="position:relative;flex-shrink:0">
        ${a.icon}
        <div class="na-pulse ${a.pulse}" style="position:absolute;inset:-3px;border-radius:6px"></div>
      </div>
      <div>
        <div class="na-platform">${a.platform}</div>
        <div class="na-msg">${a.msg}</div>
        <div class="na-critical"><div class="na-dot"></div><span class="na-critical-text">ALERT SENT</span></div>
      </div>`;
    ov.appendChild(div);
    setTimeout(()=>div.classList.add('show'),i*400);
    setTimeout(()=>div.classList.add('hiding'),4000+i*200);
    setTimeout(()=>div.remove(),4600+i*200);
  });
}

function doReset(){
  clearTimeout(autoTmr);clearInterval(countTmr);curStage=0;
  fpRunning=false;
  placedNodes.clear();drawnConns.clear();
  document.querySelectorAll('.pnode').forEach(e=>e.remove());
  document.getElementById('stage-panel').style.display='none';
  document.getElementById('notif-overlay').innerHTML='';
  document.getElementById('next-bar').style.display='none';
  document.getElementById('fp-scene').innerHTML='<canvas id="fp-canvas"></canvas>';
  showScr('menu');
}

const FINAL_NODES=[
  {id:'n0',label:'ATTACK DETECTION',sub:'ENGINE',x:0.12,y:0.50,col:'#ff3366'},
  {id:'n1',label:'WATCHER',sub:'AGENT',x:0.25,y:0.20,col:'#ff9500'},
  {id:'n2',label:'THREAT INTEL',sub:'AGENT',x:0.25,y:0.80,col:'#a855f7'},
  {id:'n3',label:'RISK ANALYZER',sub:'AGENT',x:0.38,y:0.50,col:'#ffd700'},
  {id:'n4',label:'AGENT 1',sub:'DETECTION',x:0.51,y:0.12,col:'#00d4ff'},
  {id:'n5',label:'AGENT 2',sub:'CORRELATION',x:0.51,y:0.35,col:'#00bfff'},
  {id:'n6',label:'AGENT 3',sub:'RESPONSE',x:0.51,y:0.60,col:'#00ff88'},
  {id:'n7',label:'AGENT 4',sub:'NOTIFY',x:0.51,y:0.85,col:'#a855f7'},
  {id:'n8',label:'BACKEND',sub:'ENGINE',x:0.67,y:0.25,col:'#00d4ff'},
  {id:'n9',label:'COMMS CENTER',sub:'HUB',x:0.67,y:0.72,col:'#00ff88'},
  {id:'n10',label:'SMS',sub:'DELIVERED',x:0.84,y:0.08,col:'#3b82f6'},
  {id:'n11',label:'WHATSAPP',sub:'DELIVERED',x:0.84,y:0.32,col:'#25D366'},
  {id:'n12',label:'TELEGRAM',sub:'DELIVERED',x:0.84,y:0.58,col:'#2ca5e0'},
  {id:'n13',label:'EMAIL',sub:'DELIVERED',x:0.84,y:0.84,col:'#ea4335'},
];
const FINAL_CONNS=[[0,1],[0,2],[1,3],[2,3],[3,4],[3,5],[3,6],[3,7],[4,8],[5,8],[6,8],[7,9],[8,9],[9,10],[9,11],[9,12],[9,13]];
let fpCtx=null,fpAnim=0,fpRunning=false;

function showSuccess2(){
  document.getElementById('stage-panel').style.display='none';
  document.getElementById('notif-overlay').innerHTML='';
  document.getElementById('next-bar').style.display='none';
  showScr('succ');
  // Build final pipeline — full viewport 3D
  const scene=document.getElementById('fp-scene');
  const W=innerWidth,H=innerHeight;
  const padX=W*0.06,padY=H*0.1;
  const pw=W-padX*2,ph=H-padY*2;
  scene.innerHTML='<canvas id="fp-canvas"></canvas>';
  const cv=document.getElementById('fp-canvas');
  cv.width=W;cv.height=H;
  cv.style.width=W+'px';cv.style.height=H+'px';
  fpCtx=cv.getContext('2d');
  // Node icon size scales with viewport
  const iconSize=Math.min(72,Math.max(44,Math.floor(W*0.045)));
  // Place node elements
  FINAL_NODES.forEach((n,i)=>{
    const el=document.createElement('div');el.className='final-node';el.id='fn_'+n.id;
    const x=padX+n.x*pw,y=padY+n.y*ph;
    el.style.left=(x-80)+'px';el.style.top=(y-iconSize/2-8)+'px';
    el.style.setProperty('--nc',n.col);
    const svg=nodeSVG(i,n.col,iconSize);
    el.innerHTML=`
      <div class="fn-icon" style="color:${n.col}; width:${iconSize}px; height:${iconSize}px;">${svg}</div>
      <div class="fn-label" style="color:${n.col}">${n.label}</div>
      <div class="fn-status" style="color:${n.col}">${n.sub}</div>`;
    scene.appendChild(el);
    setTimeout(()=>el.classList.add('show'),i*90);
  });
  
  // Mouse Parallax listener disabled to maintain stable layout

  initFPParticles();
  fpRunning=true;fpAnim=0;
  requestAnimationFrame(animFinalPipe);
}

/* ── FINAL PIPELINE FLOATING PARTICLES ── */
let fpParticles=[];
function initFPParticles(){
  fpParticles=[];
  for(let i=0;i<40;i++){
    fpParticles.push({
      x:Math.random(),y:Math.random(),
      vx:(Math.random()-0.5)*0.0015,vy:(Math.random()-0.5)*0.0015,
      r:Math.random()*1.5+0.5,a:Math.random()*0.25+0.05,s:Math.random()*Math.PI*2
    });
  }
}

function edgePoints(fx,fy,tx,ty,r){
  const dx=tx-fx,dy=ty-fy,len=Math.sqrt(dx*dx+dy*dy)||1;
  return{sx:fx+dx/len*r,sy:fy+dy/len*r,ex:tx-dx/len*r,ey:ty-dy/len*r};
}

function animFinalPipe(){
  if(!fpRunning||!fpCtx)return;
  const cv=fpCtx.canvas;
  const W=cv.width,H=cv.height;
  fpCtx.clearRect(0,0,W,H);
  const pulse=0.7+0.3*Math.sin(fpAnim*0.012);
  fpAnim+=0.8;
  const padX=W*0.06,padY=H*0.1;
  const pw=W-padX*2,ph=H-padY*2;
  const iconSize=Math.min(72,Math.max(44,Math.floor(W*0.045)));
  // Set offset precisely to icon radius + 1px for exact circle border connection
  const r=iconSize/2+1;

  // Helper function to extract RGB values from theme variables
  const hexToRgb = (hex) => {
    hex = hex.trim().replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    const num = parseInt(hex, 16);
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
  };
  const themeColor = getComputedStyle(document.body).getPropertyValue('--c').trim() || '#00d4ff';
  const rgbVal = hexToRgb(themeColor);

  // Background floating particles
  fpCtx.shadowBlur=0;
  for(const p of fpParticles){
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>1)p.vx*=-1;if(p.y<0||p.y>1)p.vy*=-1;
    p.s+=0.01;
    const px=padX+p.x*pw,py=padY+p.y*ph;
    const pa=p.a*(0.7+0.3*Math.sin(p.s));
    fpCtx.beginPath();fpCtx.arc(px,py,p.r,0,Math.PI*2);
    fpCtx.fillStyle=`rgba(${rgbVal},${pa*0.4})`;fpCtx.fill();
  }

  // ── 1. INTERNET ATTACK INCOMING STREAM ARROW (To Node 0) ──
  const fn0 = FINAL_NODES[0];
  const n0x = padX + fn0.x*pw;
  const n0y = padY + fn0.y*ph - 8;
  const entryX = 0;
  const entryY = n0y;
  
  fpCtx.save();
  fpCtx.beginPath(); fpCtx.moveTo(entryX, entryY); fpCtx.lineTo(n0x - r, n0y);
  fpCtx.strokeStyle = '#ff336615'; fpCtx.lineWidth = 10 * pulse; fpCtx.stroke();
  
  fpCtx.beginPath(); fpCtx.moveTo(entryX, entryY); fpCtx.lineTo(n0x - r, n0y);
  fpCtx.strokeStyle = '#ff3366aa'; fpCtx.lineWidth = 3;
  fpCtx.setLineDash([9,6]); fpCtx.lineDashOffset = -fpAnim * 2;
  fpCtx.stroke();
  
  // Internet Entry arrowhead touching circle edge perfectly
  fpCtx.setLineDash([]);
  fpCtx.beginPath();
  fpCtx.moveTo(n0x - r, n0y);
  fpCtx.lineTo(n0x - r - 14, n0y - 6);
  fpCtx.lineTo(n0x - r - 14, n0y + 6);
  fpCtx.closePath(); fpCtx.fillStyle = '#ff3366'; fpCtx.fill();
  
  // Internet Entry Attack Data packet flow with trailing particles
  const entryPct = ((fpAnim * 2) % 100) / 100;
  const epx = entryX + entryPct * (n0x - r - entryX);
  for(let t=6;t>0;t--){
    const ett = (((fpAnim * 2) - t * 2.5) % 100) / 100;
    const epxTrail = entryX + ett * (n0x - r - entryX);
    // Draw trail only if it's behind the current packet position
    if (ett <= entryPct) {
      fpCtx.beginPath(); fpCtx.arc(epxTrail, entryY, 6 * (t/6), 0, Math.PI*2);
      fpCtx.fillStyle = '#ff3366' + (t < 3 ? '22' : '44');
      fpCtx.fill();
    }
  }
  fpCtx.beginPath(); fpCtx.arc(epx, entryY, 6.5, 0, Math.PI*2);
  fpCtx.fillStyle = '#ff3366'; fpCtx.shadowBlur = 25; fpCtx.shadowColor = '#ff3366';
  fpCtx.fill(); fpCtx.restore();

  // ── 2. INTERNAL CONNECTIONS WITH CORRECTED ALIGNMENT ──
  for(const [fi,ti] of FINAL_CONNS){
    const fn=FINAL_NODES[fi],tn=FINAL_NODES[ti];
    const cx=padX+fn.x*pw,cy=padY+fn.y*ph - 8; // Subtract 8px for vertical visual alignment
    const dx=padX+tn.x*pw,dy=padY+tn.y*ph - 8; // Subtract 8px for vertical visual alignment
    // Edge-to-edge connection
    const ep=edgePoints(cx,cy,dx,dy,r);
    const fx=ep.sx,fy=ep.sy,tx=ep.ex,ty=ep.ey;

    // Outer glow (widest, faintest)
    fpCtx.beginPath();fpCtx.moveTo(fx,fy);fpCtx.lineTo(tx,ty);
    fpCtx.strokeStyle=tn.col+'12';fpCtx.lineWidth=20*pulse;
    fpCtx.stroke();

    // Mid glow
    fpCtx.beginPath();fpCtx.moveTo(fx,fy);fpCtx.lineTo(tx,ty);
    fpCtx.strokeStyle=tn.col+'30';fpCtx.lineWidth=10*pulse;
    fpCtx.stroke();

    // Solid gradient core
    fpCtx.beginPath();fpCtx.moveTo(fx,fy);fpCtx.lineTo(tx,ty);
    const grad=fpCtx.createLinearGradient(fx,fy,tx,ty);
    grad.addColorStop(0,fn.col+'cc');grad.addColorStop(1,tn.col+'dd');
    fpCtx.strokeStyle=grad;fpCtx.lineWidth=3.5;
    fpCtx.stroke();

    // Animated dashed line
    fpCtx.beginPath();fpCtx.moveTo(fx,fy);fpCtx.lineTo(tx,ty);
    const grad2=fpCtx.createLinearGradient(fx,fy,tx,ty);
    grad2.addColorStop(0,fn.col);grad2.addColorStop(1,tn.col);
    fpCtx.strokeStyle=grad2;fpCtx.lineWidth=2.5;
    fpCtx.setLineDash([10,7]);fpCtx.lineDashOffset=-fpAnim*1.5;
    fpCtx.stroke();fpCtx.setLineDash([]);

    // Arrowhead at circle edge (no gaps)
    const ang=Math.atan2(ty-fy,tx-fx);
    const ahSize=14*pulse;
    fpCtx.shadowBlur=20;fpCtx.shadowColor=tn.col;
    fpCtx.beginPath();
    fpCtx.moveTo(tx,ty);
    fpCtx.lineTo(tx-ahSize*Math.cos(ang-0.45),ty-ahSize*Math.sin(ang-0.45));
    fpCtx.lineTo(tx-ahSize*Math.cos(ang+0.45),ty-ahSize*Math.sin(ang+0.45));
    fpCtx.closePath();fpCtx.fillStyle=tn.col;fpCtx.fill();

    // Data packet (edge-to-edge straight line)
    const tix=fi*0.5+ti*1.4;
    const pct=((fpAnim*1.2+tix)%100)/100;
    const bx=fx+pct*(tx-fx);
    const by=fy+pct*(ty-fy);

    // 6 trail particles
    for(let t=6;t>0;t--){
      const tt=((fpAnim*1.2+tix-t*2.8)%100)/100;
      if (tt <= pct) {
        const b2x=fx+tt*(tx-fx);
        const b2y=fy+tt*(ty-fy);
        fpCtx.beginPath();fpCtx.arc(b2x,b2y,6*(t/6),0,Math.PI*2);
        fpCtx.fillStyle=tn.col+(t<3?'22':'44');
        fpCtx.fill();
      }
    }

    // Main packet (radial gradient glow)
    fpCtx.shadowBlur=30;fpCtx.shadowColor=tn.col;
    fpCtx.beginPath();fpCtx.arc(bx,by,6,0,Math.PI*2);
    const pktGrd=fpCtx.createRadialGradient(bx-1,by-1,0,bx,by,6);
    pktGrd.addColorStop(0,'#ffffff');pktGrd.addColorStop(0.4,tn.col);pktGrd.addColorStop(1,tn.col+'88');
    fpCtx.fillStyle=pktGrd;fpCtx.fill();

    // White core
    fpCtx.shadowBlur=0;
    fpCtx.beginPath();fpCtx.arc(bx-1,by-1,2.5,0,Math.PI*2);
    fpCtx.fillStyle='rgba(255,255,255,0.85)';fpCtx.fill();
  }

  // Vignette overlay
  const vg=fpCtx.createRadialGradient(W*0.5,H*0.45,W*0.15,W*0.5,H*0.45,W*0.7);
  vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.35)');
  fpCtx.fillStyle=vg;fpCtx.fillRect(0,0,W,H);

  fpCtx.shadowBlur=0;
  requestAnimationFrame(animFinalPipe);
}

function leaveSuccess(){
  fpRunning=false;
  document.getElementById('fp-scene').innerHTML='<canvas id="fp-canvas"></canvas>';
  showScr('menu');
}

/* ── INIT CANVAS ON SIM LOAD ── */
document.getElementById('sim').addEventListener('transitionend',()=>{
  if(!document.getElementById('sim').classList.contains('hidden')&&!pipeCanvas){
    initPipeCanvas();
  }
});
// Also init immediately if already visible
setTimeout(()=>{if(!pipeCtx)initPipeCanvas();},100);
