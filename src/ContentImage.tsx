import type {CSSProperties} from 'react';
import assets from './image-assets.json';

type ImageAsset = {preview:string;detail:string;width:number;height:number;cropped:boolean};
type Props = {src:string;alt:string;className?:string;loading?:'lazy'|'eager';style?:CSSProperties;variant?:'preview'|'detail'};

/** Pre-cropped, compressed images reserve their layout before the network responds. */
export function ContentImage({src,alt,className,loading='lazy',style,variant='detail'}:Props){
 const asset=(assets as Record<string,ImageAsset>)[src];
 return <img src={asset?.[variant]||src} alt={alt}
   className={[asset?.cropped?'content-image':'',className].filter(Boolean).join(' ')}
   width={asset?.width} height={asset?.height} loading={loading} decoding="async"
   draggable={false} style={style}/>;
}
