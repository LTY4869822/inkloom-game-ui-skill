// Original compact adapter inspired by INKWAVE. Keep ../INKWAVE-LICENSE.txt with this preset.
// Optional source-study swatches, not the allowed set of project colors.
export const inkPalettes = [
  ['#ff8a14','#2f5bff'],['#ff3f9e','#18d48c'],['#f2e312','#8a3cff'],
  ['#10d2e6','#ff4150'],['#a6f01a','#e02cd8'],['#ffd21a','#2a52ff']
];
const isHex = value => typeof value==='string' && /^#[0-9a-f]{6}$/i.test(value);
const luminance = hex => {
  const rgb = hex.slice(1).match(/../g).map(v => parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
  return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
};
export function contrastRatio(a,b) {
  if(!isHex(a)||!isHex(b))throw new TypeError('Expected #rrggbb colors');
  const x=luminance(a),y=luminance(b);
  return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
const onColor=(fill,ink='#15121c')=>contrastRatio(fill,ink)>=4.5?ink:contrastRatio(fill,'#ffffff')>=4.5?'#ffffff':'#000000';
export function setInkPalette(root,a,b) {
  if(!isHex(a)||!isHex(b))throw new TypeError('Expected #rrggbb palette');
  for(const [key,color] of [['a',a],['b',b]]) {
    root.style.setProperty(`--ink-${key}`,color);
    root.style.setProperty(`--ink-${key}-on`,onColor(color));
  }
}

// Applies a reasoned project theme; does not infer lore, choose layouts, or change game rules.
export function applyInkTheme(root,theme) {
  const roles={ink:'k',surface:'surface',surfaceAlt:'k3',text:'text',muted:'muted',primary:'a',secondary:'b',action:'action',focus:'focus',danger:'danger',ring:'ring'};
  const colors=theme?.colors;
  if(!colors||typeof colors!=='object')throw new TypeError('A theme.colors object is required');
  const entries=[];
  for(const [role,token] of Object.entries(roles)) {
    if(!isHex(colors[role]))throw new TypeError(`theme.colors.${role} must be #rrggbb`);
    entries.push([`--ink-${token}`,colors[role]]);
  }
  const motion=theme.motion??{};
  const values={focusMs:['focus-ms',0,2000,'ms'],floodMs:['flood-ms',0,2000,'ms'],pressMs:['press-ms',0,1000,'ms'],enterMs:['enter-ms',0,3000,'ms'],staggerMs:['stagger-ms',0,500,'ms'],focusScale:['focus-scale',1,1.1,''],focusShiftPx:['focus-shift',0,24,'px'],pressScale:['press-scale',.85,1,''],enterOffsetPx:['enter-offset',0,100,'px'],enterScale:['enter-scale',.5,1,'']};
  for(const [key,[token,min,max,unit]] of Object.entries(values)) {
    const value=motion[key];
    if(value===undefined)continue;
    if(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max)throw new TypeError(`theme.motion.${key} must be between ${min} and ${max}`);
    entries.push([`--ink-${token}`,`${value}${unit}`]);
  }
  if(motion.spring!==undefined) {
    const p=motion.spring;
    if(!Array.isArray(p)||p.length!==4||!p.every(v=>typeof v==='number'&&Number.isFinite(v))||p[0]<0||p[0]>1||p[2]<0||p[2]>1)throw new TypeError('theme.motion.spring must be a valid cubic-bezier array');
    entries.push(['--ink-spring',`cubic-bezier(${p.join(',')})`]);
  }
  // Validate everything before changing live UI, so invalid input cannot leave a partial theme.
  for(const [key,value] of entries)root.style.setProperty(key,value);
  root.style.setProperty('--ink-k2',colors.surface);
  for(const [token,fill] of [['a',colors.primary],['b',colors.secondary],['action',colors.action],['danger',colors.danger]])root.style.setProperty(`--ink-${token}-on`,onColor(fill,colors.ink));
  root.style.setProperty('--ink-ring-on',onColor(colors.ring,colors.ink));
  // A partial motion object resets omitted fields to CSS defaults, rather than leaking the prior theme.
  for(const [key,[token]] of Object.entries(values))if(motion[key]===undefined)root.style.removeProperty(`--ink-${token}`);
  if(motion.spring===undefined)root.style.removeProperty('--ink-spring');
}

// Native click remains the activation source. The owner handles ink-action and game state.
export function mountInkFeedback(root,{sound=()=>{}}={}) {
  const ctrl=new AbortController(),options={signal:ctrl.signal},pressed=new Set();
  let lastSound=-Infinity,disposed=false;
  const button=target=>target?.closest?.('.ink-button');
  const valid=b=>b&&root.contains(b)&&!b.disabled&&b.getAttribute('aria-disabled')!=='true';
  const emitSound=(kind)=>{const now=performance.now();if(now-lastSound>35){lastSound=now;sound(kind);}};
  const focus=(b,kind)=>{
    if(!valid(b))return;
    const changed=!b.classList.contains('is-focus');
    root.querySelectorAll('.ink-button.is-focus').forEach(x=>{if(x!==b)x.classList.remove('is-focus');});
    b.classList.add('is-focus');if(changed)emitSound(kind);
  };
  const release=()=>{pressed.forEach(b=>b.classList.remove('is-pressed'));pressed.clear();};
  const reset=()=>{release();root.querySelectorAll('.is-focus').forEach(b=>b.classList.remove('is-focus'));};
  root.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch')return;
    const b=button(e.target);if(!valid(b))return;
    const r=b.getBoundingClientRect();
    b.style.setProperty('--ink-mx',`${Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100))}%`);
    b.style.setProperty('--ink-my',`${Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100))}%`);
    focus(b,'hover');
  },options);
  root.addEventListener('pointerout',e=>{const b=button(e.target);if(b&&!b.contains(e.relatedTarget)&&b!==document.activeElement)b.classList.remove('is-focus','is-pressed');},options);
  root.addEventListener('focusin',e=>{const b=button(e.target);if(b)focus(b,'hover');else root.querySelectorAll('.ink-button.is-focus').forEach(x=>x.classList.remove('is-focus'));},options);
  root.addEventListener('focusout',e=>{const b=button(e.target);if(b)b.classList.remove('is-focus','is-pressed');},options);
  root.addEventListener('pointerdown',e=>{const b=button(e.target);if(valid(b)&&e.button===0){focus(b,'hover');pressed.add(b);b.classList.add('is-pressed');}},options);
  root.addEventListener('keydown',e=>{
    const b=button(e.target);if(!valid(b))return;
    if(e.key==='Enter'||e.key===' '){if(e.repeat){e.preventDefault();return;}pressed.add(b);b.classList.add('is-pressed');}
    if(!b.hasAttribute('data-ink-nav')||!['ArrowUp','ArrowDown','Home','End'].includes(e.key))return;
    const group=b.dataset.inkGroup||'';
    const list=[...root.querySelectorAll('.ink-button[data-ink-nav]')].filter(x=>valid(x)&&x.getClientRects().length&&(x.dataset.inkGroup||'')===group);
    const i=list.indexOf(b);if(i<0)return;
    const index=e.key==='Home'?0:e.key==='End'?list.length-1:Math.max(0,Math.min(list.length-1,i+(e.key==='ArrowDown'?1:-1)));
    e.preventDefault();
    if(index===i){emitSound('error');return;}
    const next=list[index];next.style.setProperty('--ink-mx','50%');next.style.setProperty('--ink-my',e.key==='ArrowUp'?'100%':'0%');
    next.focus({preventScroll:true});next.scrollIntoView({block:'nearest',inline:'nearest'});
  },options);
  root.addEventListener('click',e=>{
    const b=button(e.target);if(!b)return;if(!valid(b)){e.preventDefault();return;}
    release();focus(b,'hover');emitSound('click');
    if(b.dataset.inkAction) b.dispatchEvent(new CustomEvent('ink-action',{bubbles:true,detail:{action:b.dataset.inkAction}}));
  },options);
  window.addEventListener('pointerup',release,options);
  window.addEventListener('pointercancel',release,options);
  window.addEventListener('keyup',release,options);
  window.addEventListener('blur',reset,options);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();},options);
  return ()=>{if(disposed)return;disposed=true;ctrl.abort();reset();};
}
