import {sceneExtras} from './scene-content';
import {cards, sources, type Candidate, type Fact} from './data';
import {aiCandidates, commentRef, imageRef} from './ai-content';

export type TaskQuestion={id:string;noteId:string;title:string;questionRef:string;answerRefs:string[];candidateId?:string};
export type TaskUpdate={id:string;title:string;text:string;updatedAt:string;refs:string[];candidateId?:string};
export type TaskExtras={intro:string;tabLabels?:Record<string,string>;order?:string[];notices?:Fact[];discussions?:Fact[];questions?:TaskQuestion[];updates?:TaskUpdate[]};
export const taskExtras:Record<string,TaskExtras>={
 ...sceneExtras,
 beauty_01:{
  intro:'偏爱粉色、想兼顾闪片和眼线？按妆效切换，找到自己的第一盘。',
  tabLabels:{pink:'日常粉色',taro:'粉紫闪片',brown:'全哑光',butter:'粉棕配色',wakemake:'跨品牌搭配'},
  order:['pink','taro','brown','butter','wakemake'],
  notices:[{text:'如果你也想一盘兼顾闪片、眼线色和卧蚕，先确认最在意哪两项，再核对方案里的具体用法。',refs:['beauty_01:body:002']},{text:'不喜欢橘调或大地色的话，先从粉色方向比较；别因为别人回购，就忽略自己的配色偏好。',refs:['beauty_01:body:001',commentRef(1,10)]}],
  discussions:[{text:'同样想要闪片，有人喜欢芋泥的上眼效果，也有人不满意。可以结合取粉方式和试色一起判断。',refs:[commentRef(1,19),commentRef(1,69),commentRef(1,82),commentRef(1,84)]}],
  questions:[{id:'q-pink-purple',noteId:'beauty_01',title:'裸砂粉有紫调吗？想要中性粉。',questionRef:commentRef(1,133),answerRefs:[commentRef(1,134),commentRef(1,135)],candidateId:'pink'},{id:'q-holika',noteId:'beauty_01',title:'HOLIKA 97 适合画内眼线和下至吗？',questionRef:commentRef(1,13),answerRefs:[commentRef(1,14)],candidateId:'wakemake'}],
 },
 beauty_02:{
  intro:'按系列或原帖图序切换，把配色评价和不同上眼体验放在一起看。',
  notices:[{text:'选之前先对照原帖图片确认配色。这里的主要参考是作者自述的黄二白配色体验。',refs:['beauty_02:title','beauty_02:body:001']},{text:'别仅凭肤色接近就照搬结论：奈娃联名在作者与评论者之间，也有显肿与不显肿的不同感受。',refs:[imageRef(11),commentRef(2,109)]}],
  discussions:[{text:'闪片是否好用、是否够闪，图 5 的作者体验与评论反馈不同。很在意质感的话，先核对两边的具体描述。',refs:[imageRef(5),commentRef(2,94)]}],
  questions:[{id:'q-series',noteId:'beauty_02',title:'原帖图 10、11、14 分别是什么盘？',questionRef:commentRef(2,37),answerRefs:[commentRef(2,38)]},{id:'q-orange',noteId:'beauty_02',title:'想画淡橘色或杏色妆容，该怎么选？',questionRef:commentRef(2,28),answerRefs:[commentRef(2,29),commentRef(2,30),commentRef(2,31)]}],
 },
};
export const planLabel=(noteId:string,item:Candidate)=>taskExtras[noteId]?.tabLabels?.[item.id]||(noteId.startsWith('beauty')?undefined:item.tag)||(item.name.startsWith('第 ')?item.tag||item.name:item.name);
export const planIntro=(noteId:string,item:Candidate)=>item.intro||aiCandidates.find(c=>c.noteId===noteId&&c.id===item.id)?.text||({butter:'如果你想试粉棕配色，可以先看黄油慕斯。原讨论中有相近需求的用户购买，并补充了偏粉、也带棕色的配色感受。',wakemake:'如果你接受跨品牌搭配，可以考虑 WAKEMAKE 8 号，并另配 HOLIKA 97 作眼线色。先确认自己是否愿意分开购买。'}[item.id])||'先对照这盘的原图与配色反馈，再决定是否符合你想要的妆效。';
export const orderedPlans=(noteId:string)=>{const card=cards.find(c=>c.noteId===noteId)!;const order=taskExtras[noteId]?.order;return order?order.map(id=>card.candidates.find(c=>c.id===id)!):card.candidates;};
export const visibleUpdates=(noteId:string)=>(taskExtras[noteId]?.updates||[]).filter(u=>u.title&&u.text&&u.updatedAt&&u.refs.length&&u.refs.every(id=>sources[id]&&!sources[id].ai));
for(const [noteId,extra] of Object.entries(taskExtras)){
 const ids=[...(extra.notices||[]).flatMap(f=>f.refs),...(extra.discussions||[]).flatMap(f=>f.refs),...(extra.questions||[]).flatMap(q=>[q.questionRef,...q.answerRefs])];
 for(const id of ids)if(!sources[id]||sources[id].noteId!==noteId||sources[id].ai)throw new Error(`Invalid task source: ${id}`);
}
