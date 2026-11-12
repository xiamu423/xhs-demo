import {Fragment} from 'react';
import {notes,sources} from './data';

export function UserName({name}:{name:string}){
 const value=name.replace(/^「(.*)」$/u,'$1');
 return <span className="user-mention">「{value}」</span>;
}
const escapePattern=(value:string)=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

// AI-authored prose only. Match authors from its evidence, not arbitrary words
// from the full corpus; punctuation-only nicknames must not match prose.
export function UserMentions({text,refs=[]}:{text:string;refs?:string[]}){
 const names=new Set([...notes.map(n=>n.author),...refs.map(id=>sources[id]?.author).filter((n):n is string=>Boolean(n))].filter(n=>n.length>1&&/[\p{L}]/u.test(n)));
 if(names.has('小饼干（化妆版）'))names.add('小饼干');
 if(!names.size)return <>{text}</>;
 const pattern=new RegExp(`「?(?:${[...names].sort((a,b)=>b.length-a.length).map(escapePattern).join('|')})」?`,'gu');
 const parts=[];let offset=0;
 for(const match of text.matchAll(pattern)){
  parts.push(<Fragment key={'text-'+offset}>{text.slice(offset,match.index)}</Fragment>);
  parts.push(<UserName key={'name-'+match.index} name={match[0]}/>);
  offset=match.index!+match[0].length;
 }
 parts.push(<Fragment key={'tail-'+offset}>{text.slice(offset)}</Fragment>);
 return <>{parts}</>;
}
