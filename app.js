"use strict";
const BRAND="Cydnex",PHONE="919398530393",MAIL="security@cydnex.com";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
$$("[data-b]").forEach(e=>e.textContent=BRAND);
$$("[data-mail]").forEach(e=>e.textContent=MAIL);


/* mobile menu */
const menu=$("#menu"),links=$("#links");
if(menu&&links){menu.addEventListener("click",()=>{const o=links.classList.toggle("open");menu.setAttribute("aria-expanded",String(o))});
links.addEventListener("click",e=>{if(e.target.closest("a")){links.classList.remove("open");menu.setAttribute("aria-expanded","false")}});}

/* service filter */
$$(".chip").forEach(c=>c.addEventListener("click",()=>{
  $$(".chip").forEach(x=>x.setAttribute("aria-pressed",String(x===c)));
  $$("#grid .card").forEach(k=>{k.hidden=!(c.dataset.f==="all"||k.dataset.g===c.dataset.f)});
}));

/* approach progress line */
const steps=$("#steps");
if(steps){function prog(){const r=steps.getBoundingClientRect(),vh=innerHeight;
  const p=Math.min(1,Math.max(0,(vh*.8-r.top)/(r.height+vh*.2)));steps.style.setProperty("--p",p.toFixed(3))}
addEventListener("scroll",prog,{passive:true});addEventListener("resize",prog);prog();}

/* training rail */
const rail=$("#rail");
if(rail&&$("#prev")){$("#prev").addEventListener("click",()=>rail.scrollBy({left:-320,behavior:"smooth"}));
$("#next").addEventListener("click",()=>rail.scrollBy({left:320,behavior:"smooth"}));}

/* contact: plain text to a formal message */
if($("#form")){
const f={n:$("#n"),e:$("#e"),c:$("#c"),p:$("#p"),s:$("#s"),r:$("#r"),pc:$("#pc"),ag:$("#ag")},wa=$("#wa"),em=$("#em"),st=$("#st");
const tidy=t=>{t=t.replace(/\s+/g," ").trim();if(!t)return"";t=t[0].toUpperCase()+t.slice(1);return/[.!?]$/.test(t)?t:t+"."};
function message(){
  const n=f.n.value.trim()||"[your name]",c=f.c.value.trim()||"myself",e=f.e.value.trim()||"[your email]";
  const ph=f.p.value.trim(),reach=ph?`${e} or ${ph}`:e;
  const svc=f.s.value?` We are interested in ${f.s.value.toLowerCase()}.`:"";
  const req=tidy(f.r.value)||"[your requirement]";
  return `Dear ${BRAND} Team,\n\nI hope this message finds you well.\n\nMy name is ${n}, and I am writing on behalf of ${c}.${svc} Our requirement is as follows: ${req}\n\nI would be grateful if you could review this and suggest a convenient time for a call to discuss next steps. You can reach me at ${reach}.\n\nThank you for your time and consideration.\n\nKind regards,\n${n}\n${c}`;
}
const bad=(el,msg)=>{el.setAttribute("aria-invalid","true");$("#"+el.id+"-e").textContent=msg;return false};
const ok=el=>{el.removeAttribute("aria-invalid");$("#"+el.id+"-e").textContent="";return true};
function valid(show){
  let good=true;
  const chk=(el,test,msg)=>{if(test){ok(el)}else{good=false;if(show)bad(el,msg)}};
  chk(f.n,f.n.value.trim().length>1,"Enter your name.");
  chk(f.e,/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.e.value.trim()),"Enter a valid email address.");
  chk(f.p,!f.p.value.trim()||/^[+()\d][\d\s()-]{6,19}$/.test(f.p.value.trim()),"Enter a valid mobile number, or leave it empty.");
    chk(f.r,f.r.value.trim().length>=10,"Describe what you need in a few words.");
  chk(f.pc,f.pc.checked,"Please agree to the Privacy Policy so we can reply.");
  chk(f.ag,f.ag.checked,"Please confirm your age or guardian permission.");
  return good;
}
function refresh(){
  const m=message();
  $("#pvt").textContent=m;
  const subj=`Enquiry: ${f.s.value||"Cybersecurity services"} - ${f.c.value.trim()||"New enquiry"}`;
  wa.href=`https://wa.me/${PHONE}?text=${encodeURIComponent(m)}`;
  em.href=`mailto:${MAIL}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(m)}`;
  const g=valid(false);
  wa.setAttribute("aria-disabled",String(!g));em.setAttribute("aria-disabled",String(!g));
}
Object.values(f).forEach(el=>el.addEventListener(el.type==="checkbox"?"change":"input",()=>{refresh();if(el.hasAttribute("aria-invalid"))valid(true)}));
$("#form").addEventListener("submit",e=>e.preventDefault());
[wa,em].forEach(a=>a.addEventListener("click",e=>{
  if(!valid(true)){e.preventDefault();st.textContent="Fill in the marked fields first.";return}
  st.textContent=a===wa?"WhatsApp should open in a new tab. If it does not, use Copy message.":`Your email app should open. If it does not, copy the message and send it to ${MAIL}.`;
}));
$("#cp").addEventListener("click",async()=>{
  if(!valid(true)){st.textContent="Fill in the marked fields first.";return}
  try{await navigator.clipboard.writeText(message());st.textContent="Message copied. Paste it into WhatsApp or an email."}
  catch(_){const r=document.createRange();r.selectNodeContents($("#pvt"));const s=getSelection();s.removeAllRanges();s.addRange(r);st.textContent="Select and copy the message above."}
});
const want=new URLSearchParams(location.search).get("service");
if(want&&[...f.s.options].some(o=>o.text===want))f.s.value=want;
refresh();
}

/* consent: optional Google Fonts only */
const FONT_URL="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap";
const ck=$("#ck");
function loadFonts(){if(document.getElementById("gf"))return;const l=document.createElement("link");l.id="gf";l.rel="stylesheet";l.href=FONT_URL;document.head.appendChild(l)}
function getC(){try{return localStorage.getItem("cydnex-consent")}catch(_){return null}}
function setC(v){try{localStorage.setItem("cydnex-consent",v)}catch(_){} ck.hidden=true;if(v==="yes")loadFonts()}
if(getC()==="yes")loadFonts();else if(!getC())ck.hidden=false;
$("#ck-yes").addEventListener("click",()=>setC("yes"));$("#ck-no").addEventListener("click",()=>setC("no"));
$("#cset").addEventListener("click",()=>{ck.hidden=false;$("#ck-no").focus()});
