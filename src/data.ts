import corpus from './beauty-data.json';
import sceneCorpus from './scene-data.json';
import {sceneCards,scenes} from './scene-content';
export type Evidence={id:string;noteId:string;kind:'body'|'comment'|'image';author:string;text:string;label:string;date:string;image?:string;images?:string[];parent?:string|null;ai?:boolean;location?:string;likes?:string};
export type Fact={text:string;refs:string[]};
export type Candidate={id:string;name:string;tag?:string;intro?:string;preparation?:Fact[];steps?:Fact[];route?:Fact[];timing?:Fact[];image?:string;nameRefs?:string[];basis?:Fact[];usage?:Fact[];cautions?:Fact[];differences?:Fact[]};
export type BeautyCard={noteId:string;title:string;context?:Fact[];candidates:Candidate[]};
export type Note={id:string;title:string;author:string;url:string;date:string;body:{id:string;text:string;tags:boolean}[];metrics:{likes:string;collects:string;comments:string};images:string[];comments:Evidence[]};
export const notes=[...corpus.notes,...sceneCorpus.notes] as Note[];
export const sources={...corpus.sources,...sceneCorpus.sources} as Record<string,Evidence>;
export const cards=[...corpus.cards,...sceneCards] as BeautyCard[];
export const sections:{key:'basis'|'usage'|'cautions'|'differences'|'preparation'|'steps'|'route'|'timing';label:string}[]=[{key:'preparation',label:'准备什么'},{key:'route',label:'路线怎么走'},{key:'steps',label:'照着做'},{key:'timing',label:'时间安排'},{key:'basis',label:'评价依据'},{key:'usage',label:'怎么用'},{key:'cautions',label:'选择前留意'},{key:'differences',label:'不同体验'}];
export const queries=scenes.map(s=>s.query);
export const AS='/assets/content/';

export const sectionsFor=(id:string)=>sections.map(s=>s.key==='steps'?{...s,label:id.startsWith('citywalk')?'沿途怎么逛':'操作步骤'}:s);
