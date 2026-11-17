"use strict";
const PHONE="919398530393",MAIL="academy@cydnex.com";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

/* mobile menu */
const menu=$("#menu"),links=$("#links");
if(menu&&links){menu.addEventListener("click",()=>{const o=links.classList.toggle("open");menu.setAttribute("aria-expanded",String(o))});
links.addEventListener("click",e=>{if(e.target.closest("a")){links.classList.remove("open");menu.setAttribute("aria-expanded","false")}});}

/* how-it-works progress line */
const steps=$("#steps");
if(steps){function prog(){const r=steps.getBoundingClientRect(),vh=innerHeight;
  const p=Math.min(1,Math.max(0,(vh*.8-r.top)/(r.height+vh*.2)));steps.style.setProperty("--p",p.toFixed(3))}
addEventListener("scroll",prog,{passive:true});addEventListener("resize",prog);prog();}

/* enquiry: a few fields to a friendly message */
if($("#form")){
const f={n:$("#n"),p:$("#p"),e:$("#e"),w:$("#w"),s:$("#s"),m:$("#m"),r:$("#r"),pc:$("#pc"),ag:$("#ag")},wa=$("#wa"),em=$("#em"),st=$("#st");
const tidy=t=>{t=t.replace(/\s+/g," ").trim();if(!t)return"";t=t[0].toUpperCase()+t.slice(1);return/[.!?]$/.test(t)?t:t+"."};
const an=w=>/^[aeiou]/i.test(w)?"an":"a";
function message(){
  const n=f.n.value.trim()||"[your name]",e=f.e.value.trim()||"[your email]",ph=f.p.value.trim()||"[your mobile]";
  const who=f.w.value.toLowerCase(),c=f.s.value,mode=f.m.value;
  const want=c==="Free weekly webinar"?"I would like to join the free weekly webinar."
    :c?`I am interested in the ${c} course${mode==="Not sure yet"?"":" ("+mode.toLowerCase()+")"}.`
    :`I would like help choosing the right course${mode==="Not sure yet"?"":" ("+mode.toLowerCase()+")"}.`;
  const extra=tidy(f.r.value);
  return `Hello Cydnex Academy team,\n\nMy name is ${n} and I am ${an(who)} ${who}. ${want}${extra?" "+extra:""}\n\nPlease call me on ${ph} or email me at ${e}.\n\nThank you,\n${n}`;
}
const bad=(el,msg)=>{el.setAttribute("aria-invalid","true");$("#"+el.id+"-e").textContent=msg;return false};
const ok=el=>{el.removeAttribute("aria-invalid");$("#"+el.id+"-e").textContent="";return true};
function valid(show){
  let good=true;
  const chk=(el,test,msg)=>{if(test){ok(el)}else{good=false;if(show)bad(el,msg)}};
  chk(f.n,f.n.value.trim().length>1,"Enter your name.");
  chk(f.p,/^[+()\d][\d\s()-]{6,19}$/.test(f.p.value.trim()),"Enter your mobile number so a counsellor can call you.");
  chk(f.e,/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.e.value.trim()),"Enter a valid email address.");
  chk(f.pc,f.pc.checked,"Please agree to the Privacy Policy so we can reply.");
  chk(f.ag,f.ag.checked,"Please confirm your age or guardian permission.");
  return good;
}
function refresh(){
  const m=message();
  $("#pvt").textContent=m;
  const subj=`Course enquiry: ${f.s.value||"Help choosing a course"} - ${f.n.value.trim()||"New student"}`;
  wa.href=`https://wa.me/${PHONE}?text=${encodeURIComponent(m)}`;
  em.href=`mailto:${MAIL}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(m)}`;
  const g=valid(false);
  wa.setAttribute("aria-disabled",String(!g));em.setAttribute("aria-disabled",String(!g));
}
Object.values(f).forEach(el=>el.addEventListener(el.type==="checkbox"||el.tagName==="SELECT"?"change":"input",()=>{refresh();if(el.hasAttribute("aria-invalid"))valid(true)}));
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
const pick=()=>{const want=new URLSearchParams(location.search).get("course");
  if(want&&[...f.s.options].some(o=>o.text===want))f.s.value=want;refresh()};
pick();
$$('a[href*="?course="]').forEach(a=>a.addEventListener("click",e=>{
  const u=new URL(a.href,location.href);history.replaceState(null,"",u.search+"#enquire");pick();
}));
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
