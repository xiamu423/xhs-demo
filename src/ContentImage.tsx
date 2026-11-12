import {useId,type CSSProperties} from 'react';
import frames from './media-frames.json';
/** Display the captured photograph through its viewport, never the surrounding browser UI. */
export function ContentImage({src,alt,className,loading,style}:{src:string;alt:string;className?:string;loading?:'lazy'|'eager';style?:CSSProperties}){
 const clipId='photo-'+useId().replace(/:/g,'');
 const frame=(frames as Record<string,number[]>)[src];
 if(!frame)return <img src={src} alt={alt} className={className} loading={loading} style={style}/>;
 const [x,y,w,h]=frame;
 return <svg className={'content-image '+(className||'')} role="img" aria-label={alt} viewBox={`${x} ${y} ${w} ${h}`} preserveAspectRatio={className?.includes('tile-cover')?'xMidYMid slice':'xMidYMid meet'} style={{aspectRatio:`${w}/${h}`,...style}}><defs><clipPath id={clipId}><rect x={x} y={y} width={w} height={h}/></clipPath></defs><image clipPath={`url(#${clipId})`} href={src} x="0" y="0" width="2664" height="1594"/></svg>;
}
