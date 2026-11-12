import {sources} from './data';
export const commentRef=(note:number,id:number)=>`beauty_0${note}:comment:${String(id).padStart(6,'0')}`;
export const imageRef=(id:number)=>`beauty_02:media:${String(id).padStart(3,'0')}`;
export const answerRefs=[
 'beauty_01:body:001','beauty_01:body:002','beauty_02:title','beauty_02:body:001',
 ...[132,137,134,135,146,150,19,69,82,84,10,11].map(id=>commentRef(1,id)),
 ...[4,5,11].map(imageRef),...[38,41,94,109].map(id=>commentRef(2,id)),
];
export type AiCandidate={noteId:string;id:string;name:string;text:string;refs:string[];imageRefs?:string[];disputed?:boolean};
export const aiCandidates:AiCandidate[]=[
 {noteId:'beauty_01',id:'pink',name:'3CE 裸砂粉',text:'如果你偏爱日常粉色，可以先考虑裸砂粉。少冰五分糖的笔记中，黄一白用户香飘优乐美分享了高频使用体验；但她也补充有一两颗带一点紫调。',refs:[132,137,134,135].map(id=>commentRef(1,id))},
 {noteId:'beauty_01',id:'taro',name:'3CE 芋泥盘',text:'如果你喜欢粉紫色、也想要闪片，可以把芋泥盘列入候选。少冰五分糖的笔记中，有人喜欢它的上眼效果，也有人不满意闪片；很在意闪片质感的话，先看下面的试色再决定。',refs:[19,69,82,84].map(id=>commentRef(1,id)),imageRefs:[commentRef(1,84)],disputed:true},
 {noteId:'beauty_01',id:'brown',name:'3CE 深棕哑光',text:'如果你主要用哑光、愿意另配闪色，可以考虑深棕哑光。少冰五分糖的笔记中，夏咪黛吉分享了四年多的使用和回购体验，nekou丽则提醒缺细闪。如果你觉得大地色显疲惫，就不必优先选它。',refs:[commentRef(1,10),commentRef(1,11),'beauty_01:body:001']},
 {noteId:'beauty_02',id:'image-4',name:'花知晓 · 巧克力商店系列',text:'如果你在意盘里的颜色是否都用得上，可以把巧克力商店系列的这盘列入候选。LVnook 的笔记中，图 4 被评价为「好用，使用率高，无废色」；选购时要对照这张图确认具体配色。',refs:[imageRef(4),commentRef(2,41)],imageRefs:[imageRef(4)]},
 {noteId:'beauty_02',id:'image-5',name:'花知晓 · 原帖图 5',text:'如果你很在意闪片是否好取粉、够不够闪，这盘建议先试色再决定。LVnook 在图 5 提到闪片硬、结块，但评论者我要透支卡觉得很好用、很闪，两种体验都值得核对。',refs:[imageRef(5),commentRef(2,94)],imageRefs:[imageRef(5)],disputed:true},
 {noteId:'beauty_02',id:'image-11',name:'花知晓 · 奈娃联名',text:'如果你在看奈娃联名、又担心显肿，先对照上眼效果再决定。LVnook 在图 11 觉得显肿，但笔记里一位黄一白用户反馈不显肿、显色够；不能只凭肤色接近就直接照搬结论。',refs:[imageRef(11),commentRef(2,38),commentRef(2,109)],imageRefs:[imageRef(11)],disputed:true},
];
export type Followup={question:string;answer:string;refs:string[];noteId?:string;candidateId?:string};
export function respondToBeauty(question:string):Followup{
 if(/预算|价格|多少.?钱|元|便宜/.test(question))return {question,answer:'如果预算是首要条件，可以先比较符合妆效偏好的候选，再核对当前售价。这两篇没有足够、可比的价格信息，暂时不能据此按价格排序。',refs:['beauty_01:body:002','beauty_02:body:001'],noteId:'beauty_01'};
 if(/花知晓|奈娃|黄二白/.test(question))return {question,answer:'如果你想选花知晓、又担心显肿，可以先对照奈娃联名的两种体验。LVnook 的笔记里，作者觉得显肿，黄一白评论者却觉得不显肿；建议核对上眼效果后再决定。',refs:[imageRef(11),commentRef(2,109)],noteId:'beauty_02',candidateId:'image-11'};
 if(/闪片|珠光|芋泥/.test(question))return {question,answer:'如果你喜欢粉紫色、想要闪片，可以先考虑芋泥盘。少冰五分糖的笔记中，有人喜欢它的上眼效果，也有人不满意；建议先看搓细后上眼的试色，再判断是不是你想要的质感。',refs:[19,69,82,84].map(id=>commentRef(1,id)),noteId:'beauty_01',candidateId:'taro'};
 if(/粉色|裸砂|黄皮|黄一白|3ce|日常|新手/i.test(question))return {question,answer:'如果你偏爱日常粉色，可以先考虑裸砂粉。少冰五分糖的笔记中，黄一白用户分享了高频使用体验，但也补充有少量紫调；如果你不喜欢紫调，先核对原文再决定。',refs:[132,137,134,135].map(id=>commentRef(1,id)),noteId:'beauty_01',candidateId:'pink'};
 return {question,answer:'这两篇能帮助你比较配色、闪片和个人上眼体验。你可以继续问「偏爱粉色怎么选」「想要闪片」或「想看花知晓」；其他问题目前没有足够的原文依据。',refs:['beauty_01:body:001','beauty_02:body:001']};
}
// Fail loudly during development if an authored answer loses its provenance.
for(const id of [...answerRefs,...aiCandidates.flatMap(c=>c.refs)]){
 if(!sources[id]||sources[id].ai)throw new Error(`Invalid answer source: ${id}`);
}
