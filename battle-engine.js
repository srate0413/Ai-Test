/* Original turn-based office-comedy rules. No code copied from reference projects. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.OfficeBattle=api})(typeof window!=='undefined'?window:this,()=>{
'use strict';
const profiles={
 gm:{hp:132,title:'总经理',weak:'需求变更',moves:[['画饼充饥',15,'drain'],['临时需求',19,'hit'],['酝酿周末加班',0,'charge'],['周末加班通知',35,'heavy']]},
 vice:{hp:116,title:'副总经理',weak:'会议连环套',moves:[['这个再改一下',18,'hit'],['拉个会对齐',14,'drain'],['准备绩效面谈',0,'charge'],['绩效三连问',31,'heavy']]},
 finance:{hp:94,title:'财务',weak:'卡报销',moves:[['发票不合规',17,'hit'],['缺一张附件',12,'drain'],['月底关账',25,'heavy']]},
 hr:{hp:96,title:'人事',weak:'会议连环套',moves:[['五分钟谈心',14,'drain'],['满意度问卷',18,'hit'],['企业文化考试',25,'heavy']]},
 coal:{hp:86,title:'煤炭事业部',weak:'优惠券攻击',moves:[['煤炭行情十连问',16,'hit'],['吨位报表',19,'hit'],['想喝奶茶',0,'rest']]},
 maintenance:{hp:84,title:'后勤',weak:'需求变更',moves:[['你去干什么',14,'drain'],['门锁还没好',19,'hit'],['核对报修工单',0,'charge'],['再说清楚一点',25,'heavy']]},
 worker:{hp:76,title:'G01 同事',weak:'卡报销',moves:[['拉你进工作群',14,'hit'],['报销还没过',13,'drain'],['顺便帮个忙',20,'heavy']]}
};
const skills=[
 {id:'counter',name:'这事有邮件吗？',detail:'预判反制：挡住重击并反弹；普通招式只能挡 8',cost:2,cd:2},
 {id:'ultimate',name:'按时下班宣言',detail:'消耗 100 士气 · 48 穿透伤害 + 回复 18 心态',cost:0,damage:48},
 {id:'evidence',name:'聊天记录拍桌',detail:'消耗 1 份证据 · 32 穿透伤害 + 削掉全部架势',cost:1,damage:32},
 {id:'reply',name:'收到，稍后回复',detail:'18 伤害 · 回复 1 灵感；连用会被识破',cost:0,damage:18},
 {id:'invoice',name:'卡报销',detail:'16 伤害 + 两回合流程伤害；同事／财务弱点',cost:3,damage:16,cd:2},
 {id:'coupon',name:'优惠券攻击',detail:'20 伤害；阿炭弱点 · 消耗 1 张券',cost:2,damage:20,cd:1},
 {id:'scope',name:'需求变更',detail:'工程师专属 · 28 伤害，经理／后勤弱点',cost:4,damage:28,cd:2,identity:13},
 {id:'meeting',name:'会议连环套',detail:'兼助理专属 · 20 伤害；打断蓄力或重击',cost:4,damage:20,cd:3,identity:14},
 {id:'shield',name:'甩锅护盾',detail:'获得 27 护盾，挡住对方下一招',cost:2,cd:2},
 {id:'notes',name:'假装认真记笔记',detail:'回复 4 灵感 + 8 护盾',cost:0},
 {id:'water',name:'带薪喝水',detail:'回复 28 心态 · 每场限 2 次',cost:1,cd:2}
];
function create(role,identity,opts={}){const p=profiles[role]||profiles.worker;return{role,identity,phase:'player',turn:1,hp:opts.hp??120,maxHp:120,energy:8,maxEnergy:10,enemyHp:p.hp,maxEnemyHp:p.hp,profile:p,stance:3,maxStance:3,broken:0,morale:0,evidence:opts.evidence??0,ally:!!opts.ally,allyUsed:false,stage:1,lastId:'',repeat:0,enemyShield:0,shield:0,dot:0,dotTurns:0,skip:0,coupons:opts.coupons??3,waters:2,cooldowns:{},moveIndex:0,messages:['先看预告：重击用反制，弱点削架势；破防后追击，士气满放大招。'],lastAction:'',turnTaken:false}}
function available(b){return skills.filter(s=>!s.identity||s.identity===b.identity).map(s=>({...s,disabled:b.phase!=='player'||b.energy<s.cost||(b.cooldowns[s.id]||0)>0||(s.id==='coupon'&&b.coupons<1)||(s.id==='water'&&b.waters<1)||(s.id==='ultimate'&&b.morale<100)||(s.id==='evidence'&&b.evidence<1),cooldown:b.cooldowns[s.id]||0}))}
function intent(b){const m=[...b.profile.moves[b.moveIndex%b.profile.moves.length]];if(b.stage===2&&m[1]){m[0]='绩效暴走 · '+m[0];m[1]+=8}return m}
function add(b,t){b.messages.unshift(t);b.messages=b.messages.slice(0,7)}
function takeTurn(b,id){const s=available(b).find(s=>s.id===id);if(!s||s.disabled)return false;b.energy-=s.cost;b.turnTaken=true;b.lastAction=s.name;for(const key in b.cooldowns)b.cooldowns[key]=Math.max(0,b.cooldowns[key]-1);if(s.cd)b.cooldowns[s.id]=s.cd;
 const next=intent(b);b.repeat=b.lastId===id?b.repeat+1:0;b.lastId=id;let damage=s.damage||0;let stagger=0;const wasBroken=b.broken>0;if(wasBroken)b.broken--;if(b.repeat>=1&&damage){damage=Math.round(damage*.55);add(b,'同一套话术被识破！换招才能打足伤害。')}if(s.name===b.profile.weak)stagger=2;else if(['invoice','scope','meeting','coupon'].includes(id))stagger=1;
 if(s.name===b.profile.weak){damage=Math.round(damage*1.65);add(b,'戳中弱点！对方的气势开始摇晃。')}
 if(id==='ultimate'){b.morale=0;b.hp=Math.min(120,b.hp+18);add(b,'终结技！打工人的晚霞不可辜负。')}if(id==='evidence'){b.evidence--;stagger=3;add(b,'白纸黑字摆上桌，对方无法继续打太极。')}if(id==='counter'){if(next[2]==='heavy'){b.shield+=next[1];damage=26;stagger=2;add(b,'精准反制！重击全挡，原话奉还。')}else{b.shield+=8;add(b,'反制时机不对，只获得 8 护盾。')}}
 if(id==='reply')b.energy=Math.min(10,b.energy+1);
 if(id==='invoice'){b.dot=6;b.dotTurns=2;add(b,'报销进入漫长流程：本回合起，连续两回合损失 6 气势。')}
 if(id==='coupon'){b.coupons--;if(b.dotTurns>0){damage+=10;add(b,'连携：报销变优惠券！额外 10 伤害。')}}
 if(id==='meeting'){if(next[2]==='heavy'||next[2]==='charge')b.skip=1;else add(b,'普通事务无法被会议打断，留给对方的大招更划算。')}
 if(id==='shield')b.shield+=27;
 if(id==='notes'){b.energy=Math.min(10,b.energy+4);b.shield+=8}
 if(id==='water'){b.hp=Math.min(b.maxHp,b.hp+28);b.waters--;add(b,'喝一口水，把自己的心态捡回来 +28。')}
 if(wasBroken&&damage){damage=Math.round(damage*1.5);add(b,'破防追击！伤害 ×1.5。')}if(b.enemyShield&&damage&& !['ultimate','evidence'].includes(id)){const block=Math.min(damage,b.enemyShield);damage-=block;b.enemyShield-=block;add(b,'对方用流程护盾挡下 '+block+'。')}if(!wasBroken&&stagger){b.stance=Math.max(0,b.stance-stagger);if(b.stance===0){b.broken=2;b.skip=1;b.stance=3;add(b,'BREAK！架势崩溃，本回合行动取消，接下来两招增伤。')}}b.morale=Math.min(100,b.morale+14+(stagger?6:0));b.enemyHp=Math.max(0,b.enemyHp-damage);add(b,`${s.name}${damage?'：对方气势 -'+damage:'：准备好了！'}`);
 if(b.dotTurns>0&&b.enemyHp>0){b.enemyHp=Math.max(0,b.enemyHp-b.dot);b.dotTurns--;add(b,'流程还在走，对方气势 -6。')}
 if(b.enemyHp<=0){b.phase='won';add(b,'对方的职场气势归零，论战获胜！');return true}
 if(b.stage===1&&['gm','vice'].includes(b.role)&&b.enemyHp<=b.maxEnemyHp*.5){b.stage=2;b.enemyShield=18;add(b,'第二阶段：老板撕掉日程表！获得 18 护盾，后续伤害 +8。')}const [title,power,kind]=next;
 if(b.skip>0){b.skip--;add(b,`对方被打断，跳过「${title}」。`)}
 else {const absorbed=Math.min(b.shield,power);b.shield-=absorbed;const loss=power-absorbed;b.hp=Math.max(0,b.hp-loss);if(kind==='drain')b.energy=Math.max(0,b.energy-2);add(b,`${title}：${power?`心态 -${loss}${absorbed?'（护盾挡下 '+absorbed+'）':''}`:'对方正在蓄力，下一回合要小心。'}${kind==='drain'?'，灵感 -2':''}`)}
 if(b.ally&&!b.allyUsed&&b.hp>0&&b.hp<50){b.allyUsed=true;b.hp=Math.min(120,b.hp+25);add(b,'阿炭奶茶支援！心态 +25（每场一次）。')}b.moveIndex++;if(b.hp<=0){b.phase='lost';add(b,'心态归零，今天先被工作留住了。');return true}b.energy=Math.min(10,b.energy+1);b.turn++;return true}
function retreat(b){if(b.phase!=='player'||b.energy<3)return false;b.energy-=3;b.phase='escaped';add(b,'花 3 灵感打个圆场，暂时脱身。');return true}
return{create,available,intent,takeTurn,retreat,profiles};
});
