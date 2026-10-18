(()=>{const $=id=>document.getElementById(id),G=window.OfficeGame;let wasPaused=false;function closeDrawer(){if(!$('drawer').classList.contains('hidden')){G.state.paused=wasPaused;$('drawer').classList.add('hidden')}document.querySelectorAll('[data-panel]').forEach(b=>b.classList.toggle('active',b.dataset.panel==='map'))}document.querySelectorAll('[data-panel]').forEach(b=>b.onclick=()=>{if(!G.state.running)return;if(b.dataset.panel==='map'){closeDrawer();return}if(b.dataset.panel==='phone'){closeDrawer();G.phone();return}if($('drawer').classList.contains('hidden'))wasPaused=G.state.paused;G.releaseInput();G.state.paused=true;$('drawer').dataset.panel=b.dataset.panel;$('drawer').classList.remove('hidden');document.querySelectorAll('[data-panel]').forEach(x=>x.classList.toggle('active',x===b))});$('closeDrawer').onclick=closeDrawer;for(const id of['phone','nearby','restart','credits']){$(id).addEventListener('click',()=>{$('drawer').classList.add('hidden')})}window.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});})();
(()=>{
 const zone=document.getElementById('joystick'),knob=document.getElementById('joystickKnob'),G=window.OfficeGame;
 let active=null,origin=null;
 function vector(x,y,max=38){const len=Math.hypot(x,y),strength=Math.min(1,len/max);if(strength<=.1)return{x:0,y:0,px:0,py:0};const power=(strength-.1)/.9;return{x:x/len*power,y:y/len*power,px:x/len*Math.min(len,max),py:y/len*Math.min(len,max)}}
 function apply(e){const v=vector(e.clientX-origin.x,e.clientY-origin.y);knob.style.transform=`translate(${v.px}px,${v.py}px)`;G.setStick(v.x,v.y)}
 function stop(e){if(e&&e.pointerId!==undefined&&e.pointerId!==active)return;const old=active;active=null;origin=null;knob.style.transform='translate(0px,0px)';zone.classList.remove('held');G.setStick(0,0);if(old!==null&&zone.hasPointerCapture?.(old))zone.releasePointerCapture(old)}
 zone.addEventListener('pointerdown',e=>{e.preventDefault();if(active!==null||!G.state.running||G.state.paused||G.state.over)return;active=e.pointerId;const b=zone.getBoundingClientRect();origin={x:b.left+b.width/2,y:b.top+b.height/2};zone.setPointerCapture(e.pointerId);zone.classList.add('held');G.player.path=[];apply(e)});
 zone.addEventListener('pointermove',e=>{if(e.pointerId!==active)return;e.preventDefault();if(G.state.paused||G.state.over){stop(e);return}apply(e)});
 for(const name of['pointerup','pointercancel','lostpointercapture'])zone.addEventListener(name,stop);
 window.addEventListener('blur',()=>stop());window.addEventListener('office-input-reset',()=>stop());
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
 window.OfficeStick={vector,stop};
})();
