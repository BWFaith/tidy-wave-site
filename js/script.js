/* Angela's Tidy Wave — shared behavior */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Booking requests go to EMAIL. Clear EMAIL and they are sent as a text message to PHONE instead. */
const CONFIG={phone:'13376586439',email:'angelastidywave@gmail.com'};

/* EDIT: placeholder pricing used by the instant quote calculator */
const PRICE={
  base:{standard:120,deep:200,move:220,airbnb:100},
  perBed:15,perBath:25,
  sqft:[['Under 700 sq ft',.85],['700 to 1,200 sq ft',1],['1,200 to 1,800 sq ft',1.2],['1,800 to 2,500 sq ft',1.4],['2,500 to 3,500 sq ft',1.65],['3,500+ sq ft',1.9]],
  freq:{once:0,weekly:.15,biweekly:.10,monthly:.05},
  labels:{standard:'Standard / maintenance clean',deep:'Deep clean',move:'Move-in / move-out clean',airbnb:'Airbnb turnover'}
};

/* header, promo, menus */
const hd=$('header.top');addEventListener('scroll',()=>hd.classList.toggle('scrolled',scrollY>8),{passive:true});
$('.burger')?.addEventListener('click',e=>{const o=$('#nav').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)});
$('.dd>button')?.addEventListener('click',e=>{const d=e.currentTarget.parentElement;d.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',d.classList.contains('open'))});
$('.promo button')?.addEventListener('click',()=>$('.promo').remove());
$$('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());

/* hero headline words rise in */
$$('[data-split]').forEach(el=>{let i=0;const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(t=>{if(!t.trim()){f.append(t);return}const o=document.createElement('span');o.className='w';o.innerHTML=`<span style="--i:${i++}">${t}</span>`;f.append(o)});c.replaceWith(f)}else walk(c)})};walk(el)});

/* counters + scroll reveal */
function count(el){const to=parseFloat(el.dataset.to),d=el.dataset.dec|0,t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/1400),e=1-Math.pow(1-k,3);el.textContent=(to*e).toFixed(d)+(el.dataset.suf||'');if(k<1)requestAnimationFrame(f)})(t0)}
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('show');if(x.target.dataset.to)count(x.target);io.unobserve(x.target)}}),{threshold:.2});
$$('.rv,[data-to]').forEach(e=>io.observe(e));

/* magnetic buttons */
if(!reduce&&matchMedia('(hover:hover)').matches)$$('.btn').forEach(b=>{
  b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.28}px)`});
  b.addEventListener('pointerleave',()=>b.style.transform='')});

/* hero: layered rolling waves that swell toward the cursor, rising bubbles that pop into sparkles, foam glitter */
const cv=$('#fx');
if(cv&&!reduce){
  const c=cv.getContext('2d');let W,H,bub=[],spk=[],rip=[],mx=-999,my=-999,on=true,last=0;const dpr=Math.min(devicePixelRatio||1,2);
  const L=[{a:20,l:.011,s:.9,y:.80,f:'rgba(255,255,255,.20)'},{a:26,l:.008,s:.6,y:.84,f:'rgba(120,214,240,.50)'},{a:30,l:.006,s:.45,y:.89,f:'rgba(19,168,201,.78)'},{a:22,l:.010,s:.75,y:.94,f:'#0a8fc2'}];
  const mk=i=>({x:Math.random()*W,y:i?Math.random()*H:H+30,r:5+Math.random()*20,v:.3+Math.random()*.7,p:Math.random()*6.28});
  function size(){const r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;c.setTransform(dpr,0,0,dpr,0,0);bub=Array.from({length:Math.round(W/38)},()=>mk(true))}
  size();addEventListener('resize',size);const host=cv.parentElement;
  host.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;const s=$('.sun');if(s)s.style.transform=`translate(${(mx/W-.5)*-40}px,${(my/H-.5)*-30}px)`});
  host.addEventListener('pointerleave',()=>mx=my=-999);
  host.addEventListener('pointerdown',e=>{if(e.target.closest('a,button,input,select,.card'))return;const r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;rip.push({x,y,r:4,l:1});
    bub.forEach(b=>{if(Math.hypot(b.x-x,b.y-y)<b.r+12){for(let i=0;i<9;i++){const a=Math.random()*6.28,s=1+Math.random()*2.6;spk.push({x:b.x,y:b.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1,l:1})}Object.assign(b,mk(false))}})});
  new IntersectionObserver(e=>on=e[0].isIntersecting).observe(cv);
  const yAt=(Li,x,T)=>H*Li.y+Math.sin(x*Li.l+T*Li.s+Li.a)*Li.a+Math.sin(x*Li.l*2.3-T*Li.s)*Li.a*.35-Math.exp(-Math.pow((x-mx)/150,2))*(mx>0?22:0);
  (function frame(t){requestAnimationFrame(frame);if(!on||t-last<16)return;last=t;c.clearRect(0,0,W,H);const T=t/1000;
    for(const b of bub){b.y-=b.v;b.x+=Math.sin(T*1.3+b.p)*.5;if(b.y<-30)Object.assign(b,mk(false));
      const g=c.createRadialGradient(b.x-b.r*.35,b.y-b.r*.35,b.r*.1,b.x,b.y,b.r);g.addColorStop(0,'rgba(255,255,255,.6)');g.addColorStop(1,'rgba(160,230,250,.18)');
      c.fillStyle=g;c.beginPath();c.arc(b.x,b.y,b.r,0,6.3);c.fill();c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=1.1;c.stroke()}
    L.forEach((Li,i)=>{c.fillStyle=Li.f;c.beginPath();c.moveTo(0,H);for(let x=0;x<=W+8;x+=8)c.lineTo(x,yAt(Li,x,T+i));c.lineTo(W,H);c.closePath();c.fill();
      if(i===0){c.fillStyle='rgba(255,255,255,.85)';for(let k=0;k<26;k++){const x=(k*W/26+T*30*(k%3+1))%W;if(Math.sin(T*3+k)>.55){c.beginPath();c.arc(x,yAt(Li,x,T)-2,1.6,0,6.3);c.fill()}}}});
    rip=rip.filter(p=>p.l>0);for(const p of rip){p.r+=3;p.l-=.02;c.strokeStyle=`rgba(255,255,255,${p.l})`;c.lineWidth=2;c.beginPath();c.arc(p.x,p.y,p.r,0,6.3);c.stroke()}
    spk=spk.filter(p=>p.l>0);for(const p of spk){p.x+=p.vx;p.y+=p.vy;p.vy+=.05;p.l-=.025;c.fillStyle=`rgba(255,240,170,${p.l})`;c.beginPath();c.arc(p.x,p.y,2.4*p.l+.6,0,6.3);c.fill()}
  })(0)}

/* instant quote calculator */
const cs=$('#q-svc');
if(cs){
  let freq='once';const bed=$('#q-bed'),bath=$('#q-bath'),sq=$('#q-sq'),out=$('#q-price'),go=$('#q-go');
  cs.innerHTML=Object.entries(PRICE.labels).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')+'<option value="commercial">Commercial / office (custom)</option>';
  sq.innerHTML=PRICE.sqft.map((s,i)=>`<option value="${i}"${i==2?' selected':''}>${s[0]}</option>`).join('');
  function calc(){const k=cs.value;$('#q-bv').textContent=bed.value;$('#q-bav').textContent=bath.value;
    if(k==='commercial'){out.textContent='Custom quote';go.href='book.html?svc=Commercial#form';return}
    const raw=(PRICE.base[k]+bed.value*PRICE.perBed+bath.value*PRICE.perBath)*PRICE.sqft[sq.value][1]*(1-PRICE.freq[freq]);
    const lo=Math.round(raw*.95/5)*5,hi=Math.round(raw*1.15/5)*5;out.textContent=`$${lo} – $${hi}`;
    go.href=`book.html?svc=${encodeURIComponent(PRICE.labels[k])}&bed=${bed.value}&bath=${bath.value}&freq=${freq}#form`}
  [cs,bed,bath,sq].forEach(e=>e.addEventListener('input',calc));
  $$('#q-freq button').forEach(b=>b.onclick=()=>{freq=b.dataset.f;$$('#q-freq button').forEach(x=>x.classList.toggle('on',x===b));calc()});calc()}

/* before / after slider */
$$('.ba').forEach(b=>{const i=$('input',b);i.oninput=()=>b.style.setProperty('--p',i.value+'%')});

/* booking form: prefill from calculator, send by email if set, else by text */
const form=$('#form');
if(form){const p=new URLSearchParams(location.search);
  if(p.get('svc')){const s=p.get('svc').toLowerCase();[...$('#f-s').options].forEach(o=>{if(s.includes(o.value.split(' ')[0].toLowerCase()))$('#f-s').value=o.value});if(p.get('bed'))$('#f-bed').value=p.get('bed');if(p.get('bath'))$('#f-bath').value=p.get('bath');if(p.get('freq'))$('#f-f').value=p.get('freq')}
  form.onsubmit=e=>{e.preventDefault();const g=i=>$('#'+i).value;
    const body=`Booking request\nName: ${g('f-n')}\nPhone: ${g('f-p')}\nCity: ${g('f-c')}\nService: ${g('f-s')}\nBedrooms: ${g('f-bed')}  Bathrooms: ${g('f-bath')}\nFrequency: ${g('f-f')}\nPreferred date: ${g('f-d')}\nPets: ${g('f-pets')}\nNotes: ${g('f-m')}`;
    location.href=CONFIG.email?`mailto:${CONFIG.email}?subject=${encodeURIComponent('Booking request: '+g('f-s'))}&body=${encodeURIComponent(body)}`:`sms:+${CONFIG.phone}?&body=${encodeURIComponent(body)}`}}

/* area checker */
$('#area')?.addEventListener('submit',e=>{e.preventDefault();location.href=`sms:+${CONFIG.phone}?&body=${encodeURIComponent('Hi Angela\u2019s Tidy Wave, do you serve '+$('#area-c').value+'?')}`});

/* printable checklist */
$$('[data-print]').forEach(b=>b.onclick=()=>print());

/* welcome offer popup: once per visit, after 25s or on exit intent */
const md=$('#pop');
if(md&&!sessionStorage.getItem('popSeen')){
  const show=()=>{if(sessionStorage.getItem('popSeen'))return;sessionStorage.setItem('popSeen','1');md.classList.add('open');$('.x',md).focus()};
  setTimeout(show,25000);document.addEventListener('mouseout',e=>{if(e.clientY<=0&&e.relatedTarget===null)show()});
  md.addEventListener('click',e=>{if(e.target===md||e.target.classList.contains('x')||e.target.dataset.close!==undefined)md.classList.remove('open')});
  addEventListener('keydown',e=>{if(e.key==='Escape')md.classList.remove('open')})}
