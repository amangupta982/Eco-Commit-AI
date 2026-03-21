document.addEventListener("DOMContentLoaded", function () {
  if (window.lucide) lucide.createIcons();

  // ── Single rAF master loop ──
  const rafTasks = [];
  (function masterLoop() { rafTasks.forEach(fn=>fn()); requestAnimationFrame(masterLoop); })();

  // ════════════════════════════════════
  // 1. CURSOR + TRAIL SPARKS
  // ════════════════════════════════════
  const cursor   = document.getElementById("eco-cursor");
  const trailCvs = document.getElementById("trail-canvas");
  const trailCtx = trailCvs?.getContext("2d");
  let mx=-200, my=-200;
  const sparks=[], MAX_SPARKS=18;

  if(trailCvs){
    const r=()=>{trailCvs.width=window.innerWidth;trailCvs.height=window.innerHeight;};
    r(); window.addEventListener("resize",r);
  }
  document.addEventListener("mousemove",(e)=>{
    mx=e.clientX; my=e.clientY;
    if(cursor){cursor.style.left=mx+"px";cursor.style.top=my+"px";}
    if(sparks.length<MAX_SPARKS && Math.random()<0.45)
      sparks.push({x:mx,y:my,vx:(Math.random()-.5)*2.2,vy:(Math.random()-.5)*2.2-.8,life:1,r:1.8+Math.random()*2.5,color:Math.random()>.5?"#2e7d32":"#43a047"});
  });
  document.addEventListener("mousedown",()=>cursor?.classList.add("clicking"));
  document.addEventListener("mouseup",  ()=>cursor?.classList.remove("clicking"));

  rafTasks.push(()=>{
    if(!trailCtx)return;
    trailCtx.clearRect(0,0,trailCvs.width,trailCvs.height);
    for(let i=sparks.length-1;i>=0;i--){
      const s=sparks[i];
      s.x+=s.vx;s.y+=s.vy;s.vy+=0.07;s.life-=0.05;
      if(s.life<=0){sparks.splice(i,1);continue;}
      trailCtx.save();trailCtx.globalAlpha=s.life*.8;trailCtx.fillStyle=s.color;
      trailCtx.beginPath();trailCtx.arc(s.x,s.y,s.r*s.life,0,Math.PI*2);trailCtx.fill();trailCtx.restore();
    }
  });

  // ════════════════════════════════════
  // 2. SCROLL PROGRESS + NAVBAR
  // ════════════════════════════════════
  const progressBar=document.getElementById("scroll-progress");
  window.addEventListener("scroll",()=>{
    if(progressBar){
      const pct=(window.scrollY/(document.documentElement.scrollHeight-window.innerHeight))*100;
      progressBar.style.width=pct+"%";
    }
    const nav=document.querySelector("nav")||document.querySelector(".navbar");
    if(nav) nav.classList.toggle("scrolled", window.scrollY>30);
  },{passive:true});

  // ════════════════════════════════════
  // 3. 3D HERO TILT (throttled)
  // ════════════════════════════════════
  const globeWrap=document.getElementById("globeWrap");
  const heroEl   =document.getElementById("heroSection");
  let lastTilt=0;
  document.addEventListener("mousemove",(e)=>{
    const now=performance.now(); if(now-lastTilt<16)return; lastTilt=now;
    if(!heroEl)return;
    const dx=(e.clientX-window.innerWidth/2)/(window.innerWidth/2);
    const dy=(e.clientY-window.innerHeight/2)/(window.innerHeight/2);
    heroEl.style.transform=`perspective(1200px) rotateX(${dy*-1.8}deg) rotateY(${dx*1.8}deg)`;
    if(globeWrap) globeWrap.style.transform=`rotateX(${dy*-10}deg) rotateY(${dx*10}deg)`;
  });
  document.addEventListener("mouseleave",()=>{
    if(heroEl) heroEl.style.transform="perspective(1200px) rotateX(0) rotateY(0)";
    if(globeWrap) globeWrap.style.transform="rotateX(0) rotateY(0)";
  });

  // ════════════════════════════════════
  // 4. TYPEWRITER LOOP
  // ════════════════════════════════════
  document.querySelectorAll(".split-word").forEach((w,i)=>{
    setTimeout(()=>w.classList.add("fly-in"),100+i*140);
  });
  const twEl=document.getElementById("typewriter-text");
  const phrases=["Climate Impact","Eco Rewards","A Better Future","Real Change"];
  let pi=0,ci=0,del=false;
  function typeLoop(){
    if(!twEl)return;
    const p=phrases[pi];
    if(!del){
      twEl.textContent=p.slice(0,++ci);
      if(ci===p.length){del=true;setTimeout(typeLoop,1800);return;}
      setTimeout(typeLoop,72);
    }else{
      twEl.textContent=p.slice(0,--ci);
      if(ci===0){del=false;pi=(pi+1)%phrases.length;setTimeout(typeLoop,420);return;}
      setTimeout(typeLoop,38);
    }
  }
  setTimeout(typeLoop,600);

  // ════════════════════════════════════
  // 5. INJECT SVG GRADIENT ONCE
  // ════════════════════════════════════
  // Add a hidden SVG defs block to the body for ring gradients
  const svgDefs = document.createElementNS("http://www.w3.org/2000/svg","svg");
  svgDefs.style.cssText="position:absolute;width:0;height:0;overflow:hidden;";
  svgDefs.innerHTML=`<defs>
    <linearGradient id="statGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#2e7d32"/>
      <stop offset="100%" stop-color="#1f4fa3"/>
    </linearGradient>
  </defs>`;
  document.body.prepend(svgDefs);

  // ════════════════════════════════════
  // 6. ✨ PREMIUM STAT ANIMATIONS
  //    Odometer roll + ring fill + pulse glow
  // ════════════════════════════════════
  function buildOdometer(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || "";
    const numStr = target.toString();

    el.innerHTML = "";

    // Build wrapper
    const wrap = document.createElement("span");
    wrap.className = "odom-wrap";
    const columns = [];

    [...numStr].forEach(digitChar => {
      const tgt = parseInt(digitChar, 10);
      const col  = document.createElement("span");
      col.className = "odom-digit-col";
      const inner = document.createElement("span");
      inner.className = "odom-digit-inner";
      // Stack 0–9
      for (let d = 0; d <= 9; d++) {
        const s = document.createElement("span");
        s.textContent = d;
        inner.appendChild(s);
      }
      col.appendChild(inner);
      wrap.appendChild(col);
      columns.push({ inner, target: tgt });
    });

    el.appendChild(wrap);

    // Suffix
    const sfx = document.createElement("span");
    sfx.className = "odom-suffix";
    sfx.textContent = suffix;
    el.appendChild(sfx);

    return columns;
  }

  function rollOdometer(columns, onDone) {
    columns.forEach(({ inner, target: tgt }, i) => {
      setTimeout(() => {
        inner.style.transform = `translateY(-${tgt * 1.15}em)`;
        // After last column settles, call onDone
        if (i === columns.length - 1) {
          setTimeout(onDone, 750);
        }
      }, 200 + i * 130);
    });
  }

  function animateRingFill(ringEl, pct) {
    const CIRC = 188.5; // 2π×30
    const offset = CIRC - (pct / 100) * CIRC;
    // Set stroke to gradient
    ringEl.style.stroke = "url(#statGrad)";
    // Animate
    setTimeout(() => {
      ringEl.style.strokeDashoffset = offset;
    }, 350);
  }

  function triggerGlowPulse(card) {
    card.classList.remove("glow-pulse");
    void card.offsetWidth; // reflow to restart animation
    card.classList.add("glow-pulse");
    setTimeout(() => card.classList.remove("glow-pulse"), 900);
  }

  // Live tick for last digit
  function startLiveTick(columns) {
    setInterval(() => {
      const lastCol = columns[columns.length - 1];
      if (!lastCol) return;
      const cur = parseInt(lastCol.inner.style.transform.replace("translateY(-","").replace("em)","") || "0") / 1.15;
      const next = (Math.floor(cur) + 1) % 10;
      lastCol.inner.style.transition = "transform 0.2s ease";
      lastCol.inner.style.transform  = `translateY(-${next * 1.15}em)`;
      setTimeout(() => { lastCol.inner.style.transition = "transform 0.7s cubic-bezier(0.4,0,0.2,1)"; }, 250);
    }, 3200);
  }

  // Observe stats section
  const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;

      document.querySelectorAll(".stat-card").forEach((card, cardIdx) => {
        // 1. Build odometer
        const numEl   = card.querySelector(".odometer");
        const ringEl  = card.querySelector(".stat-ring-fill");
        const pct     = ringEl ? parseInt(ringEl.dataset.pct || 50) : 50;

        if (numEl) {
          const columns = buildOdometer(numEl);

          // 2. Roll odometer → on finish → glow pulse
          rollOdometer(columns, () => {
            triggerGlowPulse(card);
            startLiveTick(columns);
          });
        }

        // 3. Animate ring fill
        if (ringEl) animateRingFill(ringEl, pct);
      });

      statsObs.disconnect();
    });
  }, { threshold: 0.5 });

  const statsSection = document.getElementById("statsSection");
  if (statsSection) statsObs.observe(statsSection);

  // ════════════════════════════════════
  // 7. CO₂ TICKER
  // ════════════════════════════════════
  const tickerVal=document.getElementById("ticker-val");
  let tickerBase=48320;
  if(tickerVal) setInterval(()=>{tickerBase+=Math.floor(Math.random()*10)+2;tickerVal.textContent=tickerBase.toLocaleString();},1800);

  // ════════════════════════════════════
  // 8. LIVE ACTIVITY FEED
  // ════════════════════════════════════
  const feed=document.getElementById("activity-feed");
  const acts=[
    {icon:"🚶",name:"Priya S.",detail:"Walked 4.2 km",pts:"+8 pts"},
    {icon:"🚲",name:"Arjun M.",detail:"Cycled 12 km",pts:"+20 pts"},
    {icon:"🚌",name:"Neha K.",detail:"Bus ride 8 km",pts:"+14 pts"},
    {icon:"🌱",name:"Rahul T.",detail:"Planted a tree",pts:"+30 pts"},
    {icon:"⚡",name:"Dev P.",detail:"EV charged",pts:"+18 pts"},
    {icon:"♻️",name:"Sara L.",detail:"Recycled waste",pts:"+12 pts"},
    {icon:"🚲",name:"Kabir N.",detail:"Cycled 7 km",pts:"+15 pts"},
  ];
  let actIdx=0;
  function spawnActivity(){
    if(!feed)return;
    const data=acts[actIdx++%acts.length];
    const card=document.createElement("div");
    card.className="activity-card";
    card.innerHTML=`<span class="activity-icon">${data.icon}</span><div><div class="activity-name">${data.name}</div><div class="activity-detail">${data.detail}</div></div><span class="activity-pts">${data.pts}</span>`;
    feed.appendChild(card);
    while(feed.children.length>3){const o=feed.children[0];o.classList.add("hide");setTimeout(()=>o.remove(),450);}
    requestAnimationFrame(()=>card.classList.add("show"));
    setTimeout(()=>{card.classList.add("hide");setTimeout(()=>{if(card.parentNode)card.remove();},450);},4200);
  }
  setTimeout(spawnActivity,1800); setInterval(spawnActivity,3800);

  // ════════════════════════════════════
  // 9. CHAR REVEAL + SCRAMBLE
  // ════════════════════════════════════
  function buildCharReveal(el){
    const text=el.dataset.text||el.textContent; el.innerHTML="";
    [...text].forEach((ch,i)=>{
      const s=document.createElement("span");
      s.className="char"+(ch===" "?" space":"");
      s.textContent=ch===" "?"\u00A0":ch;
      s.style.transitionDelay=`${0.04+i*0.038}s`;
      el.appendChild(s);
    });
  }
  document.querySelectorAll(".char-reveal").forEach(el=>buildCharReveal(el));

  const CHARS="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#@$%&";
  function scrambleText(el){
    const orig=el.dataset.scramble||el.textContent; let iter=0;
    const iv=setInterval(()=>{
      el.textContent=[...orig].map((ch,i)=>{
        if(ch===" ")return" "; if(i<iter/3)return orig[i];
        return CHARS[Math.floor(Math.random()*CHARS.length)];
      }).join("");
      if(++iter>orig.length*3){el.textContent=orig;clearInterval(iv);}
    },40);
  }

  // ════════════════════════════════════
  // 10. OBSERVERS
  // ════════════════════════════════════
  const revealObs=new IntersectionObserver((e)=>{e.forEach(x=>{if(x.isIntersecting)x.target.classList.add("visible");});},{threshold:0.12});
  document.querySelectorAll(".reveal").forEach(el=>revealObs.observe(el));

  const headerObs=new IntersectionObserver((e)=>{e.forEach(x=>{if(x.isIntersecting){x.target.classList.add("visible");const l=x.target.querySelector(".section-label");if(l)setTimeout(()=>scrambleText(l),200);}});},{threshold:0.3});
  document.querySelectorAll(".section-header").forEach(el=>headerObs.observe(el));

  const gridObs=new IntersectionObserver((e)=>{e.forEach(x=>{if(x.isIntersecting)x.target.classList.add("grid-in");});},{threshold:0.15});
  document.querySelectorAll(".grid-item").forEach(el=>gridObs.observe(el));

  const connector=document.getElementById("stepsConnector");
  if(connector){
    const lo=new IntersectionObserver((e)=>{e.forEach(x=>{if(x.isIntersecting){connector.classList.add("drawn");lo.disconnect();}});},{threshold:0.4});
    lo.observe(connector);
  }

  // ════════════════════════════════════
  // 11. MAGNETIC BUTTONS + RIPPLE
  // ════════════════════════════════════
  document.querySelectorAll(".magnetic").forEach(btn=>{
    btn.addEventListener("mousemove",(e)=>{
      const r=btn.getBoundingClientRect();
      btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.28}px,${(e.clientY-r.top-r.height/2)*.28}px)`;
      btn.style.transition="transform 0.12s ease";
    });
    btn.addEventListener("mouseleave",()=>{btn.style.transform="translate(0,0)";btn.style.transition="transform 0.5s cubic-bezier(0.4,0,0.2,1)";});
  });
  document.querySelectorAll(".primary,.secondary,.cta button").forEach(btn=>{
    btn.addEventListener("click",(e)=>{
      const rect=btn.getBoundingClientRect(),size=Math.max(rect.width,rect.height);
      const rip=document.createElement("span"); rip.className="ripple";
      rip.style.cssText=`width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
      btn.appendChild(rip); setTimeout(()=>rip.remove(),600);
    });
  });

  // ════════════════════════════════════
  // 12. SPOTLIGHT + 3D TILT CARDS
  // ════════════════════════════════════
  document.querySelectorAll(".feature").forEach(card=>{
    const spot=card.querySelector(".spotlight");
    card.addEventListener("mousemove",(e)=>{
      const r=card.getBoundingClientRect();
      if(spot){spot.style.left=(e.clientX-r.left)+"px";spot.style.top=(e.clientY-r.top)+"px";}
      const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
      const dy=(e.clientY-r.top-r.height/2)/(r.height/2);
      card.style.transform=`translateY(-5px) rotateX(${dy*-4}deg) rotateY(${dx*4}deg)`;
    });
    card.addEventListener("mouseleave",()=>{card.style.transform="translateY(0) rotateX(0) rotateY(0)";});
  });

  // ════════════════════════════════════
  // 13. BADGE ECO POPUPS
  // ════════════════════════════════════
  const btxts=["🌱 +10 pts","♻️ +15 pts","🚲 +20 pts","🚶 +8 pts","🌍 +12 pts"];
  function spawnBadge(){
    const b=document.createElement("div");
    b.textContent=btxts[Math.floor(Math.random()*btxts.length)];
    b.style.cssText=`position:fixed;left:${8+Math.random()*30}vw;bottom:${65+Math.random()*15}vh;background:rgba(46,125,50,0.10);color:#2e7d32;font-size:12px;font-weight:600;padding:5px 10px;border-radius:20px;border:1px solid rgba(46,125,50,0.2);pointer-events:none;z-index:50;opacity:0;transform:translateY(0);transition:opacity 0.4s ease,transform 2.5s ease;backdrop-filter:blur(4px);font-family:'DM Sans',sans-serif;`;
    document.body.appendChild(b);
    requestAnimationFrame(()=>{b.style.opacity="0.88";b.style.transform="translateY(-55px)";});
    setTimeout(()=>{b.style.opacity="0";setTimeout(()=>b.remove(),500);},2800);
  }
  setInterval(spawnBadge,4000); setTimeout(spawnBadge,1400);

  // ════════════════════════════════════
  // 14. CONFETTI + NAVIGATION
  // ════════════════════════════════════
  const confCvs=document.getElementById("confetti-canvas");
  const confCtx=confCvs?.getContext("2d");
  if(confCvs){confCvs.width=window.innerWidth;confCvs.height=window.innerHeight;}
  const COLS=["#2e7d32","#43a047","#1f4fa3","#42a5f5","#a5d6a7","#f5c842","#fff"];
  function launchConfetti(){
    if(!confCvs||!confCtx)return;
    const ps=Array.from({length:120},()=>({x:Math.random()*confCvs.width,y:-10,w:6+Math.random()*8,h:10+Math.random()*6,color:COLS[Math.floor(Math.random()*COLS.length)],vx:(Math.random()-.5)*5,vy:3+Math.random()*5,rot:Math.random()*360,rotV:(Math.random()-.5)*8,gravity:.14,opacity:1}));
    (function draw(){
      confCtx.clearRect(0,0,confCvs.width,confCvs.height); let alive=false;
      ps.forEach(p=>{p.vy+=p.gravity;p.x+=p.vx;p.y+=p.vy;p.rot+=p.rotV;if(p.y>confCvs.height*.65)p.opacity-=.025;if(p.opacity>0){alive=true;confCtx.save();confCtx.globalAlpha=Math.max(0,p.opacity);confCtx.fillStyle=p.color;confCtx.translate(p.x,p.y);confCtx.rotate((p.rot*Math.PI)/180);confCtx.fillRect(-p.w/2,-p.h/2,p.w,p.h);confCtx.restore();}});
      if(alive)requestAnimationFrame(draw); else confCtx.clearRect(0,0,confCvs.width,confCvs.height);
    })();
  }
  const curtain=document.getElementById("page-curtain");
  function nav(url){if(!curtain){window.location.href=url;return;}curtain.classList.add("active");setTimeout(()=>window.location.href=url,520);}
  function guard(){nav(localStorage.getItem("ecoUser")==="true"?"dashboard.html":"login.html");}
  document.getElementById("startTrackingBtn")?.addEventListener("click",guard);
  document.getElementById("viewDashboardBtn")?.addEventListener("click",guard);
  document.getElementById("getStartedBtn")?.addEventListener("click",()=>{launchConfetti();setTimeout(guard,900);});
  document.querySelectorAll("a[href]").forEach(l=>{
    const h=l.getAttribute("href");
    if(h&&!h.startsWith("http")&&!h.startsWith("#")&&!h.startsWith("mailto"))
      l.addEventListener("click",(e)=>{e.preventDefault();nav(h);});
  });
});